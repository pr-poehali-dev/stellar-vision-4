import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const officeFeatures = [
  { icon: "MapPin", text: "г. Сокольское, ул. Центральная, д. 12, офис 201" },
  { icon: "Clock", text: "Пн–Пт: 9:00–19:00, Сб: 10:00–16:00" },
  { icon: "Phone", text: "+7 (817) 123-45-67" },
  { icon: "Mail", text: "info@delta-travel.ru" },
]

const officeZones = [
  { title: "Зона приёма клиентов", desc: "Уютная приёмная с мягкими диванами, телевизором с видеороликами о курортах и стойками с актуальными каталогами туров." },
  { title: "Рабочие места менеджеров", desc: "Три полностью оснащённых рабочих места с профессиональным оборудованием для быстрого подбора и оформления туров." },
  { title: "Переговорная комната", desc: "Отдельная комната для встреч с корпоративными клиентами, презентаций туров и VIP-консультаций." },
]

export function Office() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="office" ref={sectionRef} className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наш офис</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance">
            Приходите — мы всегда рады
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Фото офиса */}
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="relative">
              <img
                src="https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/beea58a4-0afc-4bab-8f7e-e04414700189.jpg"
                alt="Офис Delta Travel — зона приёма клиентов"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
            </div>
            <div className="mt-4">
              <img
                src="https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/3cd64daa-e666-44be-ae50-d47d727737cf.jpg"
                alt="Офис Delta Travel — переговорная комната"
                className="w-full aspect-[16/7] object-cover"
              />
            </div>
          </div>

          {/* Информация */}
          <div className={`transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {/* Контактные данные */}
            <div className="space-y-4 mb-10">
              {officeFeatures.map((item) => (
                <div key={item.text} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-none bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} fallback="Info" size={18} className="text-primary-foreground" />
                  </div>
                  <span className="text-foreground leading-relaxed pt-2">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-10 space-y-6">
              {officeZones.map((zone, i) => (
                <div key={zone.title} className="flex gap-4">
                  <span className="text-muted-foreground/50 text-sm font-medium mt-0.5">0{i + 1}</span>
                  <div>
                    <h4 className="font-medium mb-1">{zone.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{zone.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 mt-10 bg-primary text-primary-foreground px-6 py-3 text-sm tracking-wide hover:bg-primary/90 transition-colors"
            >
              Записаться на консультацию
              <Icon name="ArrowRight" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
