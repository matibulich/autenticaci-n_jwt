import express from 'express';
import { login, register, logout, protect } from '../controller/userController.js';

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.cookies.access_token;
  const successMessage = req.query.success;
  if (!token) return res.render("login", { successMessage });

  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    res.render("login", { data, successMessage });
  } catch {
    res.render("login", { successMessage });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/protect", protect);

export default router;