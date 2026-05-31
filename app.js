import express from 'express';

// Subscription
import subscriptionRouter from './subscription-admin/subscription/subscription.routes.js';
import adminRouter from './subscription-admin/admin/admin.routes.js';

// Auth
// import authRouter from './auth-onboarding/...';

// Dashboard
// import dashboardRouter from './dashboard-reports/...';

// Medical
// import medicalRouter from './medical-store/...';

// Notification
// import notificationRouter from './notifications/...';

// Tiffin
// import tiffinRouter from './tiffin-hotel/...';

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* ---------------------- ROUTES ---------------------- */

// Subscription Module
app.use('/api/subscription', subscriptionRouter);
app.use('/api/admin', adminRouter);

// Auth Module


// Dashboard Module


// Medical Module


// Notification Module


// Tiffin Module


export default app;