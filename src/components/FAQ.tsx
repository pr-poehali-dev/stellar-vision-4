import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "С чего начать, если я хочу построить дом?",
    answer:
      "Начните с бесплатной консультации — позвоните или напишите нам. На встрече мы обсудим ваше видение, участок, бюджет и сроки. После этого подготовим краткое техническое задание и смету на проектирование. Никаких обязательств — просто честный разговор.",
  },
  {
    question: "Сколько стоит проект и от чего зависит цена?",
    answer:
      "Стоимость проектирования зависит от площади объекта, его типа и состава документации. Жилой дом площадью 300–500 м² — ориентировочно от 1,5 до 4 млн рублей за полный пакет. Точную цифру называем после первой встречи и изучения участка.",
  },
  {
    question: "Сколько времени занимает проектирование?",
    answer:
      "Эскизный проект частного дома — 4–6 недель. Рабочая документация — ещё 2–3 месяца. Для коммерческих объектов сроки больше и зависят от масштаба. Мы всегда фиксируем сроки в договоре и соблюдаем их.",
  },
  {
    question: "Вы сопровождаете стройку или только проектируете?",
    answer:
      "Оба варианта. Мы можем передать вам готовую документацию, а можем вести авторский надзор на протяжении всего строительства. Второй вариант даёт гарантию, что объект будет построен именно так, как задумано.",
  },
  {
    question: "Работаете ли вы за пределами Москвы?",
    answer:
      "Да, мы реализуем проекты по всей России. Выезжаем на участок для замеров и осмотра, остальная работа ведётся удалённо с регулярными согласованиями. Среди наших объектов — Подмосковье, Сочи, Санкт-Петербург, Казань.",
  },
  {
    question: "Можно ли заказать только дизайн интерьера без архитектуры?",
    answer:
      "Да, если здание уже построено или находится в стадии строительства. Мы разрабатываем концепцию интерьера, рабочие чертежи, спецификации материалов и сопровождаем до финала. Лучший результат — когда архитектура и интерьер создаются одной командой.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}