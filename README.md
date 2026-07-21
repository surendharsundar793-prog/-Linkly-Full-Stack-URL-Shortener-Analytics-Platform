# 🔗 Linkly — Full-Stack URL Shortener & Analytics Platform (Monorepo)

A modern, full-stack web application organized as a clean **Monorepo** (`frontend/` + `backend/`) for shortening, branding, and tracking URLs with real-time click analytics and secure stateless JWT authentication.

---

## 🏗️ Monorepo Structure

```text
url-shortener-platform/
 ├── .gitignore            # Universal root Gitignore (protects node_modules, target, .env, and local properties)
 ├── README.md             # Complete monorepo documentation & setup instructions
 ├── frontend/             # React 19 + Vite Single Page Application (:5173)
 │    ├── package.json
 │    └── src/
 └── backend/              # Spring Boot 3 + Java 21 REST API (:8080)
      ├── pom.xml
      └── src/
```

---

## ✨ Key Features

* **✂️ URL Shortening & Custom Aliases:** Transform long web addresses into concise, shareable short URLs with custom branding (`/createurl`).
* **📊 Click Analytics & Chronological History:** Track performance metrics, click counts, and detailed history (`/analytics`, `/history`).
* **🔐 Stateless Security:** Enterprise-grade JSON Web Token (JWT) registration and authentication (`/login`, `/register`).
* **📧 Tokenized Password Recovery:** Secure recovery workflow via Gmail SMTP with 5-minute expiring UUID tokens (`/forgot-password`, `/reset-password`).
* **📱 Responsive Design System:** Custom vanilla CSS layouts with seamless media breakpoints (`<= 1024px`) and normalized vector illustrations (`#f8fafc`).

---

## 🛠️ Exact Technology Stack

### `frontend/` (`React + Vite`)
* **React 19 (`react`, `react-dom` v19.2.7)**
* **React Router DOM v7 (`react-router-dom` v7.18.1)**
* **Axios (`axios` v1.18.1)** with custom request interceptors for automatic `Bearer <token>` injection
* **Vite (`vite` v8.1.1)** for fast local dev server and bundling
* **Pure Vanilla CSS (`src/styles/*.css`)**

### `backend/` (`Spring Boot + Java`)
* **Java 21**
* **Spring Boot 3/4 (`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-mail`, `spring-boot-starter-validation`)**
* **PostgreSQL (`org.postgresql:postgresql`)** with Hibernate ORM sync (`ddl-auto=update`)
* **JJWT (`io.jsonwebtoken` v0.12.6)** (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
* **Lombok (`org.projectlombok:lombok`)**

---

## 🗺️ Application Routes & Pages

| Route Path | React Component | Access Type | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Landing.jsx` | Public | Homepage / Introduction |
| `/login` | `Login.jsx` | Public | User authentication & JWT generation |
| `/register` | `Register.jsx` | Public | User account creation |
| `/forgot-password`| `ForgotPassword.jsx` | Public | Submit email to receive password reset link |
| `/reset-password` | `ResetPassword.jsx` | Public | Submit new password using email recovery token |
| `/dashboard` | `Dashboard.jsx` | Protected | Main user overview area |
| `/createurl` | `CreateUrl.jsx` | Protected | Form to shorten and customize new links |
| `/history` | `History.jsx` | Protected | View past shortened links and click counts |
| `/analytics` | `Analytics.jsx` | Protected | Detailed tracking charts and metrics |
| `/profile` | `Profile.jsx` | Protected | User account management |

---

## 🚀 Step-by-Step Monorepo Setup Guide

### Step 1: Clone the Monorepo
Open your terminal and clone this repository:
```bash
git clone https://github.com/yourusername/url-shortener-platform.git
cd url-shortener-platform
```

---

### Step 2: Database Setup (`PostgreSQL`)
Open your PostgreSQL terminal (`psql`) or **pgAdmin** and create the required database:
```sql
CREATE DATABASE url_shortner_db;
```

---

### Step 3: Start Spring Boot Backend (`:8080`)
1. Navigate into the `backend/` folder:
   ```bash
   cd backend
   ```
2. Your `src/main/resources/application.properties` uses safe placeholders (`${DB_PASSWORD:admin}`, `${MAIL_PASSWORD:...}`). To test locally with your real credentials, either set environment variables or create a private `src/main/resources/application-local.properties` file:
   ```properties
   # application-local.properties (ignored by git automatically)
   spring.datasource.username=postgres
   spring.datasource.password=admin
   spring.mail.username=your-gmail@gmail.com
   spring.mail.password=your-16-char-app-password
   ```
3. Compile and launch the Spring Boot API:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   ✅ *Backend server runs at **`http://localhost:8080`**.*

---

### Step 4: Start React Frontend (`:5173`)
1. Open a **new terminal window** inside `url-shortener-platform` and navigate into `frontend/`:
   ```bash
   cd frontend
   ```
2. Install packages and launch Vite:
   ```bash
   npm install
   npm run dev
   ```
   ✅ *Frontend application launches at **`http://localhost:5173`**.*

---

## ☁️ Cloud Deployment Instructions (Vercel & Render)

When deploying this Monorepo to live cloud hosting:
* **Vercel (Frontend Deployment):** Import this GitHub repository in Vercel, go to **Project Settings ➡️ Root Directory**, and set it to **`frontend`**.
* **Render (Backend Deployment):** Create a new Web Service from this GitHub repository, set **Root Directory** to **`backend`**, and add your cloud database environment variables (`DB_USERNAME`, `DB_PASSWORD`, `MAIL_PASSWORD`).
