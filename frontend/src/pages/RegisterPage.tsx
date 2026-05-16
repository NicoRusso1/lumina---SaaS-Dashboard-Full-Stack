import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react'

interface FormData {
  username: string
  email: string
  password: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authService.register(data.username, data.email, data.password)
      setAuth(res.user, res.token)
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Try a different email.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-violet shadow-glow mb-4">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1.5">Start organizing smarter with Lumina</p>
        </div>

        <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-modal">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="yourname"
                  {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-border rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/20 transition"
                />
              </div>
              {errors.username && <p className="text-xs text-danger">{errors.username.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-border rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/20 transition"
                />
              </div>
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-bg-border rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/20 transition"
                />
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              loading={isSubmitting}
              icon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-violet hover:text-violet-light transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
