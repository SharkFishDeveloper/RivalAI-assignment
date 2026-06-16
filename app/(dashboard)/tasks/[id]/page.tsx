'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useNotification } from '@/components/ui/notification'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn, formatDate, formatDateTime, getPriorityColor, getStatusColor } from '@/lib/utils'
import type { Task, ActivityLog } from '@/types'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { notify } = useNotification()
  const [task, setTask] = useState<Task | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.getTask(id),
      api.getTaskActivity(id).catch(() => ({ activity: [] as ActivityLog[] })),
    ])
      .then(([taskRes, activityRes]) => {
        setTask(taskRes.task)
        setActivity(activityRes.activity)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this task?')) return
    try {
      await api.deleteTask(id)
      notify('Task deleted', 'success')
      router.push('/tasks')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete task', 'error')
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-16 text-red-600 dark:text-red-400">{error}</div>
  if (!task) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          &larr; Back to tasks
        </Link>
        <div className="flex gap-2">
          <Link href={`/tasks/${id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</h1>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getStatusColor(task.status))}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getPriorityColor(task.priority))}>
              {task.priority}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Due date</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(task.due_date)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDateTime(task.created_at)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Updated</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDateTime(task.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activity.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activity.map((log, i) => (
                <div key={log.id} className="relative pl-6 pb-4 last:pb-0">
                  {i < activity.length - 1 && (
                    <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{log.action}</span>
                    {log.detail && (
                      <span className="text-gray-500 dark:text-gray-400"> — {log.detail}</span>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
