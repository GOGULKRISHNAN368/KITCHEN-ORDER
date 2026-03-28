# 👨‍🍳 Kitchen Order Display System (KDS)

A professional, real-time Kitchen Display System (KDS) designed to streamline kitchen operations. This full-stack application allows front-of-house staff to place orders and back-of-house (kitchen) staff to view, manage, and mark them as completed.

![Kitchen Order Dashboard](https://raw.githubusercontent.com/GOGULKRISHNAN368/KITCHEN-ORDER/main/screenshot.png) *(Note: Add a real screenshot here if available)*

## 🚀 Features

-   **Real-time Order Dashboard**: Orders are displayed in a modern, grid-based card layout.
-   **Live Updates**: Automatic polling every 5 seconds to ensure kitchen staff sees new orders instantly.
-   **Order Lifecycle Management**: Easy status tracking (Pending → Preparing → Completed).
-   **Auto-Cleanup**: Completed orders can be removed to keep the dashboard clutter-free.
-   **Modern UI/UX**: Built with a sleek dark theme, smooth animations (Framer Motion), and responsive design.
-   **Security**: Sensitive database credentials managed via environment variables.

## 🛠️ Technology Stack

### Frontend
-   **React 19** (Vite)
-   **Tailwind CSS 4** (Styling)
-   **Framer Motion** (Animations)
-   **Lucide React** (Icons)
-   **Axios** (API Requests)
-   **React Hot Toast** (Notifications)

### Backend
-   **Node.js & Express**
-   **MongoDB Atlas** (Database)
-   **Mongoose** (ODM)
-   **CORS & Dotenv**

## 📂 Project Structure

```text
KITCHEN-ORDER/
├── frontend/           # React application
│   ├── src/            # Components, styles, and logic
│   └── vite.config.js  # Vite configuration
├── backend/            # Express server
│   ├── models/         # Mongoose schemas (Order)
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
└── README.md           # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
-   Node.js installed
-   MongoDB Atlas account/URI

### 1. Setup Backend
1. Go to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your MongoDB URI:
   ```env
   MONGO_URI=your_mongodb_cluster_uri
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Go to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 API Endpoints

-   `GET /api/orders`: Fetch all current orders.
-   `POST /api/orders`: Place a new order.
-   `PATCH /api/orders/:id`: Update order status.
-   `DELETE /api/orders/:id`: Remove an order.

## 👤 Author

**GOGUL KRISHNAN**
GitHub: [@GOGULKRISHNAN368](https://github.com/GOGULKRISHNAN368)

