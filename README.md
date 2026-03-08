# ✦ Wishlist Pro

> **Capture everything. Miss nothing.**

Wishlist Pro is a refined, minimalist task and desire tracker designed with a premium aesthetic. It combines a powerful Node.js backend with a sleek, responsive frontend to provide a seamless organization experience.

---

## ✨ Features

- **Premium Interface**: A modern dark-themed UI featuring glassmorphism, custom typography (Instrument Serif & DM Sans), and smooth micro-animations.
- **Smart Organization**: 
  - **Priority System**: Categorize items as `High`, `Medium`, or `Low` with distinct visual indicators.
  - **Dynamic Tagging**: Add custom tags to group your wishes.
- **Real-time Interaction**:
  - **Live Search**: Instant filtering by text or tags.
  - **Inline Editing**: Modify your wishes directly in the list.
- **Progress Insights**: Visual progress tracking with a dynamic status bar and real-time stats (Total vs. Done).
- **Efficient Workflow**: Filter by status (Active/Completed), sort by multiple criteria, and batch-clear finished items.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Custom Design System), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Development**: Nodemon for hot reloading, Dotenv for configuration.

---

## 📁 Project Structure

```text
WishTracker/
├── models/          # Mongoose schemas (Item.js)
├── public/          # Frontend assets (index.html, styles, scripts)
├── server.js        # Express server & API routes
├── wishlist.json    # Local data backup/sample
├── package.json     # Dependencies & scripts
└── .env             # Environment configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB instance)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### 4. Running the App
**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Your app will be live at `http://localhost:3000`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Fetch all wishlist items |
| `POST` | `/api/items` | Add a new item |
| `PATCH` | `/api/items/:id` | Update an item (text, priority, or status) |
| `DELETE` | `/api/items/:id` | Remove a single item |
| `DELETE` | `/api/items/completed/all` | Clear all completed items |

---

## 📄 License
This project is licensed under the MIT License (LICENSE).
