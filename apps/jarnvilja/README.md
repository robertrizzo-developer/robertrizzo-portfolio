# Järnvilja Kampsport

![Build Status](https://github.com/robertrizzo/jarnvilja/actions/workflows/ci.yml/badge.svg)

A full-stack web application for a martial arts gym, built with **Spring Boot 3.4**, **Thymeleaf**, and **MySQL/H2/PostgreSQL**. Members can browse training schedules, book classes, and manage their accounts. Admins manage users and bookings. Trainers view their assigned classes and booking statistics. A **Vite + React** client in `frontend/` provides a fast portfolio demo with **mock** or **live** API modes.

## Screenshots

| Homepage | Member Dashboard | Admin Dashboard |
|----------|-----------------|-----------------|
| ![Homepage](docs/screenshots/homepage.png) | ![Member](docs/screenshots/member-dashboard.png) | ![Admin](docs/screenshots/admin-dashboard.png) |

> **Note:** Replace the placeholder images above with actual screenshots. Save them to `docs/screenshots/`.

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.4.3, Spring Security, Spring Data JPA, Hibernate
- **Frontend:** Thymeleaf (server-side rendering), custom CSS (dark theme), vanilla JavaScript; **React** SPA in `frontend/` (portfolio demo)
- **Database:** MySQL 8 (default local) / H2 in-memory (demo profile) / **PostgreSQL** (Docker Compose profile `docker`)
- **Security:** BCrypt password hashing, role-based access control, CSRF protection, session management
- **Testing:** JUnit 5, Mockito
- **Build:** Maven

## Features

- **Role-based access control** -- three distinct roles (Member, Admin, Trainer) with dedicated dashboards
- **Training schedule** -- browse 70+ weekly classes across Thaiboxning, BJJ, Boxning, and Fys
- **Booking system** -- book and cancel training sessions with status tracking (Confirmed, Pending, Cancelled, Expired)
- **Admin dashboard** -- manage users, view bookings, summary statistics
- **Trainer dashboard** -- view assigned classes and booking counts
- **Search and filter** -- search classes by name, filter by day of the week
- **Email notifications** -- booking confirmations and trainer reminders (SMTP)
- **Demo mode** -- pre-seeded accounts with one-click login for portfolio visitors
- **Responsive design** -- mobile-friendly with hamburger menu and collapsible sidebar

## Quick Start

### Option 1: Demo Mode (no MySQL needed)

```bash
git clone https://github.com/robertrizzo/jarnvilja.git
cd jarnvilja
./mvnw spring-boot:run -Dspring.profiles.active=demo
```

Open http://localhost:8080/login and use the demo credentials below.

### Option 2: Docker (PostgreSQL + Spring Boot)

1. Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD` (and optional `POSTGRES_USER`, `POSTGRES_DB`, ports).
2. From the repo root:

```bash
docker compose up --build
```

The API is on http://localhost:8080 (configurable via `APP_PORT`). Hibernate `ddl-auto` defaults to `update` for local schemas (override with `DDL_AUTO` if needed).

### Option 3: With MySQL

1. Create a MySQL database: `CREATE DATABASE jarnviljadb;`
2. Copy `.env.example` to `.env` and fill in your MySQL credentials (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, etc.).
3. Run: `./mvnw spring-boot:run`

### React portfolio client (`frontend/`)

- **Mock mode (no backend):** `cd frontend && cp .env.example .env && VITE_API_MODE=mock npm install && npm run dev`
- **Live mode:** start the Spring app, then `cd frontend && npm install && npm run dev` with `VITE_API_MODE=live` (or unset) and an empty `VITE_API_BASE_URL` so the Vite dev proxy forwards to `VITE_PROXY_TARGET` (default `http://localhost:8080`).
- **Portfolio iframe:** The monorepo portfolio loads the demo in an iframe from **http://localhost:5174** (`VITE_JARNVILJA_URL`). That is the **Vite dev server**, not Spring on 8080—run `npm run dev` in `frontend/` on port **5174** before opening the portfolio’s Järnvilja demo page. Fastest path: mock mode (`.env` from `.env.example` with `VITE_API_MODE=mock`). For a full stack demo, start Spring with `./mvnw spring-boot:run -Dspring.profiles.active=demo` first, then run the frontend in **live** mode.

See [frontend/README.md](frontend/README.md) for CSRF/session notes.

## Demo Credentials

| Role    | Username      | Password |
|---------|---------------|----------|
| Member  | demo          | demo123  |
| Admin   | demo_admin    | demo123  |
| Trainer | demo_trainer  | demo123  |

## Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
└──────────────┬───────────────────────────────┘
               │ HTTP
┌──────────────▼───────────────────────────────┐
│           Spring Security                     │
│   (Authentication, Authorization, CSRF)       │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           Controllers (MVC)                   │
│   NavigationController  (public pages)        │
│   MemberController      (member dashboard)    │
│   AdminController       (admin dashboard)     │
│   TrainerPageController (trainer dashboard)    │
│   BookingController     (REST API)            │
│   TrainerController     (REST API)            │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           Service Layer                       │
│   MemberService, AdminService,                │
│   BookingService, TrainerService,             │
│   EmailService, DemoGuard                     │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           Repository Layer (Spring Data JPA)  │
│   UserRepository, BookingRepository,          │
│   TrainingClassRepository                     │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           Database                            │
│   MySQL / H2 (demo) / PostgreSQL (Docker)     │
│   Tables: users, bookings, training_classes   │
└──────────────────────────────────────────────┘
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /index | Homepage |
| GET | /login | Login page |
| POST | /register | Register new member |
| GET | /memberPage | Member dashboard |
| POST | /memberPage/{id}/bookings | Book a class |
| POST | /memberPage/bookings/{id} | Cancel a booking |
| GET | /adminPage | Admin dashboard |
| GET | /adminPage/editUser/{id} | Edit user form |
| GET | /trainerPage | Trainer dashboard |
| GET | /bookings | List all bookings (API) |
| GET | /trainer/{id}/classes/{classId} | Training class details (API) |
| GET | /memberPage/me | Current member profile (JSON, ROLE_MEMBER) |

## Project Structure

```
src/main/java/com/jarnvilja/
├── config/          # Security, password encoder, mail config
├── controller/      # MVC and REST controllers
├── dto/             # Data transfer objects
├── exception/       # Custom exceptions + global handler
├── model/           # JPA entities (User, Booking, TrainingClass)
├── repository/      # Spring Data JPA repositories
├── seeder/          # Database seed data (demo accounts, classes, bookings)
├── service/         # Business logic layer
└── JarnviljaApplication.java

src/main/resources/
├── templates/           # Thymeleaf HTML templates
│   └── fragments/       # Reusable layout fragments
├── static/
│   ├── styles.css       # Main stylesheet (dark theme)
│   └── js/              # JavaScript modules
└── application*.properties  # Spring profiles (demo/prod/docker)

frontend/                # Vite + React portfolio client (mock/live API)
```

## Skills Demonstrated

- **Spring Security** -- form-based auth, role-based access, CSRF protection, session management
- **JPA/Hibernate** -- entity relationships, custom JPQL queries, indexes, constraints
- **Thymeleaf** -- server-side rendering, fragment reuse, security tag integration
- **REST API design** -- CRUD endpoints, DTOs, proper HTTP status codes
- **Testing** -- unit tests for services and controllers with JUnit 5 + Mockito
- **Database design** -- normalized schema, seed data, H2/MySQL dual support
- **Error handling** -- global `@ControllerAdvice`, custom exceptions, user-friendly error pages
- **Code quality** -- Lombok, SLF4J logging, clean separation of concerns

## License

This project is for portfolio and educational purposes.
