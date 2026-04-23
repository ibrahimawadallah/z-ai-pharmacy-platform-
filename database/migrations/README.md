# MongoDB Migrations

This directory contains database migrations for the Stanford Medicine Phase 2 Advanced Features.

## Migration Files

### 001_create_course_ratings.js

Creates the `course_ratings` collection with:

- **Schema Validation**: Enforces required fields and data types
  - `userId` (string): User who submitted the rating
  - `courseId` (ObjectId): Course being rated
  - `rating` (integer): Rating value from 1 to 5
  - `createdAt` (date): Timestamp when rating was created
  - `updatedAt` (date): Timestamp when rating was last updated

- **Indexes**:
  - `userId` (ascending): For finding all ratings by a user
  - `courseId` (ascending): For finding all ratings for a course
  - `createdAt` (descending): For sorting by date
  - `userId + courseId` (unique): Ensures a user can only rate a course once
  - `courseId + createdAt` (compound): For efficient queries on course ratings within time windows

- **Validation Rules**:
  - Rating must be an integer between 1 and 5
  - All fields are required
  - No additional properties allowed

## Running Migrations

### Up (Apply migrations)

```bash
npx ts-node database/migrations/migrate.ts up
```

### Down (Rollback migrations)

```bash
npx ts-node database/migrations/migrate.ts down
```

## Migration Structure

Each migration file exports an object with `up` and `down` functions:

```typescript
module.exports = {
  async up(db, client) {
    // Apply migration
  },
  async down(db, client) {
    // Rollback migration
  }
};
```

## Acceptance Criteria Met

✅ Define schema with userId, courseId, rating (1-5), timestamps
✅ Create indexes on userId, courseId, createdAt
✅ Add validation for rating values (1-5 only)
✅ Unique constraint on userId + courseId combination
✅ Compound indexes for efficient querying

## Notes

- Migrations are run in alphabetical order
- Each migration should be idempotent (safe to run multiple times)
- Always test migrations in a development environment first
- Keep migration files small and focused on a single change
