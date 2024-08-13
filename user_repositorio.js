import mongoose from 'mongoose';
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const User = mongoose.model('Usuario', userSchema);

  //encapsulamiento en una clase estatica, no hace falta instanciarla
  export class UserRepositorio {
    static async create({ username, password }) {

      console.log("Datos recibidos:", { username, password });
        // Validaciones
       Validacion.username(username)
       Validacion.password(password)

        // Aseguramos que el user NO existe
        const user = await User.findOne({ username });
        if (user) throw new Error("El usuario ya existe");

      const hashedPass = bcrypt.hashSync(password,10)

        // Crear un nuevo usuario
        const newUser = new User({ username, password: hashedPass });
        await newUser.save();

        return newUser;
    }

  static async login({username, password}){
    Validacion.username(username)
    Validacion.password(password)

    const user = await User.findOne({username})
    if (!user) throw new Error("El usuario no existe")
      console.log("Usuario encontrado:", user);
    

   const esValido = bcrypt.compareSync(password, user.password)  
   if (!esValido) throw new Error("El password es incorreccto")

    return {
      username: user.username
    }

  }
}

////////////////////////////////////////////
 class Validacion {  
  static username (username){
    if (typeof username !== "string") throw new Error("Debe ser un texto");
    if (username.length < 3) throw new Error("Debe tener más de 3 caracteres");

  }
  static password (password){
    if (typeof password !== "string") throw new Error("Debe ser una cadena de texto");
    if (password.length < 7) throw new Error("Debe tener al menos 7 caracteres");


  }

 }