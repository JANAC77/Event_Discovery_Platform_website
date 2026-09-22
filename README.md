# EventHub - Event Discovery & Management Platform

A modern, full-stack **Event Discovery & Management Platform** for discovering, searching, filtering, and managing international business conferences, trade shows, exhibitions, and executive summits.

Built with **React**, **Node.js (Express)**, and **MongoDB (Mongoose)** for the Technical Assessment.

---

## 🌟 Key Features

### 1. Event Discovery & Public Portal
- **Hero Showcase**: Interactive banner with live statistics on global business events.
- **Dynamic Event Cards**: Displays banner imagery, status badge (Upcoming, Live Now, Completed, Draft), category tags, industry pills, date range ribbons, venue & city pin, organizer info, and a detail modal trigger.
- **Dual View Modes**: Seamless toggle between **Grid View** and **List View**.

### 2. Search & Multi-Faceted Filtering
- **Real-Time Search**: Search events instantaneously by event name, description, venue, city, or organizer.
- **Category Filter**: Filter by *Conference*, *Exhibition*, *Trade Show*, *Summit*, and *Workshop*.
- **Industry Filter**: Filter across *Technology*, *Healthcare*, *Finance*, *Green Energy*, *Design*, *Cybersecurity*, *Smart Cities*, and *Logistics*.
- **Status Filter**: Filter by *Upcoming*, *Live Now*, *Completed*, or *Draft*.
- **Sorting Options**: Sort by date (Soonest / Latest) or Event Name (A-Z).

### 3. Event Details Experience
- Comprehensive detail modal featuring full-bleed banner, date countdowns, formatted schedule, venue location card, organizer credentials, official website links, share options, and direct admin edit triggers.

### 4. Admin Panel & Full CRUD Operations
- **Dashboard Metrics**: Summary cards tracking Total Events, Upcoming, Live Now, Completed, and Drafts.
- **Data Table**: Filterable and searchable admin data table for easy event management.
- **Create Event**: Full validation modal with preset high-resolution image choices, category/industry selectors, and end date vs start date validation.
- **Update Event**: Pre-filled edit modal allowing live updates.
- **Delete Event**: Safe deletion with a double-check **Confirmation Modal**.
- **Database Seeding**: Single-click "Re-Seed Data" button to restore demo data at any time.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | Node.js, Express.js, CORS, Express-Validator |
| **Database** | MongoDB via Mongoose ORM (supports MongoDB URI or auto In-Memory MongoDB fallback) |
| **Styling** | Glassmorphism design system, custom typography (Plus Jakarta Sans & Inter) |

---

## 📁 Project Structure

```text
Event/
├── Backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection & fallback setup
│   ├── controllers/
│   │   └── eventController.js # CRUD & Search API logic
│   ├── models/
│   │   └── Event.js          # Mongoose Event Schema
│   ├── routes/
│   │   └── eventRoutes.js    # Express REST API routes
│   ├── seed.js               # Standalone database seed script
│   ├── seedData.js           # Sample dataset (10+ realistic events)
│   ├── server.js             # Express server entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx    # Admin CRUD panel
│   │   │   ├── AdminEventModal.jsx   # Create/Edit Form modal
│   │   │   ├── DeleteConfirmModal.jsx# Delete confirmation modal
│   │   │   ├── EventCard.jsx         # Card component
│   │   │   ├── EventDetailsModal.jsx # Detailed view modal
│   │   │   ├── EventFilterBar.jsx    # Search & Filter bar
│   │   │   ├── Navbar.jsx            # Main Navigation
│   │   │   └── ToastNotification.jsx # Feedback toasts
│   │   ├── pages/
│   │   │   └── EventDiscovery.jsx    # Public portal view
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   ├── App.jsx                   # Main layout & router
│   │   ├── index.css                 # Glassmorphic Tailwind styles
│   │   └── main.jsx                  # React DOM mount
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md                         # Assessment Documentation
```

---

## 🛢️ Database Design & Schema

The MongoDB `Event` schema (`Backend/models/Event.js`) contains all fields requested in the specification:

```javascript
{
  id: String,           // Virtual string representation of _id
  name: String,         // Event title (required)
  description: String,  // Detailed summary (required)
  category: String,     // Conference, Exhibition, Trade Show, etc.
  industry: String,     // Technology, Healthcare, Finance, etc.
  startDate: Date,      // Event start timestamp (required)
  endDate: Date,        // Event end timestamp (required)
  venue: String,        // Venue / Hall name (required)
  city: String,         // City location (required)
  country: String,      // Country location (required)
  organizer: String,    // Host organization name (required)
  website: String,      // Official URL
  image: String,        // High-res banner image URL
  status: String,       // Enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'DRAFT']
  createdAt: Date,      // Auto timestamp
  updatedAt: Date       // Auto timestamp
}
```

---

## 🔌 API Documentation

Base Endpoint: `http://localhost:5000/api/events`

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Get events with filters | `q`, `category`, `industry`, `status`, `city`, `sortBy` |
| `GET` | `/api/events/:id` | Get event by ID | `id` parameter |
| `POST` | `/api/events` | Create a new event | Event JSON payload (with field validations) |
| `PUT` | `/api/events/:id` | Update an existing event | Updated Event fields |
| `DELETE` | `/api/events/:id` | Delete an event | `id` parameter |
| `POST` | `/api/events/seed` | Seed/reset sample data | None |

### Sample Payload (`POST /api/events`)

```json
{
  "name": "Global Green Energy Summit 2026",
  "description": "Exhibition on solar innovations, hydrogen power, and smart grid technology.",
  "category": "Exhibition",
  "industry": "Green Energy",
  "startDate": "2026-11-15T09:00:00.000Z",
  "endDate": "2026-11-18T18:00:00.000Z",
  "venue": "Messe Frankfurt Center",
  "city": "Frankfurt",
  "country": "Germany",
  "organizer": "Clean Energy Expo Group",
  "website": "https://greenenergyexpo.de",
  "image": "https://images.unsplash.com/photo-1509391365360-2e959784a276",
  "status": "UPCOMING"
}
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- **Node.js**: v18.x or higher installed
- **NPM**: v9.x or higher installed
- *(Optional)* **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or standard URI. If no local MongoDB server is active, the app automatically boots up an in-memory MongoDB fallback server seamlessly!

### 1. Clone & Install Dependencies

#### Backend Setup
```bash
cd Backend
npm install
```

#### Frontend Setup
```bash
cd ../Frontend
npm install
```

---

### 2. Environment Variables

Create `.env` file inside `Backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_discovery
```

---

### 3. Run Application

#### Step A: Seed & Start Backend API Server
```bash
cd Backend
npm run seed     # Populate database with sample events
npm run dev      # Runs Express server at http://localhost:5000
```

#### Step B: Start Frontend React App
In a new terminal window:
```bash
cd Frontend
npm run dev      # Launches Vite React App at http://localhost:5173
```

Open `http://localhost:5173` in your browser to interact with the platform!

---

## 🤖 AI Tools Used
- **Google DeepMind Antigravity AI Agent**: Architecture planning, full-stack component design, backend API validation, glassmorphism UI styling, and automated verification.

---

## 📌 Known Limitations
- Media upload is currently handled via direct Image URLs or pre-populated Unsplash presets. Future enhancements could integrate AWS S3 or Cloudinary direct file upload.
- Authentication for the Admin Panel is currently simplified for assessment review purposes; production deployment would add JWT / Auth0 role-based authorization.
