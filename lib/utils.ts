export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
    case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
    case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-600'
  }
}
