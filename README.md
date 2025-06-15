# Premier League Fantasy Football App

A zero-cost, full-stack fantasy football application focused on the English Premier League, built as a student project to demonstrate full-stack development skills, API integration, and deployment using free tools and services.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Folder Structure](#folder-structure)  
- [Environment Variables](#environment-variables)  
- [Running Locally](#running-locally)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Project Overview

This project is a simplified fantasy football app where users can create teams from Premier League players, track fixtures, and see leaderboards. It uses free APIs like Football-Data.org for live data, React/Next.js for the frontend, and Node.js/Express with PostgreSQL for the backend.

The goal is to build a portfolio-worthy project demonstrating:

- Full-stack development  
- API integration and data caching  
- User authentication and authorization  
- Deployment on free hosting platforms  

---

## Features

- User registration and login (JWT-based authentication)  
- Team creation with player selection within a budget  
- Display of upcoming Premier League fixtures  
- Basic scoring system (goals, assists, clean sheets)  
- Leaderboard showing user rankings  
- Responsive UI with Next.js (React framework)  

---

## Tech Stack

| Layer           | Technology                     |
|-----------------|-------------------------------|
| Frontend        | Next.js (React), Axios, Styled-Components |
| Backend         | Node.js, Express, PostgreSQL  |
| Authentication  | JWT, bcrypt                   |
| Data Source     | Football-Data.org API          |
| Hosting         | Vercel (frontend), Railway (backend + DB) |

---

## Getting Started

### Prerequisites

- Node.js (v14 or later)  
- npm or yarn  
- PostgreSQL (local or cloud instance)  
- Football-Data.org API key (free tier)  

---

## Folder Structure

premier-league-fantasy/
├── backend/ # Express backend API
│ ├── server.js # Main server entry point
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── config/ # Configuration (DB, env)
│ └── package.json # Backend dependencies
│
├── frontend/ # Next.js frontend app
│ ├── pages/ # React pages and routes
│ ├── components/ # Reusable UI components
│ ├── styles/ # CSS/Styled-components
│ └── package.json # Frontend dependencies
│
└── README.md # Project documentation


---

## Environment Variables

Create `.env` files in both `backend` and `frontend-next` directories with these variables:

### Backend `.env`

PORT=3000
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret_key
FOOTBALL_DATA_API_KEY=your_football_data_api_key

### Frontend `.env.local`

NEXT_PUBLIC_API_URL=http://localhost:3000/api


*Note:* Never commit `.env` files with real secrets. Use `.env.example` with placeholders instead.

---

## Running Locally

### Backend

cd backend
npm install
npm run dev


Server will run on `http://localhost:3000`

### Frontend

cd frontend-next
npm install
npm run dev


Frontend will run on `http://localhost:3001` (or default Next.js port)

---

## Deployment

- Frontend deployed on [Vercel](https://vercel.com) for seamless Next.js hosting.  
- Backend and PostgreSQL hosted on [Railway](https://railway.app) free tier.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bugs, features, or improvements.

---

## Contact

Ayush Chauhan  
- GitHub: [@AyushChauhan910](https://github.com/AyushChauhan910)  
- Email: your.email@example.com  

---

*Built with ❤️ and passion for football and coding.*


