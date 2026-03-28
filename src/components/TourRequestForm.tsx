import { useState } from 'react'
import Icon from '@/components/ui/icon'
import { submitTourRequest } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

const destinations = ['Турция', 'Египет', 'ОАЭ', 'Мальдивы', 'Таиланд', 'Греция', 'Испания', 'Италия', 'Франция', 'Вьетнам', 'Бали', 'Куба', 'Кипр', 'Сочи', 'Крым', 'Байкал', 'Камчатка', 'Алтай', 'Другое']
const budgets = ['до 50 000 ₽', '50 000 – 100 000 ₽', '100 000 – 200 000 ₽', '200 000 – 500 000 ₽', 'более 500 000 ₽']
const durations = ['3-4 ночи', '5-7 ночей', '8-10 ночей', '11-14 ночей', '15+ ночей']

export function TourRequestForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    phone: user?.phone || '',
    email: user?.email || '',
    destination: '',
    departure_date: '',
    duration: '',
    adults: '2',
    children: '0',
    budget: '',
    comment: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await submitTourRequest({ ...form, adults: Number(form.adults), children: Number(form.children), user_id: user?.id })
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Check" size={32} className="text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-medium mb-3">Заявка отправлена!</h3>
        <p className="text-muted-foreground mb-6">Наш менеджер свяжется с вами в течение 30 минут в рабочее время.</p>
        <button onClick={() => setSuccess(false)} className="text-sm underline text-muted-foreground hover:text-foreground">
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Ваше имя *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Иван Петров" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Телефон *</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} required
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="+7 (___) ___-__-__" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          placeholder="your@email.ru" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Направление</label>
          <select value={form.destination} onChange={e => set('destination', e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
            <option value="">Выберите направление</option>
            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Длительность</label>
          <select value={form.duration} onChange={e => set('duration', e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
            <option value="">Выберите длительность</option>
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Дата вылета</label>
          <input type="date" value={form.departure_date} onChange={e => set('departure_date', e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Взрослых</label>
          <select value={form.adults} onChange={e => set('adults', e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Детей</label>
          <select value={form.children} onChange={e => set('children', e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
            {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Бюджет на человека</label>
        <select value={form.budget} onChange={e => set('budget', e.target.value)}
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
          <option value="">Укажите бюджет</option>
          {budgets.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Пожелания</label>
        <textarea value={form.comment} onChange={e => set('comment', e.target.value)} rows={3}
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Ваши пожелания, особые требования..." />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-primary text-primary-foreground py-4 text-sm tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <><Icon name="Loader2" size={16} className="animate-spin" /> Отправляем...</> : <><Icon name="Send" size={16} /> Отправить заявку</>}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных. Ответим в течение 30 минут.
      </p>
    </form>
  )
}
