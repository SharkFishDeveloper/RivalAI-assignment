export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
}

export interface ActivityLog {
  id: string
  task_id: string
  user_id: string
  action: string
  detail: string
  created_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface TaskListResponse {
  tasks: Task[]
  meta: PaginationMeta
}

export interface TaskFilters {
  status?: string
  search?: string
  sort_by?: string
  sort_order?: string
  page?: number
  limit?: number
}

export interface ApiError {
  error: string
}
