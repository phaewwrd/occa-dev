# Quiz Web-App

A web app where users answer 4 questions and instantly get a calculated result. No login required. Fully responsive on mobile and desktop.

## Links

| Item | Link |
|---|---|
| Website (Production) | |
| Demo video | |

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

1. Click **Start** on the home page
2. Answer all 4 questions, one at a time
3. The app calculates and shows your result
4. Click **Done** to return to the home page. Previous answers are cleared so you can start fresh

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