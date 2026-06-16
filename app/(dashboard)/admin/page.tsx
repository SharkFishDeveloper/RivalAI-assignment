'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Admin access required</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">View all registered users</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/tasks">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Tasks</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">View all users&apos; tasks</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
