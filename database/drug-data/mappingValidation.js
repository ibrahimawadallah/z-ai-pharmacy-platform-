/**
 * Mapping Validation System
 * Provides validation rules and review process for automated mappings
 */

import {
  getMappingMetadata,
  setMappingMetadata,
  getMappingsNeedingReview,
  QUALITY_LEVELS,
} from './mappingQuality.js';
import { recordUserFeedback, getDrugsNeedingReview } from './mappingMonitor.js';

// Validation rules
const VALIDATION_RULES = {
  // Minimum confidence threshold for auto-approval
  AUTO_APPROVE_THRESHOLD: 0.8,

  // Minimum usage count before requiring review
  MIN_USAGE_FOR_REVIEW: 5,

  // Maximum negative feedback before auto-flagging
  MAX_NEGATIVE_FEEDBACK: 3,

  // Categories that require manual review regardless of confidence
  REQUIRES_MANUAL_REVIEW: ['general', 'hormonal', 'psychiatric'],
};

/**
 * Validate a mapping based on rules
 */
export function validateMapping(drugName) {
  const normalized = drugName.toLowerCase();
  const metadata = getMappingMetadata(normalized);

  if (!metadata) {
    return {
      valid: false,
      reason: 'No metadata found',
      action: 'skip',
    };
  }

  // Check if already manually curated
  if (metadata.quality === QUALITY_LEVELS.MANUAL_CURATED) {
    return {
      valid: true,
      reason: 'Manually curated',
      action: 'approved',
    };
  }

  // Check if rejected
  if (metadata.quality === QUALITY_LEVELS.REJECTED) {
    return {
      valid: false,
      reason: 'Previously rejected',
      action: 'skip',
    };
  }

  // Check confidence threshold
  if (metadata.confidence && metadata.confidence >= VALIDATION_RULES.AUTO_APPROVE_THRESHOLD) {
    // High confidence - check if category requires review
    if (metadata.category && VALIDATION_RULES.REQUIRES_MANUAL_REVIEW.includes(metadata.category)) {
      return {
        valid: true,
        reason: 'High confidence but category requires review',
        action: 'review_required',
      };
    }

    return {
      valid: true,
      reason: 'High confidence auto-approved',
      action: 'auto_approved',
    };
  }

  // Low confidence - requires review
  if (metadata.confidence && metadata.confidence < VALIDATION_RULES.AUTO_APPROVE_THRESHOLD) {
    return {
      valid: true,
      reason: 'Low confidence requires review',
      action: 'review_required',
    };
  }

  // Check usage-based validation
  if (metadata.usageCount >= VALIDATION_RULES.MIN_USAGE_FOR_REVIEW) {
    // Check negative feedback
    const negativeFeedback = metadata.userFeedback.filter((f) => f.accurate === false).length;
    if (negativeFeedback >= VALIDATION_RULES.MAX_NEGATIVE_FEEDBACK) {
      return {
        valid: false,
        reason: 'Too many negative feedbacks',
        action: 'flag_for_review',
      };
    }
  }

  return {
    valid: true,
    reason: 'Pending validation',
    action: 'pending',
  };
}

/**
 * Auto-validate mappings based on rules
 */
export function autoValidateMappings() {
  const needsReview = getMappingsNeedingReview(1000);
  const results = {
    autoApproved: 0,
    requiresReview: 0,
    flagged: 0,
    skipped: 0,
  };

  for (const { drugName, metadata } of needsReview) {
    const validation = validateMapping(drugName);

    switch (validation.action) {
      case 'auto_approved':
        metadata.quality = QUALITY_LEVELS.AUTOMATED_HIGH;
        metadata.validationStatus = 'approved';
        results.autoApproved++;
        break;
      case 'review_required':
      case 'flag_for_review':
        metadata.quality = QUALITY_LEVELS.PENDING_REVIEW;
        metadata.validationStatus = 'needs_review';
        results.requiresReview++;
        break;
      case 'skip':
        results.skipped++;
        break;
      default:
        results.flagged++;
    }

    setMappingMetadata(drugName, metadata);
  }

  return results;
}

/**
 * Manual validation by reviewer
 */
export function manualValidate(drugName, validator, status, notes = '') {
  const normalized = drugName.toLowerCase();
  const metadata = getMappingMetadata(normalized);

  if (!metadata) {
    throw new Error(`No metadata found for drug: ${drugName}`);
  }

  metadata.markValidated(validator, status);

  if (status === 'approved') {
    metadata.quality = QUALITY_LEVELS.MANUAL_VERIFIED;
  } else if (status === 'rejected') {
    metadata.quality = QUALITY_LEVELS.REJECTED;
  }

  if (notes) {
    metadata.addFeedback({
      rating: status === 'approved' ? 5 : 1,
      accurate: status === 'approved',
      comments: notes,
      userId: validator,
    });
  }

  setMappingMetadata(normalized, metadata);

  return metadata;
}

/**
 * Get validation queue (mappings needing review)
 */
export function getValidationQueue(limit = 50) {
  const queue = [];

  // Get from quality system
  const needsReview = getMappingsNeedingReview(limit);
  for (const { drugName, metadata } of needsReview) {
    queue.push({
      drugName,
      metadata,
      priority: calculatePriority(metadata),
    });
  }

  // Get from monitoring system (negative feedback)
  const negativeFeedback = getDrugsNeedingReview(limit);
  for (const drug of negativeFeedback) {
    const metadata = getMappingMetadata(drug.drugName);
    if (metadata && !queue.find((q) => q.drugName === drug.drugName)) {
      queue.push({
        drugName: drug.drugName,
        metadata,
        priority: calculatePriority(metadata, drug.negativeFeedbackCount),
      });
    }
  }

  // Sort by priority
  return queue.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/**
 * Calculate priority score for review
 */
function calculatePriority(metadata, negativeCount = 0) {
  let priority = 0;

  // Higher usage = higher priority
  priority += metadata.usageCount * 10;

  // Negative feedback = very high priority
  priority += negativeCount * 100;

  // Low confidence = higher priority
  if (metadata.confidence) {
    priority += (1 - metadata.confidence) * 50;
  }

  // Pending review = higher priority
  if (metadata.quality === QUALITY_LEVELS.PENDING_REVIEW) {
    priority += 200;
  }

  return priority;
}

/**
 * Batch validate multiple mappings
 */
export function batchValidate(validations) {
  const results = {
    approved: 0,
    rejected: 0,
    errors: [],
  };

  for (const validation of validations) {
    try {
      manualValidate(
        validation.drugName,
        validation.validator,
        validation.status,
        validation.notes
      );

      if (validation.status === 'approved') {
        results.approved++;
      } else {
        results.rejected++;
      }
    } catch (error) {
      results.errors.push({
        drugName: validation.drugName,
        error: error.message,
      });
    }
  }

  return results;
}
