'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/tasks"
              className="text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              TaskManager
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/tasks"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Tasks
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <>
                <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
