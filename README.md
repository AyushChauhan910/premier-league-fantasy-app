# ⚽ Premier League Fantasy

Welcome to **Premier League Fantasy** – a full-stack web application where football fans can create their dream teams, join leagues, compete with friends, and track real-time Premier League stats!

---

## 🚀 Features

- **User Authentication:** Secure registration and login with JWT.
- **Team Management:** Build and manage your fantasy football team.
- **Live Fixtures & Stats:** Real-time Premier League fixtures and player statistics.
- **Leagues:** Create or join leagues, invite friends, and compete on leaderboards.
- **Gameweek Updates:** Automatic updates for each gameweek, including points calculation.
- **Responsive UI:** Modern, mobile-friendly React frontend.

---

## 🏗️ Tech Stack

- **Frontend:** React, Context API, Axios, CSS Modules
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **API Integration:** Premier League data (via custom services)
- **Other:** Rate limiting, logging, and secure middleware

---

## 📦 Project Structure

```
premier-league-fantasy/
  ├── backend/         # Express API, models, controllers, services
  ├── frontend/        # React app (src/components, pages, context, services)
  └── database_schema.sql
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/premier-league-fantasy.git
cd premier-league-fantasy
```

### 2. Setup the Backend

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

**Environment Variables Example (`backend/.env`):**
```
MONGODB_URI=mongodb://localhost:27017/premier-league-fantasy
JWT_SECRET=your_jwt_secret
PORT=3001
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
# Create a .env file with your backend API URL
npm start
```

**Environment Variables Example (`frontend/.env`):**
```
REACT_APP_API_URL=http://localhost:3001
```

---

## 🌟 Usage

1. **Register** a new account or **login**.
2. **Create your team** by selecting players within your budget.
3. **Join or create leagues** to compete with friends.
4. **Set your lineup** each gameweek and track your points.
5. **Climb the leaderboard** and become the ultimate fantasy manager!

---

## 🧩 Key Files & Folders

- `backend/models/` – Mongoose models for users, teams, players, leagues, etc.
- `backend/controllers/` – Express route controllers for business logic.
- `backend/services/` – Data fetching, points calculation, and utility services.
- `frontend/src/pages/` – Main React pages (Dashboard, Teams, Players, etc.)
- `frontend/src/components/` – Reusable UI components (Navbar, Spinner, etc.)
- `frontend/src/services/api.js` – Axios instance for API calls.

---

## 🏆 Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.


---

## 🙌 Acknowledgements

- [Premier League](https://www.premierleague.com/) for inspiration and data.
- [React](https://reactjs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), and all open-source contributors.

---

**Enjoy managing your dream team!**  
*May the best manager win!* 