import { Task } from '../../types'
import { PriorityBadge } from '../ui/PriorityBadge'
import clsx from 'clsx'

interface TaskCardProps {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const date = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="group flex items-start gap-3 p-4 bg-bg-surface border border-bg-border rounded-xl hover:border-violet/20 transition-all animate-fade-in">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className={clsx(
          'mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
          task.completed
            ? 'bg-emerald-400 border-emerald-400'
            : 'border-bg-overlay hover:border-violet'
        )}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5 3.5-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-sm font-medium transition-colors',
            task.completed
              ? 'line-through text-text-muted'
              : 'text-text-primary'
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <PriorityBadge priority={task.priority} />
          {task.category && (
            <span
              className="inline-flex items-center gap-1 text-xs text-text-secondary"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: task.category.color }}
              />
              {task.category.name}
            </span>
          )}
          <span className="text-xs text-text-muted font-mono">{date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
            <path
              d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
            <path
              d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.5 8h7l.5-8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
