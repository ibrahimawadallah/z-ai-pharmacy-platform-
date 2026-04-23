/**
 * MongoDB Migration: Create CourseReview Collection
 * 
 * This migration creates the course_reviews collection with proper schema validation
 * and indexes for efficient querying.
 * 
 * Acceptance Criteria:
 * - Define schema with userId, courseId, rating, reviewText, status
 * - Create indexes on userId, courseId, status, createdAt
 * - Add text index for review search
 */

module.exports = {
  async up(db, client) {
    // Create the course_reviews collection with schema validation
    await db.createCollection('course_reviews', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'courseId', 'rating', 'reviewText', 'status', 'createdAt', 'updatedAt'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Unique identifier for the review'
            },
            userId: {
              bsonType: 'string',
              description: 'User ID who submitted the review'
            },
            courseId: {
              bsonType: 'objectId',
              description: 'Course ID being reviewed'
            },
            rating: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'Rating value from 1 to 5 stars'
            },
            reviewText: {
              bsonType: 'string',
              maxLength: 500,
              description: 'Review text content (max 500 characters)'
            },
            status: {
              enum: ['published', 'flagged', 'archived'],
              description: 'Review status: published, flagged for moderation, or archived'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Timestamp when review was created'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Timestamp when review was last updated'
            },
            archivedAt: {
              bsonType: ['date', 'null'],
              description: 'Timestamp when review was archived (if applicable)'
            }
          },
          additionalProperties: false
        }
      }
    });

    // Create indexes for efficient querying
    const collection = db.collection('course_reviews');

    // Index on userId for finding all reviews by a user
    await collection.createIndex({ userId: 1 });

    // Index on courseId for finding all reviews for a course
    await collection.createIndex({ courseId: 1 });

    // Index on status for filtering reviews by status
    await collection.createIndex({ status: 1 });

    // Index on createdAt for sorting by date
    await collection.createIndex({ createdAt: -1 });

    // Compound index for unique constraint (userId, courseId)
    // This ensures a user can only review a course once
    await collection.createIndex(
      { userId: 1, courseId: 1 },
      { unique: true }
    );

    // Compound index for efficient queries on courseId and status
    // Used for filtering published reviews for a course
    await collection.createIndex({ courseId: 1, status: 1, createdAt: -1 });

    // Text index on reviewText for full-text search
    // Allows searching reviews by content
    await collection.createIndex({ reviewText: 'text' });

    // Compound text index including reviewText and status for advanced search
    await collection.createIndex({ reviewText: 'text', status: 1 });

    console.log('✓ CourseReview collection created with schema validation and indexes');
  },

  async down(db, client) {
    // Drop the collection if rolling back
    await db.collection('course_reviews').drop();
    console.log('✓ CourseReview collection dropped');
  }
};
