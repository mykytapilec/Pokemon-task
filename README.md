# 📦 Pokémon Collections App

A full-stack application that allows users to create, manage, and export custom Pokémon collections with validation rules.

The project is built as a monorepo with a **NestJS backend**, **React frontend**, and **MongoDB database**.

---

# 🚀 Tech Stack

## Backend

* NestJS (REST API)
* MongoDB + Mongoose
* Class Validator / Class Transformer
* Swagger (API docs)

## Frontend

* React + Vite
* React Query (data fetching/cache)
* Axios
* TypeScript

## External API

* PokeAPI: https://pokeapi.co/

---

# 🧠 Architecture Overview

The system is split into:

```txt
apps/
  backend/   → NestJS API
  frontend/  → React UI
```

### Core concept

* Backend owns business rules & validation
* Frontend handles UI + optimistic updates
* MongoDB stores collections persistently

---

# 📦 Domain Model

## Collection

```ts
{
  _id: string;
  name: string;
  pokemons: Pokemon[];
  totalWeight: number;
}
```

## Pokemon

```ts
{
  id: number;
  name: string;
  weight: number;
  _id: string;
}
```

---

# 📏 Business Rules

Before saving a collection:

## 1. Minimum species rule

At least **3 different Pokémon species**

## 2. Weight limit rule

Total weight must not exceed **1300 hectograms**

If invalid → backend returns validation error.

---

# 🖥️ Features

## 🏠 Home page

* List all collections
* Delete collection
* Import collection from JSON file
* Navigate to create/view pages

---

## ➕ Create collection page

* Browse Pokémon (PokeAPI)
* Select/unselect Pokémon
* Live validation:

  * species count
  * total weight
* Save collection

---

## 📄 Collection details page

* View saved collection
* Rename collection (PATCH)
* Remove Pokémon from collection
* Add Pokémon to existing collection
* Download collection as JSON file

---

## 📤 Export / Import

* Export → downloads JSON file
* Import → uploads JSON and recreates collection

---

# 🔁 API Overview

## Collections

### GET /collections

Get all collections

### GET /collections/:id

Get single collection

### POST /collections

Create collection

### PATCH /collections/:id

Partial collection update:

```ts
{
  name?: string;
  pokemons?: Pokemon[];
}
```

### DELETE /collections/:id

Delete collection

---

## Import / Export

### POST /collections/import

Upload JSON file and create collection

### GET /collections/:id/export

Download collection as JSON

---

# ⚙️ Backend Validation Logic

Validation rules are implemented in:

```txt
collection.validator.ts
```

Rules enforced:

* minimum 3 unique Pokémon species
* max total weight 1300

---

# 🧪 Testing

Backend uses **Jest + Supertest**

Run tests:

```bash
npm run test
```

Includes:

* service unit tests
* controller tests
* validation tests

---

# 🐳 Local Development

## 1. Clone repository

```bash
git clone <repo-url>
cd Pokemon-task
```

---

## 2. Install dependencies

### Backend

```bash
cd apps/backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3. Start MongoDB

Make sure MongoDB is running locally.

Default connection:

```txt
mongodb://localhost:27017
```

---

## 4. Start backend

```bash
cd apps/backend
npm run start:dev
```

Backend runs on:

```txt
http://localhost:3000
```

Swagger docs:

```txt
http://localhost:3000/docs
```

---

## 5. Start frontend

```bash
cd apps/frontend
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 🧩 Design Decisions

## Why NestJS?

* scalable architecture
* dependency injection
* modular structure
* excellent TypeScript support

## Why React Query?

* request caching
* optimistic UI updates
* automatic synchronization
* simplified server state management

## Why MongoDB?

* flexible schema
* simple nested Pokémon storage
* good fit for collections-based data

---

# ⚠️ Notes

## PATCH behavior

Backend supports partial updates:

* rename collection
* replace Pokémon list

Frontend uses optimistic updates for:

* renaming
* adding/removing Pokémon

---

## Validation errors

Example response:

```json
{
  "message": "At least 3 different Pokémon species required",
  "statusCode": 400
}
```

---

# 📌 Possible Improvements

* pagination for Pokémon catalogue
* drag & drop ordering
* authentication system
* Docker Compose setup
* better mobile responsiveness
* advanced collection filters/search

---

# 🏁 Summary

This project demonstrates:

* full-stack TypeScript architecture
* REST API design
* frontend state management with React Query
* backend domain validation
* MongoDB integration
* external API integration (PokeAPI)
* file import/export workflow
* optimistic UI updates
