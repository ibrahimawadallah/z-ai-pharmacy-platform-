import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  {
    title: "Clinical Pharmacology & Therapeutics",
    titleAr: "علم الصيدلة السريرية والعلاجات",
    description: "Master the principles of drug action and clinical applications.",
    instructor: "Dr. Elena Vance",
    duration: "12 weeks",
    category: "Clinical Pharmacology",
    level: "advanced",
    creditHours: 8,
    isPublished: true,
  },
  {
    title: "Advanced Pharmaceutical Calculations",
    titleAr: "الحسابات الصيدلانية المتقدمة",
    description: "Comprehensive guide to complex dosing and IV calculations.",
    instructor: "Prof. Sarah Miller",
    duration: "8 weeks",
    category: "Pharmaceutical Sciences",
    level: "intermediate",
    creditHours: 6,
    isPublished: true,
  },
  {
    title: "Pharmacy Ethics and Regulatory Law",
    titleAr: "أخلاقيات الصيدلة والقانون التنظيمي",
    description: "Navigating the legal landscape in the UAE pharmacy practice.",
    instructor: "Julian Reed, JD",
    duration: "6 weeks",
    category: "Professional Practice",
    level: "beginner",
    creditHours: 4,
    isPublished: true,
  },
  {
    title: "AI in Pharmaceutical Research",
    titleAr: "الذكاء الاصطناعي في الأبحاث الصيدلانية",
    description: "How machine learning is accelerating drug discovery.",
    instructor: "Dr. Marcus Chen",
    duration: "10 weeks",
    category: "Digital Health",
    level: "intermediate",
    creditHours: 10,
    isPublished: true,
  },
  {
    title: "Immunology and Vaccine Management",
    titleAr: "علم المناعة وإدارة اللقاحات",
    description: "Best practices for storage and administration of vaccines.",
    instructor: "Dr. Lisa Thompson",
    duration: "4 weeks",
    category: "Immunology",
    level: "beginner",
    creditHours: 4,
    isPublished: true,
  }
];

async function main() {
  console.log('Start course seeding...');
  
  for (const course of courses) {
    // Check if course already exists by title
    const existingCourse = await prisma.course.findFirst({
      where: { title: course.title }
    });
    
    if (existingCourse) {
      // Update existing course
      await prisma.course.update({
        where: { id: existingCourse.id },
        data: course,
      });
      console.log(`Updated: ${course.title}`);
    } else {
      // Create new course
      await prisma.course.create({
        data: course,
      });
      console.log(`Created: ${course.title}`);
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });