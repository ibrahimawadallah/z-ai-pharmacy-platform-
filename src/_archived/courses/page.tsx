'use client'

import React, { useState } from 'react'
import { GraduationCap, Clock, BookOpen, PlayCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/providers/AppProvider'

const COURSES = [
  {
    id: 'antibiotics',
    title: 'Antibiotic Pharmacology',
    description: 'Master the classification, mechanisms, and clinical application of antimicrobial agents.',
    icon: '💊',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    duration: '4.5 hours',
    level: 'Intermediate',
    modules: 8
  },
  {
    id: 'cardiology',
    title: 'Cardiovascular Pharmacology',
    description: 'Evidence-based management of hypertension and heart failure.',
    icon: '❤️',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    duration: '5 hours',
    level: 'Advanced',
    modules: 10
  },
  {
    id: 'respiratory',
    title: 'Respiratory Pharmacology',
    description: 'Treatment protocols for asthma and COPD management.',
    icon: '🫁',
    color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    duration: '3.5 hours',
    level: 'Beginner',
    modules: 6
  },
  {
    id: 'diabetes',
    title: 'Diabetes Management',
    description: 'Comprehensive diabetes pharmacotherapy and patient education.',
    icon: '🩺',
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    duration: '4 hours',
    level: 'Intermediate',
    modules: 7
  },
  {
    id: 'neurology',
    title: 'Neurological Disorders',
    description: 'Pharmacological management of common neurological conditions.',
    icon: '🧠',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    duration: '4.5 hours',
    level: 'Advanced',
    modules: 8
  },
  {
    id: 'gastro',
    title: 'Gastrointestinal Pharmacology',
    description: 'Treatment of acid-related disorders and functional GI conditions.',
    icon: '🔬',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    duration: '3 hours',
    level: 'Beginner',
    modules: 5
  }
]

export default function CoursesPage() {
  const { language } = useApp()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Continuing Education</Badge>
              </div>
              <h1 className="text-xl font-semibold">Pharmacy Courses</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Professional development courses for pharmacists
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-medium">{COURSES.length}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <div className="text-lg font-medium">0</div>
                <div className="text-xs text-muted-foreground">Enrolled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedCourse(course.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${course.color}`}>
                  {course.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium">{course.title}</h3>
                  <Badge className={`text-xs mt-1 ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.modules} modules</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - When no course selected */}
        {COURSES.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Courses Available</h3>
            <p className="text-sm text-muted-foreground">Check back later for new courses</p>
          </div>
        )}
      </div>
    </div>
  )
}