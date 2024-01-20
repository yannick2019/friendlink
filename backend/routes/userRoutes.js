import express from "express";
import path from "path";
import {
  requestPasswordReset,
  verifyEmail,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  profileViews,
  suggestedFriends
} from "../controllers/userController.js";
import { resetPassword, changePassword } from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";


const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);

router.post("/request-resetpassword", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

// user routes
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// friends request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);
// accept or deny friend request
router.post("/accept-request", userAuth, acceptRequest);

// view profile
router.post("/profile-view", userAuth, profileViews);

// suggested friends
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

export default router;