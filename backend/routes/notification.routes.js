import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications,deleteNotification } from "../controllers/notification.controller.js";
const notificationRouter = express.Router();

notificationRouter.get("/get",protectRoute,getNotifications);
notificationRouter.delete("/delete",protectRoute,deleteNotifications);
notificationRouter.delete("/:id",protectRoute,deleteNotification);
export default notificationRouter;
