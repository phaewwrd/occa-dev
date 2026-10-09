# AGENTS.md — Quiz Web-App (4 Questions + Result Calculation)

> Read this file fully before writing any code. Follow it strictly.
> If something is ambiguous, check `public/` (UI) and the existing Drizzle schema first, then ask.

---

## 1. Goal

Build a **responsive, no-authentication** web-app where a visitor:

1. Answers **4 questions** (Q&A flow, one step at a time or as designed in `public/`)
2. Submits the answers
3. Sees a **calculated result**

The UI is **already prepared** and lives in the `public/` folder. Your job is to turn it into a working Next.js app wired to the database.

---

## 2. Stack & Hard Constraints

| Area | Decision |
|---|---|
| Framework | Next.js (**App Router**) |
| Language | **TypeScript** (strict mode) |
| Database | **PostgreSQL** |
| ORM | **Drizzle ORM** — *already set up, do not re-init or change config* |
| Client data | **TanStack Query** |
| Validation | **Zod** (shared between client & server) |
| Lint + Format | **Biome** (replaces ESLint + Prettier — do not install those) |
| Auth | **None**. Do not add login, sessions, or middleware guards |
| UI source | `public/` folder (read-only reference — see §8) |

**Do NOT:**
- Re-install / re-configure Drizzle, or rewrite existing `db` client or migrations setup
- Put DB queries inside components, pages, or actions directly
- Use `any`, `@ts-ignore`, or non-null `!` to silence errors
- Add authentication, user accounts, or NextAuth
- Install or configure ESLint / Prettier (Biome only)
- Edit files in `public/` (copy / port, don't mutate) unless fixing a broken asset path

---

## 3. Architecture (Layered)

```
UI (components)  →  Query hooks  →  Server Actions  →  Services  →  Repositories  →  Drizzle/DB
```

Each layer has **one responsibility** and only talks to the layer directly below it.

### Folder structure

```
src/
├─ app/                          # Routes only (thin)
│  ├─ layout.tsx
│  ├─ page.tsx                   # Landing / start
│  ├─ quiz/page.tsx              # Question flow
│  ├─ result/[id]/page.tsx       # Result page
│  └─ providers.tsx              # QueryClientProvider (client)
│
├─ features/
│  └─ quiz/
│     ├─ actions/                # "use server" — entry points
│     │  ├─ get-questions.action.ts
│     │  └─ submit-quiz.action.ts
│     ├─ services/               # Business logic (scoring, orchestration)
│     │  └─ quiz.service.ts
│     ├─ repositories/           # DB access only (Drizzle)
│     │  ├─ question.repository.ts
│     │  └─ submission.repository.ts
│     ├─ schemas/                # Zod schemas + inferred types
│     │  └─ quiz.schema.ts
│     ├─ types/                  # Shared TS types / DTOs
│     │  └─ quiz.types.ts
│     ├─ hooks/                  # TanStack Query hooks
│     │  ├─ use-questions.ts
│     │  └─ use-submit-quiz.ts
│     ├─ components/             # Feature UI (ported from public/)
│     │  ├─ question-card.tsx
│     │  ├─ progress-bar.tsx
│     │  ├─ quiz-form.tsx
│     │  └─ result-view.tsx
│     ├─ constants/
│     │  └─ query-keys.ts
│     └─ utils/                  # Pure helpers (no I/O)
│
├─ components/ui/                # Generic reusable UI (button, card, ...)
├─ db/                           # ALREADY EXISTS — schema, client, migrations
│  ├─ index.ts
│  └─ schema/
├─ lib/
│  ├─ query-client.ts            # QueryClient factory
│  ├─ action-result.ts           # ActionResult<T> helper type
│  └─ errors.ts                  # AppError classes
└─ styles/
```

> If a folder already exists with a different convention, **follow the existing one** and keep the same layering.

---

## 4. Layer Rules

### 4.1 Repository (`*.repository.ts`)
- **Only** place that imports `db` and Drizzle tables.
- Pure data access: `findAll`, `findById`, `create`, etc.
- No business logic, no Zod parsing, no `"use server"`.
- Return typed rows (`InferSelectModel`) or mapped domain types.
- Wrap multi-step writes in `db.transaction(...)`.

```ts
// question.repository.ts
import { db } from "@/db";
import { questions } from "@/db/schema";

export const questionRepository = {
  async findAllWithOptions() {
    return db.query.questions.findMany({
      with: { options: true },
      orderBy: (q, { asc }) => asc(q.order),
    });
  },
};
```

### 4.2 Service (`*.service.ts`)
- Business logic: **score calculation**, validation of answer ↔ question consistency, orchestration of repositories.
- Does **not** know about HTTP, `FormData`, or React.
- Throws typed `AppError` on rule violations.
- Calculation logic must be a **pure function** in `utils/` (easy to unit test), called by the service.

### 4.3 Server Action (`*.action.ts`)
- File starts with `"use server"`.
- Responsibilities: **parse input with Zod → call service → return `ActionResult<T>`**.
- Never throw raw errors to the client; catch and return `{ ok: false, error }`.
- No DB access, no business logic.

```ts
"use server";
import { submitQuizSchema } from "../schemas/quiz.schema";
import { quizService } from "../services/quiz.service";
import type { ActionResult } from "@/lib/action-result";

export async function submitQuizAction(
  input: unknown
): Promise<ActionResult<{ submissionId: string }>> {
  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Invalid answers" } };
  }
  try {
    const data = await quizService.submit(parsed.data);
    return { ok: true, data };
  } catch (e) {
    return toActionError(e);
  }
}
```

### 4.4 Query hooks (`hooks/`)
- Only place that uses `useQuery` / `useMutation`.
- Call server actions inside `queryFn` / `mutationFn`; **unwrap `ActionResult`** and throw on `ok: false` so TanStack Query handles error state.
- Query keys come from `constants/query-keys.ts` (key factory), never inline strings.

### 4.5 Components
- Presentational by default; get data via hooks.
- Add `"use client"` **only** where needed (state, hooks, events). Keep pages/layouts as Server Components.
- One component per file, named export, props typed with an explicit `interface`/`type`.

---

## 5. Data Model (adapt to the existing Drizzle schema)

Check `src/db/schema` first. **Reuse existing tables.** If something is missing, add a new schema file and generate a migration — don't edit unrelated tables.

Suggested shape:

| Table | Key columns |
|---|---|
| `questions` | `id`, `text`, `order` (1–4) |
| `options` | `id`, `questionId` (FK), `label`, `value`/`score` |
| `submissions` | `id` (uuid), `totalScore`, `resultKey`, `createdAt` |
| `submission_answers` | `id`, `submissionId` (FK), `questionId` (FK), `optionId` (FK) |

Rules:
- Use `uuid` (or nanoid) for `submissions.id` — it is used in the public result URL, so it must **not be guessable/sequential**.
- Add indexes on foreign keys.
- Use `$inferSelect` / `$inferInsert` for types; do not hand-write duplicates.
- Migrations: `drizzle-kit generate` then `migrate`. Never edit generated SQL by hand unless required.

> **Open point:** the scoring formula (sum? weighted? category tally?) is defined by the product owner. If not documented, **ask** — do not invent one. Keep it isolated in `utils/calculate-result.ts` so it's easy to change.

---

## 6. Flow

1. `GET /quiz` → `useQuestions()` → `getQuestionsAction()` → `quizService.getQuestions()` → repository
2. User answers all **4** questions (client state only; no DB writes until submit)
3. Submit → `useSubmitQuiz()` → `submitQuizAction()` → `quizService.submit()`:
   - validate: exactly 4 answers, one per question, option belongs to question
   - calculate result (pure util)
   - persist submission + answers in a **transaction**
   - return `submissionId`
4. Redirect to `/result/[id]` → server-render result by id (fetch via service in a Server Component, or `useQuery` if the UI requires it)

Edge cases to handle:
- Missing / duplicate / foreign answers → validation error
- Unknown submission id → `notFound()`
- Double-click submit → disable button while `isPending`
- Page refresh mid-quiz → acceptable to restart (or persist in `sessionStorage` only if the UI design asks for it)

---

## 7. TanStack Query Setup

- `lib/query-client.ts`: `makeQueryClient()` with sensible defaults (e.g. `staleTime: 60_000`, `retry: 1`, `refetchOnWindowFocus: false`).
- `app/providers.tsx` (`"use client"`): create the client with `useState` (browser singleton, new per request on server).
- Questions are near-static → long `staleTime`; optionally **prefetch on the server** with `HydrationBoundary` + `dehydrate` for a faster first paint.
- Query key factory:

```ts
export const quizKeys = {
  all: ["quiz"] as const,
  questions: () => [...quizKeys.all, "questions"] as const,
  result: (id: string) => [...quizKeys.all, "result", id] as const,
};
```

- Always handle `isPending`, `isError`, and empty states in the UI (skeleton + retry button).

---

## 8. UI: Porting from `public/`

The UI is already designed and stored in `public/`.

**Step-by-step:**
1. **Inventory** `public/` — list every page/screen, CSS, JS, image, font. Write a short mapping (screen → route → component) in your plan before coding.
2. **Port, don't embed.** Convert HTML into React components (`className`, self-closing tags, camelCase attrs). Do **not** `dangerouslySetInnerHTML` raw files or `<iframe>` them.
3. **Styles:** keep the existing visual design pixel-faithful. Either
   - import the existing CSS globally / as CSS Modules, or
   - translate to the project's styling system if one is already installed (don't add a new one without need).
4. **Assets:** reference via root paths (`/images/logo.svg`), use `next/image` for images and `next/font` for fonts when possible.
5. **Reference photos / images with a black background** — see §8.1.
6. **Behavior in old JS** (step navigation, progress, validation) → reimplement as React state/hooks. Remove the legacy script once ported.
7. Keep class names / structure close to the original so design diffs stay easy to review.

### 8.1 Images with black backgrounds

Some reference photos/images in `public/` come with a **solid black background**. Remove it so they sit cleanly on the app's real background.

- Convert the black background to **transparent** and export as **PNG or WebP (with alpha)**. Don't leave baked-in black.
- **Keep originals untouched** in a backup folder outside `public/` (e.g. `design-src/originals/`) so nothing is lost. Never ship the originals.
- Do it with a repeatable script (e.g. `scripts/remove-black-bg.ts` using `sharp`, or ImageMagick `-fuzz 8% -transparent black`) rather than by hand. Tune the fuzz/threshold so dark parts of the subject (shadows, hair, dark edges) are **not** eaten; check edges for black halos.
- If the subject itself is black/dark and a threshold would damage it, flag it and ask for a source file with a real alpha channel instead of guessing.
- Inspect the results on both a light and a dark page background before finishing.
- Optimise output (WebP/AVIF where supported), set explicit `width`/`height`, use `next/image`, and add meaningful `alt` text (or `alt=""` if purely decorative).
- Pure reference screenshots (design mockups, not used in the final UI) must **not** be rendered in the app — use them only to match the layout.

---

## 9. Responsive Requirements

- **Mobile-first**; verify at **360, 390, 768, 1024, 1440** px.
- No horizontal scroll at any width.
- Touch targets ≥ **44×44px**; options are fully tappable cards/buttons.
- Use `rem`/fluid units, `clamp()` for type scale; `min-h-dvh` instead of `100vh` for full-height screens.
- Respect `prefers-reduced-motion`.
- Accessibility: semantic elements, visible focus, `aria-live` for step/progress/result changes, questions grouped with `fieldset`/`legend` or `role="radiogroup"`, keyboard-operable, sufficient contrast.

---

## 10. TypeScript & Code Quality

- `tsconfig`: `"strict": true` (+ `noUncheckedIndexedAccess` if feasible).
- **Types from a single source of truth:** Drizzle schema → `$inferSelect`; Zod schema → `z.infer`. Don't redeclare.
- Shared result type:

```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string[]> } };
```

- Naming: files `kebab-case`, components `PascalCase`, hooks `useXxx`, actions `xxxAction`.
- Separate files by responsibility; **no file > ~200 lines** without a reason.
- Use the `@/` import alias; avoid deep relative paths.
- Let Biome organize imports; don't hand-sort.

### Biome setup

```bash
pnpm add -D -E @biomejs/biome
pnpm biome init
```

`biome.json` (adjust to the existing file if there is one):

```json
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "includes": ["src/**", "scripts/**", "*.ts", "*.json"] },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "error" },
      "style": { "noNonNullAssertion": "error", "useImportType": "error" },
      "correctness": { "useExhaustiveDependencies": "warn" }
    }
  },
  "assist": { "actions": { "source": { "organizeImports": "on" } } }
}
```

`package.json` scripts:

```json
{
  "lint": "biome lint .",
  "format": "biome format --write .",
  "check": "biome check --write .",
  "typecheck": "tsc --noEmit"
}
```

- Remove `eslint`, `eslint-config-next`, `.eslintrc*`, and Prettier configs if present, and set `eslint: { ignoreDuringBuilds: true }` in `next.config` only if `next build` still tries to lint.
- Don't reformat generated files (Drizzle migrations, `.next`) — exclude them in `biome.json`.
- No dead code, no `console.log` left behind, no commented-out blocks.
- Env vars read **only** in server code via a typed `env.ts` (Zod-validated). Never expose DB credentials to the client.
- **Biome** is the only linter/formatter. Run `biome check --write` before finishing a step.

---

## 11. Error Handling

- Define `AppError` (`code`, `message`, `status`) subclasses: `ValidationError`, `NotFoundError`, `ConflictError`.
- Services throw → actions catch & map to `ActionResult` → hooks convert to thrown errors → UI shows friendly message.
- Add `app/error.tsx`, `app/not-found.tsx`, and `loading.tsx` where relevant.
- Never leak SQL errors or stack traces to the client.

---

## 12. Security Basics (even without auth)

- **Always re-validate on the server** (never trust client-calculated scores — compute the result on the server).
- Validate that option IDs belong to the question IDs submitted.
- Basic abuse protection on submit (simple rate limit by IP, or at least payload size / shape limits) — keep it lightweight.
- No secrets in client bundles.

---

## 13. Testing (minimum)

- **Unit:** `calculate-result` util (all branches / boundary scores).
- **Service:** validation of invalid answer sets.
- Optional: one e2e happy path (open → answer 4 → see result).

---

## 14. Agent Workflow

1. Read `public/` + existing `src/db` + `package.json` + `tsconfig`. **Don't assume — inspect.**
2. Post a short plan: route map, screen → component mapping, schema changes (if any), open questions.
3. Implement in this order:
   1. Schema additions + migration (only if needed) + seed 4 questions/options
   2. Zod schemas + types
   3. Repositories → Services (+ calculate util)
   4. Server actions
   5. Query client, providers, hooks
   6. Port UI components and wire routes
   7. Responsive pass, a11y pass, error/loading/empty states
4. After each step run:
   ```bash
   pnpm typecheck
   pnpm check
   ```
   (use the project's package manager)
5. Finish with `pnpm build` and fix all type/Biome errors.

---

## 15. Definition of Done

- [ ] User can complete the 4 questions and see a result with no login
- [ ] Result is calculated and persisted **server-side**
- [ ] Layers respected: component → hook → action → service → repository → DB
- [ ] No `any`; `tsc --noEmit`, `biome check`, and `build` pass
- [ ] Black backgrounds removed from images in `public/` (transparent PNG/WebP), originals backed up
- [ ] UI matches `public/` design and is responsive (360 → 1440px)
- [ ] Loading, error, empty, and not-found states exist
- [ ] Seed data for the 4 questions available
- [ ] Short README note on how to run migrations/seed/dev

---

## 16. Questions to Ask the Owner (if unanswered)

1. What is the **scoring formula** and the list of possible results (labels, ranges, text)?
2. Single-choice only, or can a question allow multiple answers?
3. Should the result be **shareable via URL** (`/result/[id]`) or shown once and discarded?
4. Should answers be stored in DB, or only the final result?
5. Languages (i18n) needed?
6. Are any images dark/black *by design* (so background removal would damage them)?

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
