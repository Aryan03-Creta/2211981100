# 📌 Project Title:
Job Listing Portal (CareerGrid)

## 👨‍💻 Project Overview
CareerGrid is a full-stack job listing platform that connects job seekers and employers.  
It provides a secure and structured hiring system with role-based access control.

A key feature of the platform is an admin-controlled verification system that ensures only trusted employers can post job listings.

---

## 🧩 Key Features

### 👤 Job Seekers
- Browse and search job listings
- Apply to jobs
- Track application status
- Manage profile and resume

### 🏢 Employers
- Create, update, and delete job posts
- View applicants
- Manage job listings
- Access only after admin verification

### 🛡️ Admin Panel
- Verify and approve employers
- Block unverified accounts
- Control job posting permissions
- Monitor platform activity

---

## 🔐 Admin Credentials (Demo Access)
To facilitate the evaluation process, a pre-configured Admin account is provided. This allows reviewers to explore the Employer Verification Workflow and the Admin Dashboard.

- Email: admin@careergrid.com 
- Password: admin123
  
Note: These credentials are provided so that evaluators can verify how the "Admin Firewall" blocks unverified employers from posting jobs until they are approved.

---

## 🛠 Tech Stack
- Frontend: React.js, Vite, Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: MongoDB Atlas  
- Authentication: JWT, Bcrypt.js  
- State Management: Context API  

---

## 📁 Project Structure
- backend/ → Backend API (Node.js + Express)
- frontend/ → Frontend UI (React)
- .gitignore → Ignored files configuration
- README.md → Project documentation
- LICENSE → License file
- .env.example → Environment variables template  

---
## Create .env
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key

## ⚙️ Setup Instructions:
1️⃣ Clone & Navigate:

git clone: https://github.com/Aryan-20-5176/Job-Listing-Portal
```
cd Job-Listing-Portal
```
2️⃣ Backend Initialization:
```
cd backend
npm install
# Ensure .env is configured based on .env.example
npm run dev
```
3️⃣ Frontend Initialization:
```
cd frontend
npm install
npm run dev
```
### 🔐 Environment Setup
Create .env file inside backend using .env.example
```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```
### 🚀 Unique Selling Point (USP):

The Admin Firewall System: Unlike generic job portals, CareerGrid eliminates fake job postings by enforcing a manual verification gate. 
This ensures that every job listed is from a legitimate, admin-approved employer.

### 👨‍💻 Author

Aryan

