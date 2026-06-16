'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'
import type { Task } from '@/types'

export default function AdminTasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') return
    api.adminListTasks()
      .then(res => setTasks(res.tasks))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  if (user?.role !== 'admin') {
    return <div className="text-center py-16 text-red-600">Admin access required</div>
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Tasks</h1>
      {tasks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Due</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Activity</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <Link href={`/admin/tasks/${t.id}/activity`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      {t.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getStatusColor(t.status))}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getPriorityColor(t.priority))}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(t.due_date)}</td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/tasks/${t.id}/activity`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs">
                      View activity
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
