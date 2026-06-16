'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { useNotification } from '@/components/ui/notification'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskForm } from '@/components/tasks/task-form'
import type { Task, UpdateTaskInput } from '@/types'

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { notify } = useNotification()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getTask(id)
      .then(res => setTask(res.task))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(input: Record<string, unknown>) {
    setSaving(true)
    try {
      await api.updateTask(id, input as unknown as UpdateTaskInput)
      notify('Task updated', 'success')
      router.push(`/tasks/${id}`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update task', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-16 text-red-600 dark:text-red-400">{error}</div>
  if (!task) return null

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Task</h1>
        </CardHeader>
        <CardContent>
          <TaskForm initial={task} onSubmit={handleSubmit} loading={saving} />
        </CardContent>
      </Card>
    </div>
  )
}
