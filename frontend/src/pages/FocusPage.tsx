import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Target, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'

type Mode = 'work' | 'short_break' | 'long_break'

const MODES: Record<Mode, { label: string; duration: number; color: string }> = {
  work: { label: 'Focus', duration: 25 * 60, color: 'text-violet' },
  short_break: { label: 'Short Break', duration: 5 * 60, color: 'text-success' },
  long_break: { label: 'Long Break', duration: 15 * 60, color: 'text-info' },
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function formatTime(seconds: number) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

export function FocusPage() {
  const [mode, setMode] = useState<Mode>('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [taskName, setTaskName] = useState('')
  const [muted, setMuted] = useState(false)

  const total = MODES[mode].duration
  const progress = ((total - timeLeft) / total) * 100
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    setTimeLeft(MODES[mode].duration)
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setRunning(false)
          if (mode === 'work') setSessions((s) => s + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, mode])

  const reset = useCallback(() => {
    setRunning(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  const containerCls = 'min-h-screen flex flex-col items-center justify-center transition-colors duration-500 p-8'

  return (
    <div className={containerCls}>
      {/* Mode selector */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-1 bg-bg-surface border border-bg-border rounded-xl p-1 mb-10"
      >
        {(Object.entries(MODES) as [Mode, typeof MODES[Mode]][]).map(([id, cfg]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              mode === id
                ? 'bg-bg-elevated text-text-primary shadow-inner-glow'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {cfg.label}
          </button>
        ))}
      </motion.div>

      {/* Timer ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center justify-center mb-10"
      >
        <svg width="220" height="220" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Progress */}
          <motion.circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke={mode === 'work' ? '#7c6af7' : mode === 'short_break' ? '#22c55e' : '#3b82f6'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 8px ${mode === 'work' ? '#7c6af7' : mode === 'short_break' ? '#22c55e' : '#3b82f6'}40)` }}
            transition={{ duration: 0.3 }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-mono font-bold text-text-primary tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className={clsx('text-xs font-semibold mt-1 uppercase tracking-wider', MODES[mode].color)}>
            {MODES[mode].label}
          </span>
        </div>
      </motion.div>

      {/* Task input */}
      <div className="w-full max-w-xs mb-8">
        <input
          type="text"
          placeholder="What are you working on?"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full bg-bg-surface border border-bg-border rounded-xl px-4 py-3 text-sm text-center text-text-primary placeholder:text-text-muted outline-none focus:border-violet/40 transition"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={reset}
          className="p-3 rounded-xl bg-bg-surface border border-bg-border text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setRunning((r) => !r)}
          className={clsx(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-glow',
            'bg-violet hover:bg-violet-dim active:scale-95',
            running && 'shadow-glow-lg'
          )}
        >
          {running ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="p-3 rounded-xl bg-bg-surface border border-bg-border text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Session counter */}
      <div className="flex items-center gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-text-primary">{sessions}</p>
          <p className="text-xs text-text-muted">Sessions</p>
        </div>
        <div className="w-px h-8 bg-bg-border" />
        <div>
          <p className="text-2xl font-bold text-text-primary">{sessions * 25}</p>
          <p className="text-xs text-text-muted">Minutes focused</p>
        </div>
      </div>

      {/* Pomodoro dots */}
      {sessions > 0 && (
        <div className="flex gap-2 mt-6">
          {[...Array(Math.min(sessions, 8))].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2.5 h-2.5 rounded-full bg-violet"
            />
          ))}
        </div>
      )}

      {/* Quick mode switch */}
      <div className="mt-8 flex items-center gap-3 text-xs text-text-muted">
        <button
          onClick={() => setMode('short_break')}
          className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" /> Short break
        </button>
        <span>·</span>
        <button
          onClick={() => setMode('work')}
          className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
        >
          <Target className="w-3.5 h-3.5" /> Back to focus
        </button>
      </div>
    </div>
  )
}
