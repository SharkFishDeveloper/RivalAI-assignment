'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import type { CreateTaskInput } from '@/types'
import { useNotification } from '@/components/ui/notification'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskForm } from '@/components/tasks/task-form'
export default function CreateTaskPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(input: Record<string, unknown>) {
    setLoading(true)
    try {
      const res = await api.createTask(input as unknown as CreateTaskInput)
      notify('Task created', 'success')
      router.push(`/tasks/${res.task.id}`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to create task', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create Task</h1>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
