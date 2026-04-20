'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, LayoutGrid, List, CheckCircle, Circle, Clock } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
}

const initialTasks: Task[] = [
  { id: '1', title: 'Review patient medication profiles', status: 'TODO', priority: 'HIGH' },
  { id: '2', title: 'Complete drug interaction training', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: '3', title: 'Update patient allergy information', status: 'DONE', priority: 'HIGH' },
]

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  const addTask = () => {
    if (!newTaskTitle.trim()) return
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'TODO',
      priority: 'MEDIUM'
    }
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'DONE' ? 'TODO' : 'DONE' }
      }
      return t
    }))
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'HIGH': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'MEDIUM': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'LOW': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[priority] || 'bg-gray-100'
  }

  const groupedTasks = {
    'TODO': tasks.filter(t => t.status === 'TODO'),
    'IN_PROGRESS': tasks.filter(t => t.status === 'IN_PROGRESS'),
    'DONE': tasks.filter(t => t.status === 'DONE')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Task Management</Badge>
              </div>
              <h1 className="text-xl font-semibold">Clinical Tasks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your pharmacy tasks and workflow
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Add Task */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Circle className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-xl font-semibold">{groupedTasks.TODO.length}</div>
              <div className="text-xs text-muted-foreground">To Do</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-xl font-semibold">{groupedTasks.IN_PROGRESS.length}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <div className="text-xl font-semibold">{groupedTasks.DONE.length}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
          </div>
        </div>

        {/* Task List */}
        {viewMode === 'list' ? (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Task</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Priority</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleTaskStatus(task.id)}>
                        {task.status === 'DONE' ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : task.status === 'IN_PROGRESS' ? (
                          <Clock className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className={`px-6 py-4 text-sm ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-xs ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map(status => (
              <div key={status} className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-4">{status.replace('_', ' ')}</h3>
                <div className="space-y-3">
                  {groupedTasks[status].map(task => (
                    <div key={task.id} className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{task.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}