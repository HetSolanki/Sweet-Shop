# 🍬 Sweet Shop Management System

A full-stack sweet inventory and sales management system built using **Next.js (App Router)**, **Prisma ORM**, **ShadCN UI**, and **TypeScript**. This application provides functionality for managing sweets including add, view, purchase, delete, restock, search, and sort operations with robust testing using **Jest**.

---

## 📁 Directory Structure

```
sweet-shop/
├── app/
│   └── api/sweets/        # API route handlers (add, delete, purchase, restock, search)
│   └── inventory/         # Frontend inventory listing page
│   └── globals.css        # Global styles
│   └── layout.tsx         # App layout
│   └── page.tsx           # Homepage
├── components/            # UI components
├── lib/                   # Core business logic and utilities
│   ├── api.ts             # Frontend API wrappers
│   ├── sweetUtils.ts      # Sweet store logic (CRUD operations)
│   ├── prisma.ts          # Prisma client instance
│   └── utils.ts           # Shared helpers
├── prisma/                # Prisma schema and seed
├── public/                # Static files
├── src/                   # source-based organization
├── tests/                 # Jest test suites
│   ├── api/sweets         # API route tests
│   └── prismainit.test.ts # Prisma initialization test
├── types/                 # Type definitions (e.g., sweet, category)
├── .env                   # Environment variables
├── jest.config.ts         # Jest configuration
├── next.config.js         # Next.js config
└── README.md              # Project documentation
```

---

## ⚙️ Tech Stack

| Layer          | Technology                                                |
| -------------- | --------------------------------------------------------- |
| **Frontend**   | Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI |
| **Backend**    | Next.js API Routes (using Route Handlers), TypeScript     |
| **Database**   | SQLite (via Prisma ORM)                                   |
| **Testing**    | Jest (Unit + API Route tests), with TDD approach          |

---

## 🚀 Features

### Sweet Management

- ✅ Add a new sweet
- ✅ View all sweets
- ✅ Update sweet details
- ✅ Delete a sweet
- ✅ Purchase a sweet (decrease stock)
- ✅ Restock a sweet (increase stock)

### Search & Sort

- ✅ Filter sweets by name, category, and price range
- ✅ Sort by name, price, category (asc/desc)

---

## 🔌 API Endpoints

All API routes follow REST conventions and live under `/api/sweets`.

| Method   | Endpoint                   | Description                        | Payload / Query                                         |
| -------- | -------------------------- | ---------------------------------- | ------------------------------------------------------- |
| `POST`   | `/api/sweets/add`          | Add a new sweet                    | `{ name, price, quantity, categoryId }`                 |
| `GET`    | `/api/sweets`              | Get all sweets with filters & sort | `?name=katli&category=Milk&minPrice=10&sort=price_desc` |
| `DELETE` | `/api/sweets/delete/[:id]` | Delete sweet by ID                 | URL param: `id`                                         |
| `POST`   | `/api/sweets/purchase`     | Purchase sweet and reduce stock    | `{ sweetId, quantity }`                                 |
| `PUT`    | `/api/sweets/restock`      | Restock sweet by amount            | `{ sweetId, quantity }`                                 |

---

## ✅ Testing

Run full test suite with:

```bash
npm run test
# or
npx jest --coverage
```

### Test Coverage

- ✅ Unit tests for all API routes (`tests/api/*`)
- ✅ Validation scenarios (missing fields, invalid data)
- ✅ Edge cases: zero stock, invalid categories, negative price/quantity

### Notable Test Files

- `tests/api/sweets/add.test.ts`
- `tests/api/sweets/delete.test.ts`
- `tests/api/sweets/search.test.ts`
- `tests/api/sweets/purchase.test.ts`
- `tests/prismainit.test.ts`

---

## 🧪 Sample Seed Script

To seed the database:
Run:

```bash
npx prisma db seed
```

---

## 🖥️ UI Pages (ShadCN + Tailwind)

- `/`: Home page — display sweets with purchase option
- `/inventory`: Admin view with Add / Edit / Delete buttons
- Dynamic popups for **purchase**, **delete confirmation**, and **toast notifications**

---

## 📦 Scripts

```bash
# Development
npm run dev

# Testing
npm run test
```

---

## 🙌 Author

Developed by **Het Solanki** as part of Incubyte assessment.
