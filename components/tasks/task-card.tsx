'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  task: Task
  onToggleComplete: (task: Task) => void
  onDelete: (task: Task) => void
  toggling?: boolean
  deleting?: boolean
}

export function TaskCard({ task, onToggleComplete, onDelete, toggling, deleting }: Props) {
  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      task.status === 'done' && 'opacity-70'
    )}>
      <CardContent className="flex items-start justify-between gap-4 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onToggleComplete(task)}
              disabled={toggling}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors',
                task.status === 'done'
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
              )}
            >
              {task.status === 'done' && (
                <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <Link href={`/tasks/${task.id}`} className="hover:underline">
              <h3 className={cn(
                'font-medium text-gray-900 dark:text-gray-100 truncate',
                task.status === 'done' && 'line-through'
              )}>
                {task.title}
              </h3>
            </Link>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 ml-7">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2 ml-7">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getStatusColor(task.status))}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getPriorityColor(task.priority))}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Due: {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-1">
          <Link href={`/tasks/${task.id}/edit`}>
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
