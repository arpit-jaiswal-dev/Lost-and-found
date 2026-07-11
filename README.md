
# College Lost & Found — A Full-Stack MERN + Cloudinary Experience

Welcome to the College Lost & Found platform! This is a modern web app built with the MERN stack (MongoDB, Express, React, Node.js) and Cloudinary for image storage. It helps students and staff report, search, and recover lost or found items on campus. The project is designed for real-world use, with a focus on clean code, robust authentication, and a smooth user experience.

Deployed : https://lost-and-found-rdjb.onrender.com/

---

## What Does This Project Do?

Lost your headphones on campus? Found someone’s ID card? Use this app to report lost or found items, browse all reports, and connect with the rightful owner or finder. The platform handles user registration, secure login, item reporting (with images via Cloudinary!), and lets users mark items as returned. It’s mobile-friendly, easy to use, and built for real deployment.

---

## How the System Works

- **Frontend:** React (with Tailwind CSS for styling) provides a responsive, single-page experience. Users interact with forms, lists, and dashboards.
- **Backend:** Node.js + Express exposes a REST API, handles authentication (JWT), file uploads (Multer), and talks to MongoDB Atlas for data storage. Images are uploaded to Cloudinary.
- **Database:** MongoDB stores users and item reports, with all the details you’d expect (who reported, what, when, status, etc).
- **Integration:** The React frontend talks to the backend via API calls. In production, the backend serves the React build, so everything is on one domain.

---

## Backend Walkthrough: API Design & Endpoints

- **Entry Point:** `server/server.js` sets up Express, connects to MongoDB, configures CORS, and serves static files in production.
- **Routes:** All API endpoints are under `/api/users` (for authentication) and `/api/items` (for item management).
- **Controllers:** Logic is separated into controller files (`controllers/userController.js`, `controllers/itemController.js`), keeping routes clean.
- **Models:** Mongoose models (`models/userModel.js`, `models/itemModel.js`) define the schema for users and items.
- **Cloudinary Integration:** Images are uploaded to Cloudinary and the returned URL is stored in MongoDB.

### Major Endpoints

- `POST /api/users/register` — Register with your roll number (password is your roll number in uppercase).
- `POST /api/users/login` — Log in and receive a JWT token.
- `POST /api/items` — Report a new lost/found item (with image upload to Cloudinary).
- `GET /api/items` — List all items, with filtering and sorting via query params.
- `GET /api/items/:id` — Get details for a specific item.
- `PUT /api/items/:id/status` — Mark an item as returned.

**Request Handling:**  
Each route uses middleware for authentication (`authMiddleware.js`), validation (`express-validator`), and file uploads (`multer`). Errors are handled gracefully, with clear messages sent to the frontend.

---

## Frontend Walkthrough: React Structure & Logic

The React app lives in `client/src/` and is organized for clarity and reusability:

- **Pages & Components:**  
  - `Login.js`, `Register.js` — Auth forms.
  - `Dashboard.js` — Main user dashboard.
  - `ReportForm.js` — Form to report a lost/found item (handles image upload to Cloudinary).
  - `ItemsList.js` — Shows all reported items, with filters and sorting.
  - `ItemDetail.js` — Detailed view for a single item, including contact info and status updates.
  - `HelpedStats.js` — Stats on how many items have been returned.

- **Routing:**  
  Uses `react-router-dom` for navigation. Auth state is managed in `App.js` and passed down as needed.

- **Styling:**  
  Tailwind CSS is used throughout for a modern, responsive look.

- **API Calls:**  
  All API requests use Axios, and the base URL is set via the `REACT_APP_API_URL` environment variable for easy deployment.

---

## User Experience Flow

1. **Registration & Login:**  
   Users register with their roll number; the default password is their roll number in uppercase. On login, a JWT token is stored in localStorage.

2. **Reporting an Item:**  
   After logging in, users can report a lost or found item. The form collects details and an image, which is uploaded to Cloudinary.

3. **Browsing & Searching:**  
   Users can browse all items, filter by category (lost/found), status (open/returned), and sort by date.

4. **Item Details & Recovery:**  
   Clicking an item shows full details. If you’re the reporter, you can mark it as returned. If you’re a finder, you can contact the owner (if they allowed it).

5. **Status Updates:**  
   When an item is marked as returned, it’s updated in the database and reflected in the UI.

---

## Data Flow: Frontend ↔ Backend

- **Authentication:**  
  On login/register, the backend returns a JWT token. The frontend stores this and sends it in the `Authorization` header for all protected API calls.

- **Item Reporting:**  
  The frontend sends a `multipart/form-data` POST request (with image) to the backend. The backend uploads the image to Cloudinary, saves the image URL and item details, then returns the new item.

- **Fetching Items:**  
  The frontend fetches items with filters/sorting as query params. The backend returns a filtered, sorted list.

- **Status Updates:**  
  PUT requests update item status; the backend checks permissions and updates the DB.

---

## Smart Features & Logic

- **Validation:**  
  Both backend (with `express-validator`) and frontend validate user input, ensuring roll numbers are alphanumeric and of correct length.

- **Search & Filtering:**  
  The backend supports filtering by category/status and sorting by date, all via query params.

- **Image Uploads:**  
  Images are uploaded to Cloudinary for reliable, scalable storage.

- **Authentication:**  
  JWT-based, with middleware to protect all sensitive routes.

- **Reusable Components:**  
  Forms, error messages, and item cards are built as reusable React components.

- **Error Handling:**  
  Consistent error messages are sent from backend to frontend, and displayed clearly to users.

---

## Code Patterns & Design Decisions

- **Controller-Service Pattern:**  
  All business logic is in controllers, keeping routes clean and maintainable.

- **React Hooks:**  
  `useEffect` is used for data fetching, `useState` for local state, and all API calls are wrapped in async functions with error handling.

- **Environment Variables:**  
  API URLs, secrets, and Cloudinary credentials are managed via `.env` files for security and flexibility.

- **Production-Ready:**  
  The backend serves the React build in production, so deployment is simple (one service on Render.com).

- **Thoughtful UX:**  
  The app gives clear feedback for loading, errors, and success states. All actions are protected and validated.

---

## Challenges & Design Choices

- **Seamless Deployment:**  
  Ensuring the frontend and backend work together in both local and production environments. Using environment variables and serving the React build from Express solved this.

- **Image Handling:**  
  Cloudinary integration for image uploads ensures images are always available and not lost on redeploy.

- **Authentication Flow:**  
  Keeping the JWT logic simple but secure, and making sure the frontend always sends the right token, was key for a smooth user experience.

---

## Lessons Learned

Building this project was a great exercise in full-stack development. It reinforced the importance of:

- Keeping code modular and organized (controllers, models, components).
- Handling errors gracefully, both for users and developers.
- Thinking about deployment from the start — not just local dev.
- Using environment variables for all secrets and URLs.
- Writing code that’s easy for others (and your future self) to understand and extend.

---

## 🚀 Getting Started

**Clone the repo:**
```powershell
git clone https://github.com/G26karthik/Lost-and-Found.git
cd Lost-and-Found
```

**Install dependencies:**
```powershell
cd server
npm install
cd ../client
npm install
```

**Set up environment variables:**
- In `server/.env`, add your MongoDB URI, JWT secret, and Cloudinary credentials:
  - `MONGO_URI=your_mongodb_uri`
  - `JWT_SECRET=your_jwt_secret`
  - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
  - `CLOUDINARY_API_KEY=your_api_key`
  - `CLOUDINARY_API_SECRET=your_api_secret`
- In `client/.env`, set `REACT_APP_API_URL` to your backend URL (or leave blank for local):
  - `REACT_APP_API_URL=http://localhost:5000`

**Run locally:**
```powershell
# In one terminal (backend)
cd server
npm run dev

# In another terminal (frontend)
cd ../client
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend/API: [http://localhost:5000](http://localhost:5000)

---

Happy coding! If you want to learn more, just dive into the code — it’s all here and ready for you to explore.
