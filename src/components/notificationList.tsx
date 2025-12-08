import { Bell, CheckCircle2, Info, Star } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { motion } from 'framer-motion'
import { useNotifications } from '@/context/notificationContext'

export default function NotificationsList() {
  const {
    notifications,
    loading,
    markAsRead,
    fetchNotifications,
    page,
    totalPages,
  } = useNotifications()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
  }
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner color="white" size="lg" />
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
                className={`flex items-start gap-3 rounded-xl border p-2 cursor-pointer transition-all duration-200 ${
                  notif.is_read
                    ? 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70'
                    : 'border-primary/30 bg-primary/10 hover:bg-primary/20'
                }`}
              >
                <div className="flex-shrink-0">
                  {notif.type === 'xp' ? (
                    <Star className="w-6 h-6 text-yellow-400" />
                  ) : notif.type === 'objective' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : notif.type === 'store' ? (
                    <Info className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Bell className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* 📝 Notification Info */}
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      notif.is_read ? 'text-gray-300' : 'text-white'
                    }`}
                  >
                    {notif.title}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      notif.is_read ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(notif.created_at)}</p>
                </div>

                {/* 🟢 Unread Dot */}
                {!notif.is_read && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>

          {/* 🔄 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between mt-6">
              <button
                disabled={page <= 1}
                onClick={() => fetchNotifications({ page: page - 1 })}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchNotifications({ page: page + 1 })}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 flex-1 flex flex-col justify-center">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground mt-2">
            You'll see game updates and important announcements here
          </p>
        </div>
      )}
    </>
  )
}
