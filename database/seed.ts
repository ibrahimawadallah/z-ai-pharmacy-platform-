/**
 * Database Seed Script
 * 
 * This script populates the MongoDB database with demo data for Stanford Medicine Phase 2 features.
 * It creates:
 * - Demo courses and videos
 * - Sample ratings and reviews
 * - Sample notes
 * - Sample certificates
 * - Sample recommendations
 */

import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import { DEMO_COURSES, DEMO_VIDEOS } from '../app/lib/seeds/demo-videos.ts';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hybrid:0001@hybrid.5kxbbtp.mongodb.net/medtechai?appName=hybrid';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\nClearing existing data...');
    await db.collection('stanford_courses').deleteMany({});
    await db.collection('stanford_videos').deleteMany({});
    await db.collection('course_ratings').deleteMany({});
    await db.collection('course_reviews').deleteMany({});
    await db.collection('video_notes').deleteMany({});
    await db.collection('certificates').deleteMany({});
    await db.collection('recommendations').deleteMany({});
    await db.collection('recommendation_feedback').deleteMany({});
    console.log('✓ Existing data cleared');

    // Seed Stanford Courses
    console.log('\nSeeding Stanford courses...');
    const coursesCollection = db.collection('stanford_courses');
    
    const courseDocs = DEMO_COURSES.map(course => ({
      ...course,
      _id: new ObjectId(),
      lastSynced: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await coursesCollection.insertMany(courseDocs);
    console.log(`✓ ${courseDocs.length} courses seeded`);

    // Seed Stanford Videos
    console.log('\nSeeding Stanford videos...');
    const videosCollection = db.collection('stanford_videos');
    
    const videoDocs = DEMO_VIDEOS.map(video => ({
      ...video,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await videosCollection.insertMany(videoDocs);
    console.log(`✓ ${videoDocs.length} videos seeded`);

    // Seed Sample Ratings
    console.log('\nSeeding sample ratings...');
    const ratingsCollection = db.collection('course_ratings');
    
    const sampleRatings = [
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'circulatory-system',
        rating: 5,
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date('2026-02-15'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-2',
        courseId: 'circulatory-system',
        rating: 4,
        createdAt: new Date('2026-02-20'),
        updatedAt: new Date('2026-02-20'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-3',
        courseId: 'respiratory-system',
        rating: 5,
        createdAt: new Date('2026-02-18'),
        updatedAt: new Date('2026-02-18'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'pharmacology',
        rating: 3,
        createdAt: new Date('2026-02-22'),
        updatedAt: new Date('2026-02-22'),
      },
    ];

    await ratingsCollection.insertMany(sampleRatings);
    console.log(`✓ ${sampleRatings.length} ratings seeded`);

    // Seed Sample Reviews
    console.log('\nSeeding sample reviews...');
    const reviewsCollection = db.collection('course_reviews');
    
    const sampleReviews = [
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'circulatory-system',
        rating: 5,
        reviewText: 'Excellent course! The cardiovascular system overview was very clear and well-explained. Perfect for beginners.',
        status: 'published',
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date('2026-02-15'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-2',
        courseId: 'circulatory-system',
        rating: 4,
        reviewText: 'Good content, but could use more detailed explanations of blood pressure regulation.',
        status: 'published',
        createdAt: new Date('2026-02-20'),
        updatedAt: new Date('2026-02-20'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-3',
        courseId: 'respiratory-system',
        rating: 5,
        reviewText: 'Very comprehensive overview of respiratory anatomy. The gas exchange section was particularly helpful.',
        status: 'published',
        createdAt: new Date('2026-02-18'),
        updatedAt: new Date('2026-02-18'),
      },
    ];

    await reviewsCollection.insertMany(sampleReviews);
    console.log(`✓ ${sampleReviews.length} reviews seeded`);

    // Seed Sample Notes
    console.log('\nSeeding sample notes...');
    const notesCollection = db.collection('video_notes');
    
    const sampleNotes = [
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        videoId: 'cardiovascular-overview',
        courseId: 'circulatory-system',
        timestamp: 120, // 2 minutes
        noteText: 'Important: Heart has 4 chambers - 2 atria, 2 ventricles',
        tags: ['anatomy', 'heart'],
        createdAt: new Date('2026-02-15T10:30:00'),
        updatedAt: new Date('2026-02-15T10:30:00'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        videoId: 'cardiovascular-overview',
        courseId: 'circulatory-system',
        timestamp: 300, // 5 minutes
        noteText: 'Blood flow: Right atrium → Right ventricle → Lungs → Left atrium → Left ventricle → Body',
        tags: ['physiology', 'circulation'],
        createdAt: new Date('2026-02-15T10:35:00'),
        updatedAt: new Date('2026-02-15T10:35:00'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-2',
        videoId: 'respiratory-system-overview',
        courseId: 'respiratory-system',
        timestamp: 180, // 3 minutes
        noteText: 'Alveoli are the site of gas exchange - oxygen in, carbon dioxide out',
        tags: ['anatomy', 'lungs'],
        createdAt: new Date('2026-02-18T14:20:00'),
        updatedAt: new Date('2026-02-18T14:20:00'),
      },
    ];

    await notesCollection.insertMany(sampleNotes);
    console.log(`✓ ${sampleNotes.length} notes seeded`);

    // Seed Sample Certificates
    console.log('\nSeeding sample certificates...');
    const certificatesCollection = db.collection('certificates');
    
    const sampleCertificates = [
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'circulatory-system',
        certificateId: 'CERT-circulatory-system-demo-user-1-1739452800000',
        completionDate: new Date('2026-02-15'),
        verificationCode: 'ABC12345',
        status: 'active',
        createdAt: new Date('2026-02-15'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'respiratory-system',
        certificateId: 'CERT-respiratory-system-demo-user-1-1739539200000',
        completionDate: new Date('2026-02-18'),
        verificationCode: 'DEF67890',
        status: 'active',
        createdAt: new Date('2026-02-18'),
      },
    ];

    await certificatesCollection.insertMany(sampleCertificates);
    console.log(`✓ ${sampleCertificates.length} certificates seeded`);

    // Seed Sample Recommendations
    console.log('\nSeeding sample recommendations...');
    const recommendationsCollection = db.collection('recommendations');
    
    const sampleRecommendations = [
      {
        _id: new ObjectId(),
        userId: 'demo-user-1',
        courseId: 'pharmacology',
        score: 85,
        reason: 'Based on your completion of circulatory and respiratory courses',
        source: 'algorithm',
        clicked: false,
        enrolled: false,
        createdAt: new Date('2026-02-20'),
      },
      {
        _id: new ObjectId(),
        userId: 'demo-user-2',
        courseId: 'respiratory-system',
        score: 92,
        reason: 'Based on your interest in clinical skills',
        source: 'algorithm',
        clicked: true,
        enrolled: false,
        createdAt: new Date('2026-02-19'),
      },
    ];

    await recommendationsCollection.insertMany(sampleRecommendations);
    console.log(`✓ ${sampleRecommendations.length} recommendations seeded`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Courses: ${courseDocs.length}`);
    console.log(`- Videos: ${videoDocs.length}`);
    console.log(`- Ratings: ${sampleRatings.length}`);
    console.log(`- Reviews: ${sampleReviews.length}`);
    console.log(`- Notes: ${sampleNotes.length}`);
    console.log(`- Certificates: ${sampleCertificates.length}`);
    console.log(`- Recommendations: ${sampleRecommendations.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the seed script
seedDatabase().catch(console.error);