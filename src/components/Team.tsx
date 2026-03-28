import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const team = [
  {
    name: "Беляков Сергей Владимирович",
    role: "Директор агентства",
    specialization: "VIP-клиенты · Корпоративные договоры",
    description: "Руководит агентством и лично ведёт ключевых клиентов. Отвечает за партнёрства с туроператорами и качество всех услуг.",
    photo: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/3dce1728-a0e3-42b5-8c81-3bc2f11ca300.jpg",
    contacts: { phone: "+7 (817) 123-45-67", email: "belyakov@delta-travel.ru" },
  },
  {
    name: "Петров Иван Александрович",
    role: "Менеджер по выездному туризму",
    specialization: "Турция · Египет · ОАЭ · Европа",
    description: "Специализируется на международных направлениях. Поможет с подбором тура, оформлением визы и страховки для любой страны.",
    photo: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/32fe0b7e-b949-41c8-aab0-735d98b8775f.jpg",
    contacts: { phone: "+7 (817) 123-45-68", email: "petrov@delta-travel.ru" },
  },
  {
    name: "Смирнова Анна Викторовна",
    role: "Менеджер по внутреннему туризму",
    specialization: "Сочи · Крым · Байкал · Алтай",
    description: "Эксперт по отдыху в России. Знает лучшие санатории, курорты и маршруты — от пляжного Крыма до дикой Камчатки.",
    photo: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/06e4f02c-4e3e-4813-bd78-db53c6188761.jpg",
    contacts: { phone: "+7 (817) 123-45-69", email: "smirnova@delta-travel.ru" },
  },
]

export function Team() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
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
      { threshold: 0.2 }
    )
    itemRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="team" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наша команда</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance">
            Люди, которые организуют<br />ваш отдых
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              ref={(el) => { itemRefs.current[index] = el }}
              data-index={index}
              className={`group transition-all duration-700 ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-6">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="space-y-2">
                    <a href={`tel:${member.contacts.phone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-primary-foreground text-sm hover:text-accent transition-colors">
                      <Icon name="Phone" size={14} />
                      {member.contacts.phone}
                    </a>
                    <a href={`mailto:${member.contacts.email}`} className="flex items-center gap-2 text-primary-foreground text-sm hover:text-accent transition-colors">
                      <Icon name="Mail" size={14} />
                      {member.contacts.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-accent pl-4">
                <p className="text-xs tracking-[0.2em] uppercase text-accent font-medium mb-1">{member.specialization}</p>
                <h3 className="font-medium text-lg leading-tight mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
