"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function HeaderNote() {
  const pathname = usePathname();

  return (
    <span className="header-note">
      {pathname === "/" ? "A moment for yourself" : "Self-reflection"}
    </span>
  );
}

export function QuizHeader() {
  return (
    <header className="quiz-header">
      <Link aria-label="OOCA home" className="wordmark" href="/">
        <Image alt="Mindful" height={82} priority src="/logo.png" width={419} />
      </Link>
      <Suspense fallback={<span className="header-note" />}>
        <HeaderNote />
      </Suspense>
    </header>
  );
}