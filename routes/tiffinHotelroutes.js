import { Router } from "express";
import {addMenuItem,toggleMenuAvailability,getTodayMenu, menuShareLink} from "../controllers/tiffinHotelcontroller.js";

const router = Router();

// Add new menu item (Owner)
router.post("/menu", addMenuItem);

// Toggle availability (Owner)
router.patch("/menu/:menuId/toggle", toggleMenuAvailability);

// Get today's menu (Customer)
router.get("/menu/:businessId", getTodayMenu);

// Menu share link
router.get("/menu/share/:businessId", menuShareLink);

export default router;
