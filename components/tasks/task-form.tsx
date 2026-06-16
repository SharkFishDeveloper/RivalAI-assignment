'use client'

import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { CreateTaskInput, UpdateTaskInput, Task } from '@/types'

interface Props {
  initial?: Task
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<void>
  loading?: boolean
}

export function TaskForm({ initial, onSubmit, loading }: Props) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [status, setStatus] = useState(initial?.status || 'todo')
  const [priority, setPriority] = useState(initial?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initial?.due_date ? initial.due_date.slice(0, 10) : '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (title.length > 500) errs.title = 'Title must be under 500 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status: status as CreateTaskInput['status'],
      priority: priority as CreateTaskInput['priority'],
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Enter task title"
      />
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          placeholder="Optional description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          id="status"
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          options={[
            { value: 'todo', label: 'Todo' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]}
        />
        <Select
          id="priority"
          label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
        <Input
          id="due_date"
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {initial ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
