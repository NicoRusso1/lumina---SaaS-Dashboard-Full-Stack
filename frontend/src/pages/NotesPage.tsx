import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Note } from '../types'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Plus, StickyNote, Trash2, Pin, PinOff, Search, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

export function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('lumina_notes', [])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [search, setSearch] = useState('')

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const openCreate = () => {
    setActiveNote(null)
    setEditTitle('')
    setEditContent('')
    setIsCreating(true)
  }

  const openNote = (note: Note) => {
    setActiveNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsCreating(true)
  }

  const saveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) { setIsCreating(false); return }
    const now = new Date().toISOString()
    if (activeNote) {
      setNotes((prev) =>
        prev.map((n) => n.id === activeNote.id ? { ...n, title: editTitle, content: editContent, updatedAt: now } : n)
      )
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).slice(2),
        title: editTitle || 'Untitled',
        content: editContent,
        createdAt: now,
        updatedAt: now,
      }
      setNotes((prev) => [newNote, ...prev])
    }
    setIsCreating(false)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (activeNote?.id === id) { setIsCreating(false); setActiveNote(null) }
  }

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  return (
    <div className="flex h-full">
      {/* Sidebar list */}
      <div className="w-72 shrink-0 border-r border-bg-border flex flex-col h-full">
        <div className="p-4 border-b border-bg-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold text-text-primary">Notes</h1>
            <Button size="xs" icon={<Plus className="w-3 h-3" />} onClick={openCreate}>
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-bg-elevated border border-bg-border rounded-lg text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-violet/40 transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-text-muted" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-8 text-xs text-text-muted">
              {search ? 'No results' : 'No notes yet'}
            </div>
          ) : (
            <AnimatePresence>
              {sortedNotes.map((note) => (
                <motion.button
                  key={note.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => openNote(note)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all group',
                    activeNote?.id === note.id
                      ? 'bg-violet-subtle border-violet/30'
                      : 'border-transparent hover:bg-bg-elevated hover:border-bg-border',
                  )}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-semibold text-text-primary truncate flex-1">
                      {note.pinned && <Pin className="w-2.5 h-2.5 text-violet inline mr-1" />}
                      {note.title || 'Untitled'}
                    </p>
                  </div>
                  <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-2">
                    {note.content || 'Empty note'}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border">
              <input
                type="text"
                placeholder="Note title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 bg-transparent text-base font-semibold text-text-primary placeholder:text-text-muted outline-none"
              />
              <div className="flex items-center gap-2">
                {activeNote && (
                  <>
                    <button
                      onClick={() => togglePin(activeNote.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-violet hover:bg-violet-subtle transition-colors"
                    >
                      {activeNote.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteNote(activeNote.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/8 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <Button size="sm" onClick={saveNote}>Save</Button>
              </div>
            </div>
            <textarea
              autoFocus={!editTitle}
              placeholder="Start writing..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 bg-transparent px-6 py-5 text-sm text-text-primary placeholder:text-text-muted outline-none resize-none leading-relaxed"
            />
            {activeNote && (
              <div className="px-6 py-3 border-t border-bg-border text-xs text-text-muted">
                Last edited {formatDistanceToNow(new Date(activeNote.updatedAt), { addSuffix: true })} · {editContent.length} chars
              </div>
            )}
          </motion.div>
        ) : (
          <EmptyState
            icon={<StickyNote className="w-7 h-7" />}
            title="Select or create a note"
            description="Your thoughts, organized beautifully."
            action={<Button icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>New Note</Button>}
          />
        )}
      </div>
    </div>
  )
}
