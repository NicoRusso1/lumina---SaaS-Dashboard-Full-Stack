import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-bg-elevated rounded-lg animate-skeleton',
        className
      )}
    />
  )
}

export function TaskSkeleton() {
  return (
    <div className="p-4 bg-bg-surface border border-bg-border rounded-xl space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-64" />
      <div className="flex items-center gap-3 pt-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="p-5 bg-bg-surface border border-bg-border rounded-xl space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-full mt-4" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="p-5 bg-bg-surface border border-bg-border rounded-xl space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
