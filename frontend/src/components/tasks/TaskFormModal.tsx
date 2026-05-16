import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Task, Priority } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import clsx from 'clsx'

interface TaskFormData {
  title: string
  description: string
  priority: Priority
}

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  initialData?: Task | null
  loading?: boolean
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Low', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  { value: 'HIGH', label: 'High', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
]

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { priority: 'MEDIUM' },
  })

  const selectedPriority = watch('priority')

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        priority: initialData.priority,
      })
    } else {
      reset({ title: '', description: '', priority: 'MEDIUM' })
    }
  }, [initialData, reset, isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit task' : 'New task'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          autoFocus
          {...register('title', { required: 'Title is required' })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Description
          </label>
          <textarea
            className="w-full bg-bg-elevated border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none transition-colors outline-none focus:border-violet/60 hover:border-bg-overlay"
            rows={3}
            placeholder="Add a description (optional)"
            {...register('description')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Priority
          </label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setValue('priority', p.value)}
                className={clsx(
                  'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  selectedPriority === p.value
                    ? p.color
                    : 'text-text-muted border-bg-border hover:border-bg-overlay'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
