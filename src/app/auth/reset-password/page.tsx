'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Loader2, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-8 shadow-2xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const isValidToken = token !== null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to reset password')
      }
    } catch {
      setError('An unexpected error occurred')
    }

    setIsLoading(false)
  }

  if (isValidToken === false) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black italic uppercase mb-2">Invalid Link</h2>
          <p className="text-gray-500 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/auth/forgot-password">
            <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold uppercase tracking-widest text-[10px]">
              Request New Link
            </Button>
          </Link>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-black italic uppercase mb-2">Password Reset</h2>
          <p className="text-gray-500 mb-6">Your password has been successfully reset.</p>
          <Link href="/auth/login">
            <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold uppercase tracking-widest text-[10px]">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus-visible:ring-2 focus-visible:ring-cyan-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus-visible:ring-2 focus-visible:ring-cyan-500"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-bold uppercase tracking-widest text-[10px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
          </Button>
        </form>
      )}
    </GlassCard>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter">DrugEye</span>
          </Link>
          <h1 className="text-3xl font-black italic uppercase mb-2">Reset Password</h1>
          <p className="text-gray-500">Create a new password for your account</p>
        </div>

        <Suspense fallback={<GlassCard><div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div></GlassCard>}>
          <ResetPasswordContent />
        </Suspense>

        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mt-6">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </div>
  )
}
