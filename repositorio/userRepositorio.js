import { User } from '../models/users.js';
import bcrypt from 'bcrypt';
import { Validacion } from '../validator/userValidator.js';

export class UserRepositorio {
  static async create({ username, password }) {
    Validacion.username(username);
    Validacion.password(password);

    const user = await User.findOne({ username });
    if (user) throw new Error("El usuario ya existe");

    const hashedPass = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPass });
    await newUser.save();
    return newUser;
  }

  static async login({ username, password }) {
    Validacion.username(username);
    Validacion.password(password);

    const user = await User.findOne({ username });
    if (!user) throw new Error("El usuario no existe");

    const esValido = bcrypt.compareSync(password, user.password);
    if (!esValido) throw new Error("El password es incorrecto");

    return user;
  }
}