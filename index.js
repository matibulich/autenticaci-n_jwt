import express from "express";
import path from "path";
import { fileURLToPath } from "url"; //para que funcione el dirname en ES Module
import mongoose from "mongoose";
import { UserRepositorio } from "./user_repositorio.js";
import jwt from "jsonwebtoken"; //permite generar autenticación sin usar sesiones
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.set("view engine", "ejs");

// Necesario para definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/baseUsuarios", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT ?? 3000;


///////////////ENDPOINTS/////////////////////////

app.get("/", (req, res) => {
    const token = req.cookies.access_token;
    const successMessage = req.query.success; // Captura el mensaje de éxito
    if (!token) return res.render("login", { successMessage }); // Pasa el mensaje a la vista
  
    try {
      const data = jwt.verify(token, process.env.SECRET_JWT);
      res.render("login", { data, successMessage }); // Pasa el mensaje a la vista
    } catch (error) {
      res.render("login", { successMessage });
    }
  });
///////////////////////////////////////////////////

app.get("/register", (req, res) => {
  res.render("register");
});

//////////////////////////////////////////////////

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepositorio.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_JWT,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("access_token", token, {
      httpOnly: true, //la cookie solo se accede desde el servior
      maxAge: 1000 * 60 * 60,
    });
    res.redirect("protect");
  } catch (error) {
    res.status(401).send(error.message);
  }
})

///////////////////////////////////////////////////////////

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await UserRepositorio.create({ username, password });
    res.redirect("/?success=Registro%20Correcto");
    console.log("usuario creado correctamente", newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///////////////////////////////////////////////////////////

app.post("/logout", (req, res) => {
    // Eliminar la cookie del token
    res.clearCookie("access_token");
    res.redirect("/");
  });

//////////////////////////////////////////////////////////

app.get("/protect", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send("No autorizado");
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    res.render("protect", data);
  } catch (error) {
    res.status(401).send("No autorizado");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
