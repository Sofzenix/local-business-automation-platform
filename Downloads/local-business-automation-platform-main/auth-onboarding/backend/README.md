# Auth & Onboarding Backend Module

## Overview
This module handles user authentication, onboarding, and localization for the Local Business Automation Platform (MERN Stack). It provides secure, OTP-based login, user and business onboarding automation, and supports multilingual (Telugu-first) user experiences.

## Features
- Mobile OTP-based authentication (JWT)
- User onboarding automation
- Auto business ID generation & trial activation
- Language selection and persistence
- Role handling (Owner / Admin)
- Session management
- Security rules (JWT, role-based access)

## Folder Structure
```
backend/
  app.js
  server.js
  config/
    db.js
  controllers/
    authController.js
    businessController.js
    userController.js
  middleware/
    auth.js
  models/
    Business.js
    User.js
  routes/
    authRoutes.js
    businessRoutes.js
    userRoutes.js
  utils/
    otpStore.js
```

## API Endpoints
### Auth
- `POST /api/auth/send-otp` — Send OTP to mobile number
- `POST /api/auth/verify-otp` — Verify OTP and issue JWT

### Business
- `POST /api/business/create` — Create business (protected, onboarding automation)

## How It Works
1. **Send OTP:** User enters mobile number, receives OTP via SMS/WhatsApp.
2. **Verify OTP:** User submits OTP, backend verifies and issues JWT. If first login, user record is created.
3. **Onboarding Automation:** After login, user can create a business. Business ID is auto-generated, and a free trial is activated.
4. **Language Selection:** User's language preference is stored and used for localization.
5. **Session Management:** JWT is used for secure session handling.

## Security
- JWT authentication for all protected routes
- Role-based access control
- Sensitive data is not exposed in responses

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for JWT signing

## Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in `.env` file.
3. Start the server:
   ```bash
   node server.js
   ```

## Notes
- Integrate SMS/WhatsApp API for OTP delivery in production.
- Extend user and business models as needed for additional features.
- Ensure proper error handling and validation in production.

## License
MIT
