import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { HighlightedText } from "./HighlightedText"
import { TourRequestForm } from "./TourRequestForm"

export function CallToAction() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section id="contact" className="py-32 md:py-29 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12">
        {!showForm ? (
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary-foreground/60 text-sm tracking-[0.3em] uppercase mb-8">Запишитесь на консультацию</p>

            <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance">
              Ваш идеальный отдых
              <br />
              начинается <HighlightedText>здесь</HighlightedText>
            </h2>

            <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Бесплатная консультация без обязательств. Расскажите, куда хотите — мы найдём лучший вариант под ваш бюджет и сроки.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center gap-3 bg-primary-foreground text-foreground px-8 py-4 text-sm tracking-wide hover:bg-primary-foreground/90 transition-colors duration-300 group"
              >
                Подобрать тур онлайн
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="tel:+78171234567"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 px-8 py-4 text-sm tracking-wide hover:bg-primary-foreground/10 transition-colors duration-300"
              >
                +7 (817) 123-45-67
              </a>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary-foreground/60 text-sm tracking-[0.3em] uppercase mb-2">Заявка на тур</p>
                <h2 className="text-2xl md:text-3xl font-medium">Подберём идеальный вариант</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm underline">
                Назад
              </button>
            </div>
            <div className="bg-primary-foreground text-foreground p-8">
              <TourRequestForm />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
