import { UserRepositorio } from '../repositorio/userRepositorio.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepositorio.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_JWT,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.redirect("/protect");
  } catch (error) {
    res.status(401).send(error.message);
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await UserRepositorio.create({ username, password });
    res.redirect("/?success=Registro%20Correcto");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
};

export const protect = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(403).send("No autorizado");

  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    res.render("protect", data);
  } catch (error) {
    res.status(401).send("No autorizado");
  }
};
