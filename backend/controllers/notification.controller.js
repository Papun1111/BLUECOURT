import Notification from "../models/notification.model.js";

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.select(200).json(notifications);
  } catch (error) {
    console.log("Error in getAllNotifications: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    console.log("Error in deleteNotifications: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification=async (req,res) => {
    try {
        const notificationId=req.params.id;
        const userId=req.user._id;
        const notification=await Notification.findById(notificationId);
        if(!notification) return res.status(404).json({message:"Notification not found"});
        if(notification.to.toString()!==userId) return res.status(401).json({message:"Unauthorized"});
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({message:"Notification deleted"});
    } catch (error) {
        console.log("Error in deleteNotification: ",error.message);
        res.status(500).json({error:error.message});
    }
}

export { getAllNotifications, deleteNotifications ,deleteNotification};
