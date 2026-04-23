/**
 * Mapping Accuracy Monitoring System
 * Tracks usage, accuracy, and user feedback for drug-ICD10 mappings
 */

import { getMappingMetadata, setMappingMetadata } from './mappingQuality.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monitoring data storage
const monitoringData = {
  usageStats: new Map(), // drugName -> { count, lastUsed, searchQueries }
  accuracyReports: [], // Array of accuracy reports
  userFeedback: [], // Array of user feedback
  errorLogs: [], // Array of error logs
};

// Persistence file path
const MONITORING_DATA_PATH = path.join(__dirname, '../../data/monitoring/mapping-accuracy.json');

/**
 * Track mapping usage
 */
export function trackMappingUsage(drugName, searchQuery = null) {
  const normalized = drugName.toLowerCase();
  const metadata = getMappingMetadata(normalized);

  if (metadata) {
    metadata.incrementUsage();
  }

  // Track in monitoring data
  if (!monitoringData.usageStats.has(normalized)) {
    monitoringData.usageStats.set(normalized, {
      count: 0,
      lastUsed: null,
      searchQueries: [],
    });
  }

  const stats = monitoringData.usageStats.get(normalized);
  stats.count++;
  stats.lastUsed = new Date().toISOString();
  if (searchQuery) {
    stats.searchQueries.push({
      query: searchQuery,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 10 queries
    if (stats.searchQueries.length > 10) {
      stats.searchQueries.shift();
    }
  }
}

/**
 * Record user feedback on mapping accuracy
 */
export function recordUserFeedback(drugName, feedback) {
  const normalized = drugName.toLowerCase();
  const metadata = getMappingMetadata(normalized);

  const feedbackEntry = {
    drugName: normalized,
    timestamp: new Date().toISOString(),
    rating: feedback.rating, // 1-5 scale
    accurate: feedback.accurate, // boolean
    comments: feedback.comments || '',
    suggestedCodes: feedback.suggestedCodes || [],
    userId: feedback.userId || 'anonymous',
  };

  monitoringData.userFeedback.push(feedbackEntry);

  // Update metadata
  if (metadata) {
    metadata.addFeedback(feedbackEntry);

    // If multiple negative feedbacks, mark for review
    const negativeCount = metadata.userFeedback.filter((f) => f.accurate === false).length;
    if (negativeCount >= 3) {
      metadata.quality = 'pending_review';
      metadata.validationStatus = 'needs_review';
    }
  }

  // Keep only last 1000 feedback entries
  if (monitoringData.userFeedback.length > 1000) {
    monitoringData.userFeedback.shift();
  }

  // Auto-save
  saveMonitoringData();
}

/**
 * Record accuracy report
 */
export function recordAccuracyReport(report) {
  const reportEntry = {
    ...report,
    timestamp: new Date().toISOString(),
  };

  monitoringData.accuracyReports.push(reportEntry);

  // Keep only last 500 reports
  if (monitoringData.accuracyReports.length > 500) {
    monitoringData.accuracyReports.shift();
  }

  // Auto-save
  saveMonitoringData();
}

/**
 * Log mapping errors
 */
export function logMappingError(drugName, error, context = {}) {
  const errorEntry = {
    drugName: drugName?.toLowerCase() || 'unknown',
    error: error.message || String(error),
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  monitoringData.errorLogs.push(errorEntry);

  // Keep only last 500 errors
  if (monitoringData.errorLogs.length > 500) {
    monitoringData.errorLogs.shift();
  }

  // Auto-save
  saveMonitoringData();
}

/**
 * Get accuracy statistics
 */
export function getAccuracyStats() {
  const totalFeedback = monitoringData.userFeedback.length;
  const accurateCount = monitoringData.userFeedback.filter((f) => f.accurate === true).length;
  const inaccurateCount = monitoringData.userFeedback.filter((f) => f.accurate === false).length;

  const avgRating =
    monitoringData.userFeedback.length > 0
      ? monitoringData.userFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) /
        monitoringData.userFeedback.length
      : 0;

  return {
    totalFeedback,
    accurateCount,
    inaccurateCount,
    accuracyRate: totalFeedback > 0 ? (accurateCount / totalFeedback) * 100 : 0,
    averageRating: avgRating,
    totalUsage: Array.from(monitoringData.usageStats.values()).reduce((sum, s) => sum + s.count, 0),
    uniqueDrugsUsed: monitoringData.usageStats.size,
    errorCount: monitoringData.errorLogs.length,
  };
}

/**
 * Get drugs needing review based on feedback
 */
export function getDrugsNeedingReview(limit = 50) {
  const drugFeedbackCount = new Map();

  // Count negative feedback per drug
  for (const feedback of monitoringData.userFeedback) {
    if (feedback.accurate === false) {
      const count = drugFeedbackCount.get(feedback.drugName) || 0;
      drugFeedbackCount.set(feedback.drugName, count + 1);
    }
  }

  // Sort by negative feedback count
  const drugsNeedingReview = Array.from(drugFeedbackCount.entries())
    .map(([drugName, count]) => ({
      drugName,
      negativeFeedbackCount: count,
      usageCount: monitoringData.usageStats.get(drugName)?.count || 0,
    }))
    .sort((a, b) => {
      // Sort by negative feedback count, then by usage
      if (a.negativeFeedbackCount !== b.negativeFeedbackCount) {
        return b.negativeFeedbackCount - a.negativeFeedbackCount;
      }
      return b.usageCount - a.usageCount;
    })
    .slice(0, limit);

  return drugsNeedingReview;
}

/**
 * Get usage statistics for a specific drug
 */
export function getDrugUsageStats(drugName) {
  const normalized = drugName.toLowerCase();
  return (
    monitoringData.usageStats.get(normalized) || {
      count: 0,
      lastUsed: null,
      searchQueries: [],
    }
  );
}

/**
 * Get all monitoring data
 */
export function getAllMonitoringData() {
  return {
    usageStats: Object.fromEntries(monitoringData.usageStats),
    accuracyReports: monitoringData.accuracyReports,
    userFeedback: monitoringData.userFeedback,
    errorLogs: monitoringData.errorLogs,
    stats: getAccuracyStats(),
  };
}

/**
 * Save monitoring data to disk
 */
export function saveMonitoringData() {
  try {
    const dir = path.dirname(MONITORING_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const dataToSave = {
      usageStats: Object.fromEntries(monitoringData.usageStats),
      accuracyReports: monitoringData.accuracyReports.slice(-500), // Keep last 500
      userFeedback: monitoringData.userFeedback.slice(-1000), // Keep last 1000
      errorLogs: monitoringData.errorLogs.slice(-500), // Keep last 500
      lastSaved: new Date().toISOString(),
    };

    fs.writeFileSync(MONITORING_DATA_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save monitoring data:', error);
  }
}

/**
 * Load monitoring data from disk
 */
export function loadMonitoringData() {
  try {
    if (fs.existsSync(MONITORING_DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(MONITORING_DATA_PATH, 'utf-8'));

      // Restore usage stats
      if (data.usageStats) {
        for (const [drugName, stats] of Object.entries(data.usageStats)) {
          monitoringData.usageStats.set(drugName, stats);
        }
      }

      // Restore arrays
      if (data.accuracyReports) {
        monitoringData.accuracyReports = data.accuracyReports;
      }
      if (data.userFeedback) {
        monitoringData.userFeedback = data.userFeedback;
      }
      if (data.errorLogs) {
        monitoringData.errorLogs = data.errorLogs;
      }
    }
  } catch (error) {
    console.error('Failed to load monitoring data:', error);
  }
}

// Load on module initialization
loadMonitoringData();

// Auto-save every 5 minutes (skip during build)
if (
  (process.env.NEXT_PHASE !== 'phase-production-build' && process.env.NODE_ENV !== 'production') ||
  process.env.ENABLE_MONITORING === 'true'
) {
  setInterval(
    () => {
      saveMonitoringData();
    },
    5 * 60 * 1000
  );
}

// Save on process exit
process.on('exit', () => {
  saveMonitoringData();
});

// Temporarily disabled - causing premature exit
// process.on('SIGINT', () => {
//   saveMonitoringData();
//   process.exit();
// });
