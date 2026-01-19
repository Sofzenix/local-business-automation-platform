import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/update", adminUpdateSubscription);
adminRouter.post("/activate" , isAdmin , activateSubscription);
adminRouter.post("/extend" ,isAdmin , extendSubscriptionController );
adminRouter.post("/suspend" , isAdmin , suspendSubscriptionController);
adminRouter.post("/reactive" , isAdmin , reactiveSubscriptionController);