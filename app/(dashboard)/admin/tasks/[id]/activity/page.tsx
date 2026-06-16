'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import type { ActivityLog, Task } from '@/types'

export default function AdminTaskActivityPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()
  const [task, setTask] = useState<Task | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      setLoading(false)
      return
    }
    Promise.all([
      api.getTask(id).catch(() => null),
      api.adminGetTaskActivity(id),
    ])
      .then(([taskRes, activityRes]) => {
        if (taskRes) setTask(taskRes.task)
        setActivity(activityRes.activity)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, user])

  if (user?.role !== 'admin') {
    return <div className="text-center py-16 text-red-600">Admin access required</div>
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/tasks" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          &larr; Back to all tasks
        </Link>
      </div>

      {task && (
        <Card>
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</h1>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity Log</h2>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No activity recorded</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
