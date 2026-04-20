'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Mail, Lock, User, Loader2, LogOut, Shield, KeyRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AuthModalProps {
  language: 'en' | 'ar'
  onClose?: () => void
}

export function AuthModal({ language, onClose }: AuthModalProps) {
  const { data: session, status } = useSession()
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        
        if (res.ok) {
          setSuccess(language === 'en' 
            ? 'Check your email for a password reset link' 
            : 'تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور'
          )
        } else {
          const data = await res.json()
          setError(data.error || 'Failed to send reset email')
        }
        setIsLoading(false)
        return
      }

      if (mode === 'signup') {
        // Signup
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, licenseNumber })
        })
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.message || 'Signup failed')
        } else {
          setSuccess(language === 'en' ? 'Account created! Please sign in.' : 'تم إنشاء الحساب! يرجى تسجيل الدخول.')
          setMode('login')
        }
      } else {
        // Login
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        
        if (result?.error) {
          console.error("Login failed:", result.error)
          setError(language === 'en' ? 'Invalid email or password' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
        } else {
          setSuccess(language === 'en' ? 'Welcome back!' : 'مرحباً بعودتك!')
          setTimeout(() => {
            onClose?.()
            // Optional: refresh the page to ensure all session state is updated everywhere
            window.location.reload()
          }, 1000)
        }
      }
    } catch (err) {
      setError(language === 'en' ? 'An error occurred' : 'حدث خطأ')
    }
    
    setIsLoading(false)
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            {language === 'en' ? 'Account' : 'الحساب'}
          </CardTitle>
          <CardDescription>
            {session.user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div>
              <p className="font-medium">{session.user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={session.user.role === 'admin' ? 'default' : 'secondary'}>
                  {session.user.role}
                </Badge>
                {session.user.isVerified && (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {language === 'en' ? 'Verified' : 'موثق'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {mode === 'forgot'
            ? (language === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور')
            : mode === 'login' 
              ? (language === 'en' ? 'Sign In' : 'تسجيل الدخول')
              : (language === 'en' ? 'Create Account' : 'إنشاء حساب')
          }
        </CardTitle>
        <CardDescription>
          {mode === 'forgot'
            ? (language === 'en' ? 'Enter your email to receive a reset link' : 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين')
            : mode === 'login'
              ? (language === 'en' ? 'Access your saved data and progress' : 'الوصول إلى بياناتك وتقدمك المحفوظ')
              : (language === 'en' ? 'Join to save favorites and track progress' : 'انضم لحفظ المفضلات وتتبع التقدم')
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'forgot' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="doctor@hospital.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm">
                <Shield className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'en' ? 'Please wait...' : 'يرجى الانتظار...'}
                </>
              ) : (
                language === 'en' ? 'Send Reset Link' : 'إرسال رابط إعادة التعيين'
              )}
            </Button>

            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={() => setMode('login')}
            >
              {language === 'en' ? 'Back to Sign In' : 'العودة لتسجيل الدخول'}
            </Button>
          </form>
        ) : (
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">{language === 'en' ? 'Sign In' : 'دخول'}</TabsTrigger>
              <TabsTrigger value="signup">{language === 'en' ? 'Sign Up' : 'تسجيل'}</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Full Name' : 'الاسم الكامل'}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'en' ? 'Dr. John Smith' : 'د. أحمد محمد'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Pharmacy License Number (Optional)' : 'رقم ترخيص الصيدلة (اختياري)'}</Label>
                  <Input
                    placeholder="UAE-PH-XXXXX"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="doctor@hospital.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Password' : 'كلمة المرور'}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Min 8 characters with letter and number' : '8 أحرف على الأقل مع حرف ورقم'}
                </p>
              )}
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline mt-1"
                  onClick={() => setMode('forgot')}
                >
                  {language === 'en' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm">
                <Shield className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'en' ? 'Please wait...' : 'يرجى الانتظار...'}
                </>
              ) : mode === 'login' ? (
                language === 'en' ? 'Sign In' : 'تسجيل الدخول'
              ) : (
                language === 'en' ? 'Create Account' : 'إنشاء حساب'
              )}
            </Button>
            </form>
          </Tabs>
        )}
        </CardContent>
    </Card>
  )
}
