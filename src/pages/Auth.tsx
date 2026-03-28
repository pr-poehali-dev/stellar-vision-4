import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import Icon from '@/components/ui/icon'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      let data
      if (mode === 'register') {
        data = await register(form)
      } else {
        data = await login(form.email, form.password)
      }
      localStorage.setItem('delta_token', data.token)
      setUser(data.user)
      navigate('/profile')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center mb-10">
          <img src="https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/bucket/9ed04501-bd1f-40d0-add3-efe7a34d23e6.jpg"
            alt="Delta Travel" className="h-16 object-contain" />
        </a>

        <div className="border border-border bg-card p-8">
          <div className="flex mb-8 border-b border-border">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${mode === m ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
                {m === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя *</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)} required
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Иван" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Фамилия *</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)} required
                    className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Петров" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="your@email.ru" />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="+7 (___) ___-__-__" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Пароль *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required minLength={6}
                  className="w-full border border-border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary" placeholder="Минимум 6 символов" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 text-sm tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Icon name="Loader2" size={16} className="animate-spin" /> Загрузка...</> : mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="hover:text-foreground transition-colors flex items-center justify-center gap-1">
            <Icon name="ArrowLeft" size={14} /> Вернуться на главную
          </a>
        </p>
      </div>
    </div>
  )
}
