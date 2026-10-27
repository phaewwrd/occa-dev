# Quiz Web-App

A web app where users answer 4 questions and instantly get a calculated result. No login required. Fully responsive on mobile and desktop.

## Links

| Item | Link |
|---|---|
| Website (Production) | https://ooca-dev.vercel.app/ |
| Demo video | 

https://github.com/user-attachments/assets/b111fefc-0c31-426b-a791-097921f792c8

 |

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Client data fetching | [TanStack Query](https://tanstack.com/query) |
| Validation | [Zod](https://zod.dev/) |
| Lint / Format | [Biome](https://biomejs.dev/) |

### Code Architecture (Layered)

```
Component → Hook (TanStack Query) → Server Action → Service → Repository → Drizzle / PostgreSQL
```

- **Server Action**: receives input, validates it with Zod, then calls the Service
- **Service**: business logic, such as calculating the result
- **Repository**: database access only

---

## How to Use

1. Tap the **next** button on the intro page. This starts a new reflection session
2. Answer each situation. Choosing an option saves it right away and moves on automatically
3. After the last question the app calculates your result and shows it
4. On the result page: **Share** saves the card as an image (native share sheet on mobile, download on desktop), **Home** and **Start over** return to the intro

## Database migrations

Migrations live in `drizzle/`. The first one (`*_baseline`) mirrors the schema that was already pushed to the database, so on an existing database apply only the later migrations, e.g.:

```sql
-- drizzle/*_answers_session_question_unique
CREATE UNIQUE INDEX IF NOT EXISTS "answers_session_question_unique" ON "answers" ("session_id","question_id");
```

On a fresh database run `pnpm drizzle-kit migrate`.

---

## Folder Structure

```
src/
├─ app/                 # Routes (pages)
├─ features/quiz/
│  ├─ actions/          # Server Actions
│  ├─ services/         # Business logic
│  ├─ repositories/     # Database access
│  ├─ schemas/          # Zod schemas
│  ├─ hooks/            # TanStack Query hooks
│  └─ components/       # Feature UI
├─ db/                  # Drizzle schema and client
└─ lib/                 # Shared helpers
public/                 # UI files and images
```

---

## Notes

- No authentication. Anyone can use the app
- The result is calculated on the server only
