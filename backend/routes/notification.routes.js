import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getAllNotifications,deleteNotification } from "../controllers/notification.controller.js";
const notificationRouter = express.Router();

notificationRouter.get("/ ",protectRoute,getAllNotifications);
notificationRouter.delete("/",protectRoute,deleteNotifications);
notificationRouter.delete("/:id",protectRoute,deleteNotification);
export default notificationRouter;
