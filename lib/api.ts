import type {
  AuthResponse,
  Task,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
  ActivityLog,
  User,
  TaskFilters,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`)
    }

    return data as T
  }

  // Auth
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/profile')
  }

  // Tasks
  async listTasks(filters: TaskFilters = {}): Promise<TaskListResponse> {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort_by) params.set('sort_by', filters.sort_by)
    if (filters.sort_order) params.set('sort_order', filters.sort_order)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))
    const qs = params.toString()
    return this.request<TaskListResponse>(`/tasks${qs ? `?${qs}` : ''}`)
  }

  async getTask(id: string): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/tasks/${id}`)
  }

  async createTask(input: CreateTaskInput): Promise<{ task: Task }> {
    return this.request<{ task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Admin
  async adminListUsers(): Promise<{ users: User[] }> {
    return this.request<{ users: User[] }>('/admin/users')
  }

  async adminListTasks(userId?: string): Promise<{ tasks: Task[] }> {
    const qs = userId ? `?user_id=${userId}` : ''
    return this.request<{ tasks: Task[] }>(`/admin/tasks${qs}`)
  }

  async adminGetTaskActivity(taskId: string): Promise<{ activity: ActivityLog[] }> {
    return this.request<{ activity: ActivityLog[] }>(`/admin/tasks/${taskId}/activity`)
  }

  // Activity for own tasks
  async getTaskActivity(taskId: string): Promise<{ activity: ActivityLog[] }> {
    return this.request<{ activity: ActivityLog[] }>(`/admin/tasks/${taskId}/activity`)
  }
}

export const api = new ApiClient()
