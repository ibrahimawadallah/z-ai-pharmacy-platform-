-- Academy Module Schema
-- Stores courses, lessons, and educational content

-- 1. Academy Courses
CREATE TABLE IF NOT EXISTS academy_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_ar TEXT,
    description TEXT,
    description_ar TEXT,
    instructor TEXT NOT NULL,
    instructor_ar TEXT,
    category TEXT NOT NULL, -- e.g., 'Pharmacy', 'Diagnostics', 'Technology', 'Pediatrics'
    difficulty TEXT DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
    duration TEXT, -- e.g., '2 hours', '4 weeks'
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Academy Lessons
CREATE TABLE IF NOT EXISTS academy_lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,
    content TEXT, -- Markdown or HTML
    content_ar TEXT,
    video_url TEXT,
    lesson_order INTEGER NOT NULL,
    duration_mins INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES academy_courses(id) ON DELETE CASCADE
);

-- 3. Academy Quizzes (Optional but good for content generation)
CREATE TABLE IF NOT EXISTS academy_quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    question_ar TEXT,
    options TEXT, -- JSON array of strings
    options_ar TEXT, -- JSON array of strings
    correct_option_index INTEGER NOT NULL,
    explanation TEXT,
    explanation_ar TEXT,
    FOREIGN KEY (lesson_id) REFERENCES academy_lessons(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_lessons_course ON academy_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_lesson ON academy_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_courses_category ON academy_courses(category);

-- 4. Academy Progress (Tracks user progress through courses and lessons)
CREATE TABLE IF NOT EXISTS academy_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL, -- UUID or email from auth
    course_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
    quiz_score INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES academy_courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES academy_lessons(id) ON DELETE CASCADE,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_progress_user ON academy_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_course ON academy_progress(course_id);
