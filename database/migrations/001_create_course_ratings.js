/**
 * MongoDB Migration: Create CourseRating Collection
 * 
 * This migration creates the course_ratings collection with proper schema validation
 * and indexes for efficient querying.
 * 
 * Acceptance Criteria:
 * - Define schema with userId, courseId, rating (1-5), timestamps
 * - Create indexes on userId, courseId, createdAt
 * - Add validation for rating values (1-5 only)
 */

module.exports = {
  async up(db, client) {
    // Create the course_ratings collection with schema validation
    await db.createCollection('course_ratings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'courseId', 'rating', 'createdAt', 'updatedAt'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Unique identifier for the rating'
            },
            userId: {
              bsonType: 'string',
              description: 'User ID who submitted the rating'
            },
            courseId: {
              bsonType: 'objectId',
              description: 'Course ID being rated'
            },
            rating: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'Rating value from 1 to 5 stars'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Timestamp when rating was created'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Timestamp when rating was last updated'
            }
          },
          additionalProperties: false
        }
      }
    });

    // Create indexes for efficient querying
    const collection = db.collection('course_ratings');

    // Index on userId for finding all ratings by a user
    await collection.createIndex({ userId: 1 });

    // Index on courseId for finding all ratings for a course
    await collection.createIndex({ courseId: 1 });

    // Index on createdAt for sorting by date
    await collection.createIndex({ createdAt: -1 });

    // Compound index for unique constraint (userId, courseId)
    // This ensures a user can only rate a course once
    await collection.createIndex(
      { userId: 1, courseId: 1 },
      { unique: true }
    );

    // Compound index for efficient queries on courseId and createdAt
    // Used for calculating average ratings within time windows
    await collection.createIndex({ courseId: 1, createdAt: -1 });

    console.log('✓ CourseRating collection created with schema validation and indexes');
  },

  async down(db, client) {
    // Drop the collection if rolling back
    await db.collection('course_ratings').drop();
    console.log('✓ CourseRating collection dropped');
  }
};
