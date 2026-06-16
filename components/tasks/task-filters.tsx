'use client'

import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { TaskFilters as TaskFiltersType } from '@/types'

interface Props {
  filters: TaskFiltersType
  onApply: (filters: TaskFiltersType) => void
}

export function TaskFilters({ filters, onApply }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [status, setStatus] = useState(filters.status || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onApply({
      ...filters,
      search,
      status: status || undefined,
      page: 1,
    })
  }

  function handleSort(sortBy: string) {
    const sortOrder =
      filters.sort_by === sortBy && filters.sort_order === 'asc' ? 'desc' : 'asc'
    onApply({ ...filters, sort_by: sortBy, sort_order: sortOrder, page: 1 })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          options={[
            { value: 'todo', label: 'Todo' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]}
          placeholder="All statuses"
          value={status}
          onChange={e => setStatus(e.target.value)}
        />
        <Button type="submit" variant="secondary">Apply</Button>
      </form>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
        {[
          { key: 'due_date', label: 'Due Date' },
          { key: 'priority', label: 'Priority' },
          { key: 'created_at', label: 'Created' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => handleSort(s.key)}
            className={`px-2 py-1 rounded transition-colors ${
              filters.sort_by === s.key
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {s.label} {filters.sort_by === s.key && (filters.sort_order === 'asc' ? '↑' : '↓')}
          </button>
        ))}
      </div>
    </div>
  )
}
