import Image from "next/image";
import Link from "next/link";
import { ResetQuizLink } from "@/app/features/quiz/components/reset-quiz-link";

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <Link aria-label="Occa home" className="wordmark" href="/">
          <Image
            alt="Mindful"
            height={82}
            priority
            src="/logo.png"
            width={419}
          />
        </Link>
        <a className="header-link" href="#about">
          A moment for yourself
        </a>
      </header>
      <section aria-labelledby="landing-title" className="landing-hero">
        <div className="landing-copy-column">
          <p className="eyebrow">A MOMENT FOR YOU</p>
          <h1 id="landing-title">A little moment to understand yourself.</h1>
          <p className="landing-copy">2 minutes · No right or wrong answers</p>
          <ResetQuizLink
            className="button button-primary landing-cta"
            href="/quiz"
          >
            Start
          </ResetQuizLink>
          <p className="time-note">
            Four everyday situations. Just your honest response.
          </p>
        </div>
        <aside
          className="mascot-panel landing-mascot"
          aria-label="A moment for you"
        >
          <p>Let’s take two minutes for you.</p>
          <Image
            alt=""
            className="mascot-image"
            height={263}
            priority
            src="/Mooca.png"
            width={318}
          />
        </aside>
      </section>
      <footer className="landing-footer" id="about">
        <span>A little space to get to know you.</span>
        <span>Self-reflection, not a diagnosis</span>
      </footer>
    </main>
  );
}
