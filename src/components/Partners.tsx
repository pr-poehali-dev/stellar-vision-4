import { useEffect, useRef, useState } from "react"

const partners = [
  {
    name: "Pegas Touristik",
    rto: "РТО: 016576",
    description: "25 лет на рынке. Широкая сеть чартерных программ: Турция, Египет, Кипр, ОАЭ, Мальдивы, Куба, Бали.",
    commission: "9–12%",
    badge: "Пляжный отдых",
    color: "bg-blue-50 border-blue-200",
  },
  {
    name: "Алеан",
    rto: "РТО: 023654",
    description: "Лидер внутреннего туризма. Более 1000 объектов: Краснодарский край, Крым, санатории России, экскурсионные туры.",
    commission: "8–11%",
    badge: "Россия и СНГ",
    color: "bg-green-50 border-green-200",
  },
  {
    name: "Coral Travel",
    rto: "РТО: 016582",
    description: "Международная сеть OTI Holding. Высококачественный транспорт и программы лояльности. Турция, Греция, Испания, Таиланд.",
    commission: "10–14%",
    badge: "Премиум",
    color: "bg-orange-50 border-orange-200",
  },
]

const stats = [
  { value: "80+", label: "Туров продано" },
  { value: "3", label: "Туроператора-партнёра" },
  { value: "20+", label: "Направлений мира" },
  { value: "100%", label: "Довольных клиентов" },
]

export function Partners() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="partners" ref={sectionRef} className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">

        {/* Статистика */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-5xl md:text-6xl font-medium text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-sm tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-20">
          <div className="mb-12">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наши партнёры</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              Работаем с лучшими<br />туроператорами России
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className={`border p-8 transition-all duration-700 ${partner.color} ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{partner.name}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{partner.rto}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary text-primary-foreground tracking-wide">
                    {partner.badge}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{partner.description}</p>
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-xs text-muted-foreground">Агентская комиссия</span>
                  <span className="font-medium text-primary">{partner.commission}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
