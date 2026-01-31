# Uber Clone Application

## Project Overview

This is a full-stack Uber clone application that connects riders with drivers for seamless transportation services. The application provides a complete ride-hailing experience with real-time tracking, fare calculation, and payment processing.

### What This Uber Clone Does

The application allows users to:
- Register and authenticate as riders or drivers
- Request rides by selecting pickup and destination locations
- Choose from different vehicle types (car, bike, auto)
- View real-time fare estimates
- Track driver location during rides
- View ride history and earnings (for drivers)

### Key Features Implemented

- **User Authentication**: JWT-based authentication for both riders and drivers
- **Real-time Communication**: Socket.io for live ride updates and location tracking
- **Location Services**: Map integration with geocoding, autocomplete, and routing
- **Ride Management**: Complete ride lifecycle from request to completion
- **Fare Calculation**: Dynamic pricing based on distance and time
- **Driver Matching**: Automatic captain assignment based on proximity
- **Earnings Tracking**: Commission-based earnings for drivers
- **Ride History**: Complete transaction history for users and drivers

### Target Users

- **Riders**: Individuals seeking transportation services
- **Drivers (Captains)**: Vehicle owners providing ride services
- **Admin**: Platform management (planned for future)

### High-level System Behavior

1. User registers/logs in and requests a ride
2. System calculates fare and finds nearby available drivers
3. Driver accepts the ride request
4. Real-time tracking begins during the ride
5. Ride completes with payment processing
6. Both parties receive ride confirmation and history updates

## Tech Stack

### Frontend
- **Framework**: React 19.1.0 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with React Leaflet
- **Animations**: GSAP and Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt hashing
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **File Upload**: Multer
- **CORS**: CORS middleware
- **Environment**: Dotenv

### Third-party Services
- **Maps API**: Trueway API (Geocoding, Distance Matrix, Autocomplete)
- **Development**: Nodemon for auto-restart

### Tools & Dev Utilities
- **Version Control**: Git
- **Code Quality**: ESLint
- **Build Tool**: Vite
- **Package Manager**: npm
- **Development Server**: Concurrent backend (port 3000) and frontend (Vite dev server)

## System Architecture

### Overall Architecture
```
Client (React) ↔ API Gateway (Express) ↔ Database (MongoDB)
     ↕️                    ↕️
Socket.io Client ←→ Socket.io Server
```

### Real-time Flow
1. User/Captain connects to Socket.io server
2. Location updates sent via WebSocket
3. Ride events (request, accept, start, finish) broadcasted
4. Live tracking data synchronized

### Authentication & Authorization Flow
1. User registers → Password hashed with bcrypt
2. JWT tokens generated (access + refresh)
3. Tokens stored in HTTP-only cookies
4. Middleware verifies tokens on protected routes
5. Logout blacklists tokens

### Ride Lifecycle Flow
```
Request → Pending → Accepted → Ongoing → Completed
   ↓         ↓         ↓         ↓         ↓
Create   Match     Confirm   Start     Finish
Ride     Captain   Ride      Ride      Ride
```

### ASCII Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │    │   MongoDB       │
│                 │    │                 │    │                 │
│ • User Auth     │◄──►│ • JWT Auth      │◄──►│ • Users         │
│ • Ride Request  │    │ • Ride Logic    │    │ • Captains      │
│ • Live Tracking │    │ • Socket.io     │    │ • Rides         │
│ • Map Display   │    │ • Map Services  │    │ • Blacklist     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     Socket.io Server     │
                    │                          │
                    │ • Real-time Updates      │
                    │ • Location Tracking      │
                    │ • Ride Notifications     │
                    └──────────────────────────┘
```

## Folder Structure

### Backend Folder Breakdown
```
backend/
├── src/
│   ├── app.js              # Express app setup, middleware, routes
│   ├── index.js            # Server entry point, DB connection, socket init
│   ├── socket.js           # Socket.io configuration and event handlers
│   ├── constants.js        # Application constants (DB name)
│   ├── controllers/        # Route handlers
│   │   ├── user.controllers.js     # User auth, profile, history
│   │   ├── captain.controllers.js  # Captain auth, profile, earnings
│   │   ├── map.controllers.js      # Geocoding, distance, autocomplete
│   │   └── ride.controllers.js     # Ride CRUD, lifecycle management
│   ├── models/             # Mongoose schemas
│   │   ├── user.models.js          # User schema with auth fields
│   │   ├── Captain.models.js       # Captain schema with vehicle info
│   │   ├── ride.models.js          # Ride schema with status tracking
│   │   └── blackListToken.models.js # Token blacklist for logout
│   ├── routes/             # Express routers
│   │   ├── auth.routes.js          # User authentication routes
│   │   ├── captain.routes.js       # Captain management routes
│   │   ├── maps.routes.js          # Map service routes
│   │   └── ride.routes.js          # Ride management routes
│   ├── middlewares/        # Custom middleware
│   │   ├── verifyJwt.js            # JWT verification
│   │   ├── roleAuth.js             # Role-based access control
│   │   └── (auth.js - planned)     # Additional auth middleware
│   ├── utils/              # Helper functions
│   │   ├── asyncHandler.js         # Async error wrapper
│   │   ├── ApiError.js             # Custom error class
│   │   ├── ApiRes.js               # API response formatter
│   │   ├── map.js                  # Map utility functions
│   │   └── ride.js                 # Ride calculation utilities
│   ├── db/                 # Database configuration
│   │   └── index.js                # MongoDB connection
│   └── testClient.js       # Socket testing utility
├── package.json            # Dependencies and scripts
├── .gitignore              # Git ignore rules
├── .prettierignore         # Prettier ignore rules
├── .prettierrc             # Prettier configuration
└── Readme.md               # Backend-specific documentation
```

### Frontend Folder Breakdown
```
frontend/
├── src/
│   ├── App.jsx             # Main app component with auth logic
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles
│   ├── App.css             # App-specific styles
│   ├── components/         # Reusable UI components
│   │   ├── AuthLayout.jsx          # Auth wrapper component
│   │   ├── CapLayout.jsx           # Captain layout wrapper
│   │   ├── LocationSearchPanel.jsx # Location input with autocomplete
│   │   ├── VehiclePanel.jsx        # Vehicle selection panel
│   │   ├── ConfirmRide.jsx         # Ride confirmation component
│   │   ├── LookingForDriver.jsx    # Driver search animation
│   │   ├── WaitingForDriver.jsx    # Driver arrival tracking
│   │   ├── LiveTracking.jsx        # Real-time map tracking
│   │   ├── CaptainDetails.jsx      # Captain info display
│   │   ├── ConfirmRidePopUp.jsx    # Ride confirmation popup
│   │   ├── FinishRide.jsx          # Ride completion component
│   │   ├── RidePopUp.jsx           # Ride request popup
│   │   ├── CaptainLiveTracking.jsx # Captain tracking view
│   │   └── useDebounce.jsx         # Debounce hook for search
│   ├── pages/              # Page components
│   │   ├── Home.jsx                # Main ride booking page
│   │   ├── UserLogin.jsx           # User login page
│   │   ├── UserSignUp.jsx          # User registration page
│   │   ├── UserProfile.jsx         # User profile management
│   │   ├── EditProfile.jsx         # Profile editing page
│   │   ├── RideHistory.jsx         # User ride history
│   │   ├── Riding.jsx              # Active ride tracking
│   │   ├── Start.jsx               # App landing page
│   │   ├── CaptainHome.jsx         # Captain dashboard
│   │   ├── CaptainSignIn.jsx       # Captain login page
│   │   ├── CaptainSignup.jsx       # Captain registration
│   │   ├── CaptainProfile.jsx      # Captain profile view
│   │   ├── CaptainEditProfile.jsx  # Captain profile editing
│   │   ├── CaptainRideHistory.jsx  # Captain ride history
│   │   └── CaptainRiding.jsx       # Captain active ride view
│   ├── service/            # API service functions
│   │   ├── authService.jsx         # User authentication API calls
│   │   └── captainService.jsx      # Captain API calls
│   ├── store/              # Redux store configuration
│   │   ├── store.js                # Redux store setup
│   │   ├── authSlice.js            # User authentication state
│   │   ├── captainAuthSlice.js     # Captain authentication state
│   │   └── socketSlice.js          # Socket connection state
│   └── assets/             # Static assets
│       ├── index.js                # Asset exports
│       └── (image files)           # Icons, logos, illustrations
├── public/                 # Public static files
│   └── vite.svg            # Vite logo
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
└── README.md               # Frontend-specific documentation
```

### Key Responsibilities
- **Controllers**: Handle business logic and API responses
- **Models**: Define data structures and database schemas
- **Routes**: Define API endpoints and middleware chains
- **Middlewares**: Authentication, validation, error handling
- **Utils**: Reusable helper functions and utilities
- **Services**: API integration and external service calls
- **Components**: Modular UI building blocks
- **Pages**: Full page components for routing
- **Store**: Global state management with Redux

## Environment Variables

### Backend Environment Variables
| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `PORT` | Server port | Optional | `3000` |
| `MONGODB_URI` | MongoDB connection string | Required | `mongodb://localhost:27017/uber` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Required | `your_access_secret_key` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Required | `your_refresh_secret_key` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | Optional | `1d` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | Optional | `10d` |
| `RAPID_API_KEY` | Trueway API key for geocoding | Required | `your_rapid_api_key` |
| `RAPID_API_KEY_MATRIX` | Trueway API key for distance matrix | Required | `your_rapid_api_key` |
| `RAPID_API_KEY_SUGGESTIONS` | Trueway API key for autocomplete | Required | `your_rapid_api_key` |
| `NODE_ENV` | Environment mode | Optional | `development` |

### Frontend Environment Variables
| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `VITE_BASE_URL` | Backend API base URL | Required | `http://localhost:3000` |

### Example .env Files

**Backend .env**:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/uber
ACCESS_TOKEN_SECRET=your_super_secret_access_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
RAPID_API_KEY=your_trueway_api_key
RAPID_API_KEY_MATRIX=your_trueway_api_key
RAPID_API_KEY_SUGGESTIONS=your_trueway_api_key
NODE_ENV=development
```

**Frontend .env**:
```env
VITE_BASE_URL=http://localhost:3000
```

## API Documentation

### Auth APIs

#### POST /users/register
Register a new user
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```
- **Response**: User object with tokens
- **Auth Required**: No

#### POST /users/login
User login
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**: User object with tokens
- **Auth Required**: No

#### GET /users/profile
Get user profile
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Response**: User profile data
- **Auth Required**: Yes

#### GET /users/logout
User logout
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Response**: Logout confirmation
- **Auth Required**: Yes

### Captain APIs

#### POST /captains/register
Register a new captain
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```
- **Response**: Captain object with tokens
- **Auth Required**: No

#### POST /captains/login
Captain login
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**: Captain object with tokens
- **Auth Required**: No

#### GET /captains/earnings
Get captain earnings
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Response**: Earnings data (today, weekly, monthly, total)
- **Auth Required**: Yes

### Ride APIs

#### POST /rides/create
Create a new ride
- **Method**: POST
- **Headers**: Authorization: Bearer {token}, Content-Type: application/json
- **Body**:
```json
{
  "pickup": "string",
  "destination": "string",
  "vehicleType": "car"
}
```
- **Response**: Ride object
- **Auth Required**: Yes

#### GET /rides/get-fare
Calculate ride fare
- **Method**: GET
- **Query Params**: pickup, destination
- **Headers**: Authorization: Bearer {token}
- **Response**: Fare object for all vehicle types
- **Auth Required**: Yes

#### PUT /rides/confirm
Confirm ride (captain)
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}, Content-Type: application/json
- **Body**:
```json
{
  "rideId": "string"
}
```
- **Response**: Updated ride object
- **Auth Required**: Yes

#### PUT /rides/start
Start ride (captain)
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}, Content-Type: application/json
- **Body**:
```json
{
  "rideId": "string",
  "otp": "string"
}
```
- **Response**: Updated ride object
- **Auth Required**: Yes

#### PUT /rides/finish
Finish ride (captain)
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}, Content-Type: application/json
- **Body**:
```json
{
  "rideId": "string"
}
```
- **Response**: Completed ride object
- **Auth Required**: Yes

### Location/Tracking APIs

#### GET /maps/get-coordinates
Get coordinates for address
- **Method**: GET
- **Query Params**: address
- **Headers**: Authorization: Bearer {token}
- **Response**: Coordinates object
- **Auth Required**: Yes

#### GET /maps/get-distance-time
Get distance and time between locations
- **Method**: GET
- **Query Params**: origin, destination
- **Headers**: Authorization: Bearer {token}
- **Response**: Distance and duration
- **Auth Required**: Yes

#### GET /maps/get-suggestions
Get location autocomplete suggestions
- **Method**: GET
- **Query Params**: input
- **Headers**: Authorization: Bearer {token}
- **Response**: Array of suggestions
- **Auth Required**: Yes

## Database Design

### Database Type
MongoDB with Mongoose ODM

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  refreshToken: String,
  role: String (enum: ["user", "admin"], default: "user"),
  socketId: String,
  rideHistory: [ObjectId] // References to Ride documents
}
```

#### Captains Collection
```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  socketId: String,
  status: String (enum: ["active", "inactive", "banned"], default: "inactive"),
  vehicle: {
    color: String (required),
    plate: String (required),
    capacity: Number (required),
    vehicleType: String (enum: ["car", "bike", "auto"], required)
  },
  location: {
    type: { type: String, enum: ["Point"], required },
    coordinates: [Number] // [longitude, latitude]
  },
  refreshToken: String,
  rideHistory: [ObjectId], // References to Ride documents
  totalEarnings: Number (default: 0),
  todayEarnings: Number (default: 0),
  weeklyEarnings: Number (default: 0),
  monthlyEarnings: Number (default: 0),
  totalCommissionPaid: Number (default: 0)
}
```

#### Rides Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: "User", required),
  captain: ObjectId (ref: "Captain"),
  pickup: String (required),
  destination: String (required),
  fare: Number (required),
  status: String (enum: ["pending", "accepted", "ongoing", "completed", "cancelled"], default: "pending"),
  duration: Number, // in seconds
  distance: Number, // in meters
  paymentID: String,
  orderId: String,
  signature: String,
  otp: String (select: false, required),
  earning: {
    captainShare: Number (default: 0),
    platformCommission: Number (default: 0)
  }
}
```

#### Blacklist Tokens Collection
```javascript
{
  _id: ObjectId,
  token: String (required, unique),
  blacklistedAt: Date (default: Date.now)
}
```

### Relationships
- User ↔ Ride: One-to-Many (user can have multiple rides)
- Captain ↔ Ride: One-to-Many (captain can have multiple rides)
- Ride references both User and Captain

### Indexes
- 2dsphere index on Captain.location for geospatial queries
- Unique indexes on email fields for User and Captain
- Unique index on token for BlackListToken

### Sample Documents

**User Document**:
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "$2a$10$hashedpasswordhere",
  "role": "user",
  "rideHistory": ["64f1a2b3c4d5e6f7g8h9i0j2"]
}
```

**Captain Document**:
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "status": "active",
  "vehicle": {
    "color": "White",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "totalEarnings": 1250.50
}
```

## Authentication & Security

### Auth Method
JWT (JSON Web Tokens) with refresh token rotation

### Token Flow
1. User logs in → Server validates credentials
2. Server generates access token (short-lived) and refresh token (long-lived)
3. Access token sent in Authorization header for API calls
4. Refresh token stored in HTTP-only cookie
5. When access token expires, use refresh token to get new pair
6. On logout, blacklist the current access token

### Password Handling
- Passwords hashed with bcrypt (salt rounds: 10)
- Minimum length: 6 characters
- Stored as hashed strings in database

### Middleware Used
- **verifyJWT**: Validates JWT tokens on protected routes
- **roleAuth**: Role-based access control (user vs captain)
- **express-validator**: Input validation and sanitization
- **cors**: Cross-origin resource sharing configuration
- **cookie-parser**: Parse cookies for token storage

### Role-based Access Control
- **User Role**: Can book rides, view profile, ride history
- **Captain Role**: Can accept rides, update location, view earnings
- **Admin Role**: Planned for future platform management

## Real-time Features

### WebSocket Events

#### Connection Events
- **join**: User/Captain joins socket room
  - Payload: `{ userId: "string", userType: "user"|"captain" }`

#### Ride Events
- **new-ride**: New ride request sent to nearby captains
  - Payload: Ride object with user details
- **ride-confirmed**: Ride accepted by captain
  - Payload: Updated ride object
- **ride-started**: Ride begins with OTP verification
  - Payload: Ride object with OTP
- **ride-finished**: Ride completed
  - Payload: Completed ride object

#### Location Events
- **update-location-captain**: Captain location updates
  - Payload: `{ userId: "string", location: { coordinates: [lng, lat] } }`

### Event Flow
1. User creates ride → Server finds nearby captains → Emits "new-ride"
2. Captain accepts → Server notifies user → Emits "ride-confirmed"
3. Captain starts ride → Server notifies user → Emits "ride-started"
4. Captain finishes ride → Server notifies user → Emits "ride-finished"

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Trueway API keys (for maps functionality)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in backend root:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/uber
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   RAPID_API_KEY=your_trueway_api_key
   RAPID_API_KEY_MATRIX=your_trueway_api_key
   RAPID_API_KEY_SUGGESTIONS=your_trueway_api_key
   ```

4. Start MongoDB service (if local)

5. Run development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in frontend root:
   ```env
   VITE_BASE_URL=http://localhost:3000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Database Setup
1. Ensure MongoDB is running
2. Application will automatically create collections on first use
3. No manual schema migrations required (Mongoose handles schema)

### Running in Development
1. Start backend server (port 3000)
2. Start frontend server (Vite dev server, usually port 5173)
3. Open browser to frontend URL
4. Register as user and captain for testing

### Running in Production
1. Build frontend for production:
   ```bash
   cd frontend && npm run build
   ```

2. Set NODE_ENV=production in backend .env
3. Use process manager like PM2 for backend
4. Serve frontend build files with nginx/Apache
5. Configure HTTPS certificates
6. Set up MongoDB replica set for production

## Scripts

### Backend Scripts
- `npm run dev`: Start development server with nodemon

### Frontend Scripts
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Deployment

### Deployment Readiness
- Environment variables properly configured
- HTTPS enabled for production
- CORS configured for frontend domain
- Database connection secured
- API keys secured in environment variables

### Environment-specific Configs
- **Development**: Local MongoDB, debug logging, CORS for localhost
- **Production**: Cloud MongoDB, error logging, CORS for production domain

### Known Deployment Issues
- Socket.io connection issues with HTTPS (ensure proper SSL configuration)
- CORS errors if frontend/backend domains don't match
- MongoDB connection timeouts in serverless environments
- File upload limits for profile images (multer configuration)

## Limitations & Known Issues

### Incomplete Features
- Payment gateway integration (Razorpay fields present but not fully implemented)
- Admin panel for platform management
- Push notifications for mobile apps
- Multi-language support
- Ride scheduling for future bookings

### Hardcoded Values
- Commission rate hardcoded at 10% in ride completion
- Base fares and per-km rates fixed in ride utilities
- Vehicle types limited to car, bike, auto

### Scalability Concerns
- No caching layer implemented (Redis planned)
- Single MongoDB instance (replica set recommended for production)
- No load balancing for multiple server instances
- Location-based queries may slow down with large captain base

## Future Improvements

### Technical Improvements
- Implement Redis for caching and session management
- Add comprehensive error logging and monitoring
- Implement rate limiting for API endpoints
- Add database indexing for better query performance
- Implement API versioning for backward compatibility

### Feature Enhancements
- Complete payment gateway integration
- Admin dashboard for platform management
- Push notifications for ride updates
- Ride scheduling and booking
- Multi-language support
- Driver rating and review system
- Emergency contact features
- In-app chat between rider and driver

### Performance Optimizations
- Implement pagination for ride history
- Add image compression for profile uploads
- Optimize location queries with geospatial indexing
- Implement background job processing for heavy tasks
- Add CDN for static asset delivery

## License & Author

### Project License
ISC License

### Author
Developed as a full-stack learning project. No specific author attribution in codebase.
