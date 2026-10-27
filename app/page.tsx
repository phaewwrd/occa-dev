import { FadeUp } from "@/app/components/fade-up";
import { MascotPlaceholder } from "@/app/components/mascot-placeholder";
import { SelectionFrame } from "@/app/components/selection-frame";
import { StartButton } from "@/app/features/quiz/components/start-button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-20 pb-10 md:justify-center md:pt-16 md:pb-16">
      <div className="relative w-full max-w-[19.5rem] sm:max-w-[25rem] md:max-w-[29rem]">
        <SelectionFrame>
          <div className="grid aspect-[1.08] place-items-center bg-[radial-gradient(circle_at_50%_50%,#f5f8ff_0%,#fff_70%)] px-5 text-center">
            <FadeUp delay={0.45}>
              <p className="text-2xl text-primary md:text-[2.4rem]">A moment</p>
              <h1 className="mt-1 text-[2.4rem] leading-[1.22] font-light text-ink sm:text-5xl md:mt-3 md:text-[3.6rem]">
                to understand yourself
              </h1>
            </FadeUp>
          </div>
        </SelectionFrame>
        <MascotPlaceholder
          className="absolute -top-16 -right-5 w-32 sm:-top-20 sm:-right-12 sm:w-40 md:-top-[22%] md:-right-[20%] md:w-[48%] lg:-top-[27%] lg:-right-[44%] lg:w-[66%]"
          priority
          variant="intro"
        />
      </div>

      <FadeUp className="mt-16 text-center md:mt-20" delay={0.75}>
        <p className="font-hand text-[1.45rem] leading-tight sm:text-[1.65rem] text-ink md:text-[2.4rem]">
          A little space to get to know you.
        </p>
        <p className="mt-2 text-sm text-muted md:text-base">
          2 minutes ·{" "}
          <span className="text-primary-ink">No right or wrong answers</span>
        </p>
      </FadeUp>

      <StartButton className="mt-6 md:fixed md:right-10 md:bottom-10 md:mt-0 xl:right-14 xl:bottom-14" />
    </main>
  );
}
