'use client'

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: number
  message: string
  type: NotificationType
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

let nextId = 0

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = ++nextId
    setNotifications(prev => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {notifications.map(n => (
          <Toast key={n.id} notification={n} onDone={() => remove(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function Toast({ notification, onDone }: { notification: Notification; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000)
    return () => clearTimeout(timer)
  }, [onDone])

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg text-white text-sm shadow-lg animate-in slide-in-from-right',
        colors[notification.type]
      )}
    >
      {notification.message}
    </div>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
