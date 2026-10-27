import { Logo } from "./logo";

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 pt-5 pb-2 md:px-10 md:pt-7 xl:px-14">
      <Logo />
      <span className="text-sm font-light text-ink md:text-xl">
        Self-reflection
      </span>
    </header>
  );
}
