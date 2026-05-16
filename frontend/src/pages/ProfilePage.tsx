import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth.store'
import { useToast } from '../context/ToastContext'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Camera, User, Mail, Shield, Edit3, Save, X, CheckCircle } from 'lucide-react'

export function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      updateUser({ avatar: base64 })
      toast.success('Avatar updated')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!username.trim()) return
    setSaving(true)
    setTimeout(() => {
      updateUser({ username: username.trim() })
      toast.success('Profile updated')
      setEditing(false)
      setSaving(false)
    }, 600)
  }

  const stats = [
    { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : '-' },
    { label: 'Role', value: user?.role || 'USER' },
    { label: 'Workspace', value: 'Personal' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        {/* Avatar section */}
        <div className="p-6 bg-bg-surface border border-bg-border rounded-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              <Avatar src={user?.avatar} name={user?.username} size="xl" online />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h2 className="text-lg font-bold text-text-primary">{user?.username}</h2>
                <span className="px-2 py-0.5 rounded-full bg-violet-subtle text-violet text-[10px] font-semibold border border-violet/20">
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{user?.email}</p>

              <div className="flex items-center gap-4 justify-center sm:justify-start">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs font-semibold text-text-primary">{s.value}</p>
                    <p className="text-[10px] text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={editing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              onClick={() => { setEditing(!editing); setUsername(user?.username || '') }}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 bg-bg-surface border border-bg-border rounded-xl space-y-4"
          >
            <h3 className="text-sm font-semibold text-text-primary">Edit Profile</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-overlay border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-bg-overlay border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-muted outline-none opacity-60 cursor-not-allowed"
              />
              <p className="text-[10px] text-text-muted">Email cannot be changed</p>
            </div>
            <Button
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              loading={saving}
              onClick={handleSave}
              disabled={!username.trim() || username === user?.username}
            >
              Save changes
            </Button>
          </motion.div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: User, label: 'Username', value: user?.username || '-' },
            { icon: Mail, label: 'Email', value: user?.email || '-' },
            { icon: Shield, label: 'Role', value: user?.role || 'USER' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 bg-bg-surface border border-bg-border rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-subtle flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-violet" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted">{label}</p>
                <p className="text-xs font-semibold text-text-primary truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Avatar upload tip */}
        <div className="p-4 bg-bg-surface border border-bg-border rounded-xl flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-text-primary">Profile picture</p>
            <p className="text-xs text-text-muted mt-0.5">
              Click your avatar to upload a new photo. Supported formats: JPG, PNG, WebP. Max 2MB.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
