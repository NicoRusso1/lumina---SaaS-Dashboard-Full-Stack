import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Task } from '../types'
import { PriorityBadge } from '../components/ui/Badge'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import clsx from 'clsx'

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  useEffect(() => {
    const load = async () => {
      try {
        const boards = await boardService.getAll()
        const results = await Promise.all(
          boards.slice(0, 5).map((b) => taskService.getByBoard(b.id).catch(() => [] as Task[]))
        )
        setTasks(results.flat())
      } catch {
        // silent
      }
    }
    load()
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = getDay(monthStart)
  const emptyDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 })

  const getTasksForDay = (day: Date) =>
    tasks.filter((t) => isSameDay(new Date(t.createdAt), day))

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : []

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Calendar</h1>
          <p className="text-sm text-text-secondary mt-0.5">Task timeline overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg bg-bg-surface border border-bg-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-text-primary min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg bg-bg-surface border border-bg-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-bg-surface border border-bg-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-bg-border">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-text-muted">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 border-b border-r border-bg-border/50" />
            ))}
            {days.map((day) => {
              const dayTasks = getTasksForDay(day)
              const isSelected = selectedDay ? isSameDay(day, selectedDay) : false
              const isCurrentDay = isToday(day)

              return (
                <motion.button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  whileHover={{ scale: 0.97 }}
                  className={clsx(
                    'h-16 p-1.5 border-b border-r border-bg-border/50 flex flex-col items-start transition-colors text-left',
                    isSelected && 'bg-violet-subtle',
                    !isSelected && 'hover:bg-bg-elevated'
                  )}
                >
                  <span
                    className={clsx(
                      'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                      isCurrentDay && 'bg-violet text-white',
                      !isCurrentDay && isSelected && 'text-violet',
                      !isCurrentDay && !isSelected && 'text-text-secondary'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((t, ti) => (
                        <div
                          key={ti}
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            t.completed ? 'bg-success' : t.priority === 'HIGH' ? 'bg-danger' : 'bg-violet'
                          )}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[8px] text-text-muted">+{dayTasks.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden">
          <div className="px-4 py-4 border-b border-bg-border">
            <h3 className="text-sm font-semibold text-text-primary">
              {selectedDay ? format(selectedDay, 'MMM d, yyyy') : 'Select a day'}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto max-h-96">
            {selectedDayTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs text-text-muted">No tasks this day</p>
              </div>
            ) : (
              selectedDayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-bg-elevated rounded-xl border border-bg-border space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={clsx(
                        'w-2 h-2 rounded-full mt-1 shrink-0',
                        task.completed ? 'bg-success' : 'bg-violet'
                      )}
                    />
                    <p
                      className={clsx(
                        'text-xs font-medium flex-1',
                        task.completed ? 'text-text-muted line-through' : 'text-text-primary'
                      )}
                    >
                      {task.title}
                    </p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
