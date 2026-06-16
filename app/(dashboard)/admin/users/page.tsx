'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { User } from '@/types'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') return
    api.adminListUsers()
      .then(res => setUsers(res.users))
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
