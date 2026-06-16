'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useNotification } from '@/components/ui/notification'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskFilters } from '@/components/tasks/task-filters'
import { Pagination } from '@/components/tasks/pagination'
import type { Task, TaskFilters as TaskFiltersType, PaginationMeta } from '@/types'

export default function TaskListPage() {
  const { notify } = useNotification()
  const [tasks, setTasks] = useState<Task[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<TaskFiltersType>({
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    limit: 20,
  })
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  const fetchTasks = useCallback(async (f: TaskFiltersType) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.listTasks(f)
      setTasks(res.tasks)
      setMeta(res.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks(filters)
  }, [fetchTasks, filters])

  function handleApplyFilters(newFilters: TaskFiltersType) {
    setFilters(newFilters)
  }

  function handlePageChange(page: number) {
    setFilters(prev => ({ ...prev, page }))
  }

  async function handleToggleComplete(task: Task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const optimistic = tasks.map(t =>
      t.id === task.id ? { ...t, status: newStatus } : t
    )
    setTasks(optimistic)
    setTogglingIds(prev => new Set(prev).add(task.id))
    try {
      const res = await api.updateTask(task.id, { status: newStatus })
      setTasks(prev => prev.map(t => t.id === task.id ? res.task : t))
      notify(newStatus === 'done' ? 'Task completed' : 'Task reopened', 'success')
    } catch {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
      notify('Failed to update task', 'error')
    } finally {
      setTogglingIds(prev => { const next = new Set(prev); next.delete(task.id); return next })
    }
  }

  async function handleDelete(task: Task) {
    const optimistic = tasks.filter(t => t.id !== task.id)
    setTasks(optimistic)
    setMeta(prev => prev ? { ...prev, total: prev.total - 1 } : prev)
    setDeletingIds(prev => new Set(prev).add(task.id))
    try {
      await api.deleteTask(task.id)
      notify('Task deleted', 'success')
    } catch {
      setTasks(prev => [...prev, task])
      setMeta(prev => prev ? { ...prev, total: prev.total + 1 } : prev)
      notify('Failed to delete task', 'error')
    } finally {
      setDeletingIds(prev => { const next = new Set(prev); next.delete(task.id); return next })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
        <Link href="/tasks/new">
          <Button>+ New Task</Button>
        </Link>
      </div>

      <TaskFilters filters={filters} onApply={handleApplyFilters} />

      {loading && tasks.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button variant="secondary" className="mt-3" onClick={() => fetchTasks(filters)}>
            Retry
          </Button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
          <Link href="/tasks/new">
            <Button variant="secondary" className="mt-3">Create your first task</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              toggling={togglingIds.has(task.id)}
              deleting={deletingIds.has(task.id)}
            />
          ))}
          {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
        </div>
      )}
    </div>
  )
}
