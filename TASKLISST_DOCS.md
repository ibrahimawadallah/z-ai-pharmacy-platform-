# TASKLISST - Task Management System

## Overview
TASKLISST is a comprehensive, integrated task management module built directly into the platform. It provides professional-grade project tracking, Kanban boards, list views, and real-time state management.

## Features Implemented
1. **Projects & Workspaces**: Create isolated projects for different teams or domains.
2. **Task Entities**: Full support for Tasks including Titles, Descriptions, Due Dates, Priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and Statuses (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`).
3. **Subtasks & Dependencies**: Database schema explicitly supports `parentId` for subtasks and explicit blocker/dependent models (`TaskDependency`).
4. **Interactive Dashboard**:
   - **Kanban View**: Drag-and-drop styled visual columns for state progression.
   - **List View**: Dense data table for rapid assessment.
5. **Real-time Synchronization**: Frontend is built with React state reacting seamlessly to API mutations.
6. **Authentication & Authorization**: Integrated with `next-auth`. Users can only see projects they own or are members of.

## Technical Architecture

### Database Schema (`prisma/schema.prisma`)
- `Project`: Defines a workspace.
- `ProjectMember`: Many-to-many relationship for collaboration.
- `Task`: Core entity linked to a project, assignee, and creator.
- `TaskDependency`: Tracks blocks/depends-on relationships.
- `Tag` & `TaskTag`: Flexible categorization.

### API Routes
- `GET /api/tasklisst/projects`: Fetch accessible projects.
- `POST /api/tasklisst/projects`: Create a new project.
- `GET /api/tasklisst/tasks?projectId={id}`: Fetch tasks for a project.
- `POST /api/tasklisst/tasks`: Create task.
- `PUT /api/tasklisst/tasks`: Update task status, priority, etc.
- `DELETE /api/tasklisst/tasks`: Remove task.

### Frontend
- Located at `/tasklisst` in the Next.js App Router.
- Uses `lucide-react` for iconography.
- Supports Dark/Light mode dynamically via Tailwind `dark:` variants.

## User Guide
1. **Access the Dashboard**: Navigate to `/tasklisst`.
2. **Create a Project**: Use the left sidebar to add a new project name and hit the `+` icon.
3. **Add Tasks**: Select a project, then type in the "Add a task..." input under the "To Do" column.
4. **Manage Status**: Click the "Todo", "Doing", or "Done" buttons on a task card to instantly move it across the Kanban board.
5. **Toggle Views**: Use the "Board" and "List" toggle buttons in the top right to switch between Kanban and List views.

## Testing
- Automated unit tests for the API routes are located in `tests/tasklisst/api.test.ts`.
- Tests verify authorization checks, CRUD operations, and Prisma ORM call structures.