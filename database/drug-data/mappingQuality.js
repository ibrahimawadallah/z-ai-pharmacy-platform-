/**
 * Mapping Quality Management System
 * Tracks quality flags, validation status, and monitoring data for drug-ICD10 mappings
 */

// Quality levels for mappings
export const QUALITY_LEVELS = {
  MANUAL_CURATED: 'manual_curated', // Manually reviewed and verified
  MANUAL_VERIFIED: 'manual_verified', // Manually added but needs review
  AUTOMATED_HIGH: 'automated_high', // Automated with high confidence
  AUTOMATED_MEDIUM: 'automated_medium', // Automated with medium confidence
  AUTOMATED_LOW: 'automated_low', // Automated with low confidence (generic category)
  PENDING_REVIEW: 'pending_review', // Needs manual review
  REJECTED: 'rejected', // Flagged as incorrect
};

// Confidence scores for automated mappings
export const CONFIDENCE_SCORES = {
  HIGH: 0.8, // Pattern-matched to specific drug class
  MEDIUM: 0.6, // Package name matched or generic category
  LOW: 0.4, // Generic fallback category
};

// Mapping metadata structure
export class MappingMetadata {
  constructor(drugName, quality, source, confidence = null, category = null) {
    this.drugName = drugName;
    this.quality = quality;
    this.source = source; // 'manual', 'automated', 'expanded'
    this.confidence = confidence;
    this.category = category; // Drug category (antibiotics, cardiovascular, etc.)
    this.createdAt = new Date().toISOString();
    this.lastValidated = null;
    this.validationStatus = 'pending';
    this.userFeedback = [];
    this.usageCount = 0;
    this.lastUsed = null;
  }

  markValidated(validator, status = 'approved') {
    this.lastValidated = new Date().toISOString();
    this.validationStatus = status;
    this.validator = validator;
  }

  addFeedback(feedback) {
    this.userFeedback.push({
      ...feedback,
      timestamp: new Date().toISOString(),
    });
  }

  incrementUsage() {
    this.usageCount++;
    this.lastUsed = new Date().toISOString();
  }
}

// Quality metadata store (in-memory, could be persisted to DB)
const mappingMetadata = new Map();

/**
 * Get quality metadata for a drug mapping
 */
export function getMappingMetadata(drugName) {
  return mappingMetadata.get(drugName.toLowerCase());
}

/**
 * Set quality metadata for a drug mapping
 */
export function setMappingMetadata(drugName, metadata) {
  mappingMetadata.set(drugName.toLowerCase(), metadata);
}

/**
 * Mark a mapping as manually curated
 */
export function markAsManualCurated(drugName) {
  const normalized = drugName.toLowerCase();
  let metadata = mappingMetadata.get(normalized);
  if (!metadata) {
    metadata = new MappingMetadata(normalized, QUALITY_LEVELS.MANUAL_CURATED, 'manual');
  } else {
    metadata.quality = QUALITY_LEVELS.MANUAL_CURATED;
    metadata.source = 'manual';
  }
  mappingMetadata.set(normalized, metadata);
  return metadata;
}

/**
 * Mark a mapping as automated with confidence level
 */
export function markAsAutomated(drugName, confidence, category = null) {
  const normalized = drugName.toLowerCase();
  let quality;
  if (confidence >= CONFIDENCE_SCORES.HIGH) {
    quality = QUALITY_LEVELS.AUTOMATED_HIGH;
  } else if (confidence >= CONFIDENCE_SCORES.MEDIUM) {
    quality = QUALITY_LEVELS.AUTOMATED_MEDIUM;
  } else {
    quality = QUALITY_LEVELS.AUTOMATED_LOW;
  }

  const metadata = new MappingMetadata(normalized, quality, 'automated', confidence, category);
  mappingMetadata.set(normalized, metadata);
  return metadata;
}

/**
 * Get all mappings that need review
 */
export function getMappingsNeedingReview(limit = 100) {
  const needsReview = [];
  for (const [drugName, metadata] of mappingMetadata.entries()) {
    if (
      metadata.quality === QUALITY_LEVELS.PENDING_REVIEW ||
      metadata.quality === QUALITY_LEVELS.AUTOMATED_LOW ||
      (metadata.validationStatus === 'pending' && metadata.source === 'automated')
    ) {
      needsReview.push({ drugName, metadata });
      if (needsReview.length >= limit) break;
    }
  }
  return needsReview.sort((a, b) => {
    // Sort by usage count (most used first) and confidence (lowest first)
    if (a.metadata.usageCount !== b.metadata.usageCount) {
      return b.metadata.usageCount - a.metadata.usageCount;
    }
    return (a.metadata.confidence || 0) - (b.metadata.confidence || 0);
  });
}

/**
 * Get quality statistics
 */
export function getQualityStats() {
  const stats = {
    total: mappingMetadata.size,
    byQuality: {},
    bySource: {},
    needsReview: 0,
    validated: 0,
    rejected: 0,
    totalUsage: 0,
  };

  for (const metadata of mappingMetadata.values()) {
    stats.byQuality[metadata.quality] = (stats.byQuality[metadata.quality] || 0) + 1;
    stats.bySource[metadata.source] = (stats.bySource[metadata.source] || 0) + 1;
    stats.totalUsage += metadata.usageCount;

    if (
      metadata.quality === QUALITY_LEVELS.PENDING_REVIEW ||
      metadata.quality === QUALITY_LEVELS.AUTOMATED_LOW
    ) {
      stats.needsReview++;
    }
    if (metadata.validationStatus === 'approved') {
      stats.validated++;
    }
    if (metadata.validationStatus === 'rejected' || metadata.quality === QUALITY_LEVELS.REJECTED) {
      stats.rejected++;
    }
  }

  return stats;
}

/**
 * Export metadata for persistence
 */
export function exportMetadata() {
  const data = {};
  for (const [drugName, metadata] of mappingMetadata.entries()) {
    data[drugName] = {
      quality: metadata.quality,
      source: metadata.source,
      confidence: metadata.confidence,
      category: metadata.category,
      createdAt: metadata.createdAt,
      lastValidated: metadata.lastValidated,
      validationStatus: metadata.validationStatus,
      usageCount: metadata.usageCount,
      lastUsed: metadata.lastUsed,
      feedbackCount: metadata.userFeedback.length,
    };
  }
  return data;
}

/**
 * Import metadata from persistence
 */
export function importMetadata(data) {
  mappingMetadata.clear();
  for (const [drugName, meta] of Object.entries(data)) {
    const metadata = new MappingMetadata(
      drugName,
      meta.quality,
      meta.source,
      meta.confidence,
      meta.category
    );
    metadata.createdAt = meta.createdAt;
    metadata.lastValidated = meta.lastValidated;
    metadata.validationStatus = meta.validationStatus;
    metadata.usageCount = meta.usageCount || 0;
    metadata.lastUsed = meta.lastUsed;
    mappingMetadata.set(drugName.toLowerCase(), metadata);
  }
}
