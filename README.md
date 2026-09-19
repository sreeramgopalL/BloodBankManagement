# 🩸 Blood Bank Management System

A full-stack, enterprise-grade Blood Bank Management platform built with a **Spring Boot 3 Microservices Backend** and a high-performance **React + Vite Frontend**.

---

## 📁 Project Structure

```
bloodbang/
│
├── frontend/                        # React + Vite Client Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Modals, forms, tables, UI components
│   │   │   ├── contexts/           # AuthContext, DataContext
│   │   │   └── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json                 # Vercel deployment configuration
│   └── vite.config.js
│
├── backend/                         # Spring Boot 3 Microservices
│   ├── .mvn/                       # Maven wrapper configuration
│   ├── api-gateway/                # Spring Cloud Gateway (Port: 9090)
│   ├── auth-service/               # JWT Authentication & RBAC (Port: 8086)
│   ├── donor-camp-service/         # Donors, Camps & Eligibility (Port: 8084)
│   ├── eureka-server/              # Netflix Eureka Service Discovery (Port: 8761)
│   ├── inventory-service/          # Blood Bags, Testing & Storage (Port: 8083)
│   ├── notification-report-service/# Alerts & PDF/Excel Reports (Port: 8085)
│   ├── request-issue-service/      # Hospital Blood Requests & Issues (Port: 8082)
│   ├── mvnw.cmd                    # Windows Maven Wrapper
│   ├── pom.xml                     # Maven Root Parent Aggregator
│   ├── start-backend.bat           # 1-Click script to start all 7 microservices
│   └── stop-backend.bat            # 1-Click script to stop all 7 microservices
│
├── .gitignore                      # Git ignore rules for Maven, Node, and IDEs
├── docker-compose.yml              # Local container orchestration
├── render.yaml                     # Cloud Blueprint for 1-click Render deployment
└── README.md                       # Project documentation
```

---

## 🚀 How It Works When Deployed (Render & Vercel)

### **Will it run automatically when someone opens the link?**
**YES!** 
- **Frontend (Vercel)**: Hosted globally on Vercel's edge network 24/7. When anyone clicks your link, the website opens immediately without any local commands needed.
- **Backend (Render)**: Hosted on Render's cloud servers. The frontend automatically communicates with the Cloud API Gateway URL (`VITE_API_URL`).
- **Sleep & Auto-Wake Behavior (Free Tier)**: On Render's free tier, services spin down after 15 minutes of inactivity to save resources. When a user opens the website, the services **automatically wake up** within ~30–50 seconds on the first request. After that initial wake, everything responds instantly.

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Java JDK 17+**
- **Node.js 18+** & `npm`
- **Oracle Database** (or Oracle XE) running on port 1521
- **MongoDB** (optional, for notifications) running on port 27017

### 2. Start the Backend
Navigate to the `backend/` folder and run the start script:
```powershell
# Double-click backend\start-backend.bat OR run from terminal:
cd backend
.\start-backend.bat
```
This will open 7 console windows in the correct dependency order:
1. **Eureka Server**: `http://localhost:8761`
2. **API Gateway**: `http://localhost:9090`
3. **Auth Service**: `http://localhost:8086`
4. **Donor & Camp Service**: `http://localhost:8084`
5. **Inventory Service**: `http://localhost:8083`
6. **Request & Issue Service**: `http://localhost:8082`
7. **Notification & Report Service**: `http://localhost:8085`

To stop all microservices at once:
```powershell
cd backend
.\stop-backend.bat
```

### 3. Start the Frontend
In another terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ☁️ Step-by-Step Deployment Guide

### Step 1: Push to GitHub
1. Initialize git and commit all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Blood Bank full stack application"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy Backend to Render
1. Sign up / Log in to [Render](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` at the root and configure all 7 microservices!
5. Add any required environment variables (e.g., `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` for your cloud Oracle/PostgreSQL DB).
6. Click **Apply**.
7. Once deployed, copy your **API Gateway** public URL:
   `https://bloodbank-gateway.onrender.com`

---

### Step 3: Deploy Frontend to Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://bloodbank-gateway.onrender.com` *(your Render API Gateway URL)*
6. Click **Deploy**.

Your live URL (e.g., `https://bloodbank.vercel.app`) is now ready and fully connected! 🎉

---

## 🔐 Default Login Credentials
- **Admin**: `admin` / `admin123`
- **Donor**: Registered donor phone number / password
