# 🔗 Linkly — Full-Stack URL Shortener Platform

A modern, full-stack web application for shortening, tracking, and managing URLs with secure JWT authentication and password recovery.

---

## ✨ Key Features

* **✂️ URL Shortening & Custom Aliases:** Shorten long web links and create custom aliases (`/createurl`).
* **📊 Click Analytics & History:** Track link performance and chronological click history (`/analytics`, `/history`).
* **🔐 Secure Authentication:** Stateless JWT login and registration with validation (`/login`, `/register`).
* **📧 Forgot & Reset Password Flow:** Tokenized password recovery via Gmail SMTP (`/forgot-password`, `/reset-password`).
* **👤 User Profile & Dashboard:** Manage account details and view active links (`/profile`, `/dashboard`).
* **📱 Responsive Layout System:** Custom pure CSS layout with responsive media queries (`<= 1024px`).

---

## 🛠️ Exact Technology Stack

### Frontend (`url-shortener`)
* **React 19 (`react`, `react-dom` v19.2.7)**
* **React Router DOM v7 (`react-router-dom` v7.18.1)**
* **Axios (`axios` v1.18.1)** for HTTP API communication
* **Vite (`vite` v8.1.1)** for fast local development and building
* **Pure Vanilla CSS** (`src/styles/*.css`) for styling without external utility libraries

### Backend (`url_shortner` - `com.surendhar`)
* **Java 21**
* **Spring Boot 3/4 (`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-mail`, `spring-boot-starter-validation`)**
* **PostgreSQL (`org.postgresql:postgresql`)** with Hibernate DDL synchronization (`update`)
* **JJWT (`io.jsonwebtoken` v0.12.6)** for generating and validating JSON Web Tokens (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
* **Lombok (`org.projectlombok:lombok`)** to reduce boilerplate code

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

## 🚀 Step-by-Step Setup & Installation Guide

### Prerequisites
Make sure you have the following installed on your machine before getting started:
* **Java Development Kit (JDK):** Version 21 or higher
* **Node.js:** Version 18.x or higher (`npm` included)
* **PostgreSQL:** Version 17 (or compatible 14+)
* **Git:** For cloning repositories

---

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
# Clone the repository (Replace with your actual GitHub repo URL)
git clone https://github.com/yourusername/url-shortener-platform.git

# Navigate into the project directory
cd url-shortener-platform
```

---

### Step 2: Database Setup (`PostgreSQL`)
1. Open PostgreSQL terminal (`psql`) or **pgAdmin**.
2. Create the required database (`url_shortner_db`):
   ```sql
   CREATE DATABASE url_shortner_db;
   ```

---

### Step 3: Backend Setup & Execution (`Spring Boot`)
1. Navigate to the backend directory (`url_shortner`):
   ```bash
   cd url_shortner
   ```
2. Open `src/main/resources/application.properties` and update your PostgreSQL credentials and Gmail SMTP App Password:
   ```properties
   server.port=8080

   # PostgreSQL Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/url_shortner_db
   spring.datasource.username=postgres
   spring.datasource.password=admin
   spring.jpa.hibernate.ddl-auto=update

   # SMTP Configuration (Required for Forgot / Reset Password feature)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-gmail-account@gmail.com
   spring.mail.password=your-16-character-app-password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```
3. Compile and start the Spring Boot server using Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   ✅ *The Java server will start running on **`http://localhost:8080`** and will automatically create all required database tables (`users`, `urls`, etc.).*

---

### Step 4: Frontend Setup & Execution (`React + Vite`)
1. Open a **new terminal window** and navigate to the frontend directory (`url-shortener`):
   ```bash
   cd url-shortener
   ```
2. Install all required Node packages (`react`, `react-router-dom`, `axios`, `vite`):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   ✅ *The React application will launch at **`http://localhost:5173`**.*

---

## 🌐 Verification & Testing
Once both servers are running:
1. Open your web browser and go to **`http://localhost:5173`**.
2. Click **Sign Up** (`/register`) to create a new user account.
3. Log in and create shortened links (`/createurl`), view click charts (`/analytics`), or test the **Forgot Password** workflow! 🎉
