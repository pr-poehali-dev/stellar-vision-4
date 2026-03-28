import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Как забронировать тур?",
    answer:
      "Позвоните нам, напишите на почту или приходите в офис по адресу: г. Сокольское, ул. Центральная, д. 12, офис 201. Мы подберём варианты под ваш бюджет и пожелания, оформим договор и все документы. Работаем Пн–Пт с 9:00 до 19:00, Сб с 10:00 до 16:00.",
  },
  {
    question: "Нужна ли виза для поездки за рубеж?",
    answer:
      "Зависит от направления. Турция, Египет, ОАЭ, Таиланд — безвизовые для россиян. В Европу, США, Японию и ряд других стран виза нужна. Мы помогаем с оформлением виз и готовим все необходимые документы.",
  },
  {
    question: "Что входит в стоимость тура?",
    answer:
      "Как правило: перелёт, проживание, страховка и трансфер аэропорт–отель. Система «всё включено» дополнительно включает питание и часть напитков. Точный состав всегда указывается при бронировании — никаких скрытых доплат.",
  },
  {
    question: "Можно ли поехать в тур с детьми?",
    answer:
      "Конечно! Мы специализируемся на семейных турах. Подберём отели с аниматорами, детскими бассейнами, мини-клубами и детским меню. Также оформим все необходимые документы для выезда ребёнка за границу.",
  },
  {
    question: "Как застраховать поездку?",
    answer:
      "Туристическая страховка оформляется при бронировании тура. Мы предлагаем базовые и расширенные программы, включая страховку от невыезда, страховку багажа и медицинскую помощь за рубежом. Рекомендуем не пренебрегать этой защитой.",
  },
  {
    question: "Что делать, если возникли проблемы на отдыхе?",
    answer:
      "Звоните вашему менеджеру напрямую — его контакт есть в договоре. Мы на связи и поможем решить любую ситуацию: переселение, задержка рейса, проблемы со здоровьем. Вы не останетесь наедине с проблемой.",
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