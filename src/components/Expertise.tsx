import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"
import { HighlightedText } from "./HighlightedText"

const expertiseAreas = [
  {
    title: "Пляжный отдых",
    description: "Турция, Египет, ОАЭ, Мальдивы, Таиланд, Куба, Бали — подберём идеальный отель, рейс и систему питания под ваш бюджет и дату.",
    icon: "Palmtree",
  },
  {
    title: "Деловые поездки и MICE",
    description:
      "Корпоративные туры, конференции, тимбилдинг за рубежом. Организуем всё «под ключ»: перелёт, отель, трансфер, программу.",
    icon: "Briefcase",
  },
  {
    title: "Свадьбы и медовый месяц",
    description:
      "Романтические туры, церемонии за границей, эксклюзивные программы для двоих. Создадим незабываемое начало совместной жизни.",
    icon: "Heart",
  },
  {
    title: "Круизы и экспедиции",
    description:
      "Морские и речные круизы, горнолыжные туры, экотуры на Байкал и Камчатку. Для тех, кто ищет настоящие впечатления.",
    icon: "Ship",
  },
]

export function Expertise() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наши услуги</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
            <HighlightedText>Любой</HighlightedText> отдых —
            <br />
            под ключ
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Мы берём на себя всё: подбор тура, оформление виз и страховки, бронирование отелей, трансфер и поддержку в поездке. Вам остаётся только наслаждаться.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {expertiseAreas.map((area, index) => {
            return (
              <div
                key={area.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`relative pl-8 border-l border-border transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`transition-all duration-1000 ${
                    visibleItems.includes(index) ? "animate-draw-stroke" : ""
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <Icon name={area.icon} fallback="Star" size={40} className="mb-4 text-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-4">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}