import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { updateProfile, getMyRequests } from '@/lib/api'
import Icon from '@/components/ui/icon'
import { TourRequestForm } from '@/components/TourRequestForm'

interface TourRequest {
  id: number
  destination: string
  departure_date: string
  duration: string
  adults: number
  children: number
  budget: string
  comment: string
  status: string
  status_label: string
  created_at: string
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Profile() {
  const { user, loading, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'requests' | 'settings' | 'new-request'>('overview')
  const [requests, setRequests] = useState<TourRequest[]>([])
  const [reqLoading, setReqLoading] = useState(false)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/auth')
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      setEditForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        passport_series: user.passport_series || '',
        passport_number: user.passport_number || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (tab === 'requests') {
      setReqLoading(true)
      getMyRequests().then(d => setRequests(d.requests)).catch(() => {}).finally(() => setReqLoading(false))
    }
  }, [tab])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(editForm)
      setUser({ ...user!, ...editForm })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Icon name="Loader2" size={32} className="animate-spin text-primary" /></div>
  if (!user) return null

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: 'LayoutDashboard' },
    { id: 'requests', label: 'Мои заявки', icon: 'ClipboardList' },
    { id: 'new-request', label: 'Подобрать тур', icon: 'PlusCircle' },
    { id: 'settings', label: 'Профиль', icon: 'Settings' },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/">
            <img src="https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/bucket/9ed04501-bd1f-40d0-add3-efe7a34d23e6.jpg"
              alt="Delta Travel" className="h-10 object-contain" />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
            <button onClick={() => { logout(); navigate('/') }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="LogOut" size={16} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="border border-border bg-card p-6 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-foreground text-2xl font-medium">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </span>
              </div>
              <h2 className="font-medium text-lg">{user.first_name} {user.last_name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              {user.phone && <p className="text-muted-foreground text-sm mt-1">{user.phone}</p>}
            </div>

            <nav className="border border-border bg-card overflow-hidden">
              {tabs.map((t, i) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm text-left transition-colors ${i > 0 ? 'border-t border-border' : ''} ${tab === t.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  <Icon name={t.icon} size={16} fallback="Circle" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1">

            {tab === 'overview' && (
              <div>
                <h1 className="text-2xl font-medium mb-6">Добро пожаловать, {user.first_name}!</h1>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="border border-border bg-card p-6">
                    <Icon name="ClipboardList" size={24} className="text-primary mb-3" />
                    <p className="text-3xl font-medium">{requests.length}</p>
                    <p className="text-muted-foreground text-sm mt-1">Заявок на туры</p>
                  </div>
                  <div className="border border-border bg-card p-6">
                    <Icon name="Globe" size={24} className="text-primary mb-3" />
                    <p className="text-3xl font-medium">20+</p>
                    <p className="text-muted-foreground text-sm mt-1">Направлений доступно</p>
                  </div>
                  <div className="border border-border bg-card p-6">
                    <Icon name="Phone" size={24} className="text-primary mb-3" />
                    <p className="text-lg font-medium mt-1">+7 (817) 123-45-67</p>
                    <p className="text-muted-foreground text-sm mt-1">Наш менеджер</p>
                  </div>
                </div>
                <div className="border border-border bg-card p-6">
                  <h3 className="font-medium mb-4">Быстрые действия</h3>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setTab('new-request')}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm hover:bg-primary/90 transition-colors">
                      <Icon name="PlusCircle" size={16} /> Подобрать тур
                    </button>
                    <button onClick={() => setTab('requests')}
                      className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                      <Icon name="ClipboardList" size={16} /> Мои заявки
                    </button>
                    <a href="tel:+78171234567"
                      className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                      <Icon name="Phone" size={16} /> Позвонить
                    </a>
                  </div>
                </div>

                <div className="border border-border bg-card p-6 mt-4">
                  <h3 className="font-medium mb-1">Нужна консультация?</h3>
                  <p className="text-muted-foreground text-sm mb-4">Наши менеджеры работают Пн–Пт с 9:00 до 19:00, Сб с 10:00 до 16:00</p>
                  <div className="flex gap-4 text-sm">
                    <a href="mailto:info@delta-travel.ru" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="Mail" size={14} /> info@delta-travel.ru
                    </a>
                    <a href="tel:+78171234567" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="Phone" size={14} /> +7 (817) 123-45-67
                    </a>
                  </div>
                </div>
              </div>
            )}

            {tab === 'requests' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-medium">Мои заявки</h1>
                  <button onClick={() => setTab('new-request')} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm hover:bg-primary/90 transition-colors">
                    <Icon name="Plus" size={16} /> Новая заявка
                  </button>
                </div>
                {reqLoading ? (
                  <div className="flex justify-center py-16"><Icon name="Loader2" size={32} className="animate-spin text-primary" /></div>
                ) : requests.length === 0 ? (
                  <div className="border border-border bg-card p-12 text-center">
                    <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">У вас пока нет заявок</p>
                    <button onClick={() => setTab('new-request')} className="bg-primary text-primary-foreground px-6 py-3 text-sm hover:bg-primary/90 transition-colors">
                      Подобрать тур
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map(req => (
                      <div key={req.id} className="border border-border bg-card p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-medium text-lg">{req.destination || 'Направление не указано'}</h3>
                            <p className="text-muted-foreground text-sm">Заявка №{req.id} · {new Date(req.created_at).toLocaleDateString('ru-RU')}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>
                            {req.status_label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {req.departure_date && <div><span className="text-muted-foreground block">Дата</span>{req.departure_date}</div>}
                          {req.duration && <div><span className="text-muted-foreground block">Длит.</span>{req.duration}</div>}
                          <div><span className="text-muted-foreground block">Туристы</span>{req.adults} взр. {req.children > 0 ? `+ ${req.children} дет.` : ''}</div>
                          {req.budget && <div><span className="text-muted-foreground block">Бюджет</span>{req.budget}</div>}
                        </div>
                        {req.comment && <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">{req.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'new-request' && (
              <div>
                <h1 className="text-2xl font-medium mb-6">Подобрать тур</h1>
                <div className="border border-border bg-card p-8">
                  <TourRequestForm />
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div>
                <h1 className="text-2xl font-medium mb-6">Данные профиля</h1>
                <div className="border border-border bg-card p-8 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Имя</label>
                      <input value={editForm.first_name || ''} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Фамилия</label>
                      <input value={editForm.last_name || ''} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Телефон</label>
                      <input value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Дата рождения</label>
                      <input type="date" value={editForm.birth_date || ''} onChange={e => setEditForm(f => ({ ...f, birth_date: e.target.value }))}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="border-t border-border pt-5">
                    <h3 className="font-medium mb-4 flex items-center gap-2"><Icon name="FileText" size={16} /> Паспортные данные</h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Серия паспорта</label>
                        <input value={editForm.passport_series || ''} onChange={e => setEditForm(f => ({ ...f, passport_series: e.target.value }))}
                          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="1234" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Номер паспорта</label>
                        <input value={editForm.passport_number || ''} onChange={e => setEditForm(f => ({ ...f, passport_number: e.target.value }))}
                          className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="567890" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <Icon name="Lock" size={12} /> Данные хранятся в защищённой базе и не передаются третьим лицам
                    </p>
                  </div>

                  <div className="border-t border-border pt-5">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input value={user.email} disabled className="w-full border border-border bg-muted px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-2">Email изменить нельзя. Зарегистрировано: {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—'}</p>
                  </div>

                  {saveSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm flex items-center gap-2">
                      <Icon name="CheckCircle" size={16} /> Данные успешно сохранены
                    </div>
                  )}

                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {saving ? <><Icon name="Loader2" size={16} className="animate-spin" /> Сохраняем...</> : <><Icon name="Save" size={16} /> Сохранить изменения</>}
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
