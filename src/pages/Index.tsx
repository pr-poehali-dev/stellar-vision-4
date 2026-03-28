import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Projects } from "../components/Projects"
import { Expertise } from "../components/Expertise"
import { Team } from "../components/Team"
import { Office } from "../components/Office"
import { Partners } from "../components/Partners"
import { FAQ } from "../components/FAQ"
import { CallToAction } from "../components/CallToAction"
import { Footer } from "../components/Footer"

export default function Index() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Projects />
      <Expertise />
      <Partners />
      <Team />
      <Office />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  )
}
