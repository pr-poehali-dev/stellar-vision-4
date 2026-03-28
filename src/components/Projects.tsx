import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Турция",
    category: "Пляжный отдых · Всё включено",
    location: "Анталья, Кемер, Бодрум, Аланья",
    year: "от 45 000 ₽",
    image: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/fb3c0bd4-e8bd-48d9-935a-c7a1d83d3061.jpg",
  },
  {
    id: 2,
    title: "Египет",
    category: "Пляжный отдых · Экскурсии",
    location: "Хургада, Шарм-эль-Шейх, Каир",
    year: "от 42 000 ₽",
    image: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/3a82b955-44e3-4294-ab92-7bf23aba0199.jpg",
  },
  {
    id: 3,
    title: "Россия",
    category: "Внутренний туризм",
    location: "Сочи, Крым, Байкал, Камчатка, Алтай",
    year: "от 28 000 ₽",
    image: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/fd252e5c-eb01-4bd4-973e-a6cd41eca913.jpg",
  },
  {
    id: 4,
    title: "Мальдивы",
    category: "Премиум · Экзотика",
    location: "Атоллы Мале, Ари, Баа",
    year: "от 120 000 ₽",
    image: "https://cdn.poehali.dev/projects/561201b8-6f6c-4656-bd73-f78fa78dffa6/files/281b1293-2b71-48b1-8661-6b6a411cc2a6.jpg",
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Популярные направления</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Куда отправиться</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Все направления
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === project.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.category} · {project.location}
                  </p>
                </div>
                <span className="text-muted-foreground/60 text-sm">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}