 export class Validacion {  
    static username (username){
      if (typeof username !== "string") throw new Error("Debe ser un texto"); //static no requiere crear una instancia de Validacion
      if (username.length < 3) throw new Error("Debe tener más de 3 caracteres");
  
    }
    static password (password){
      if (typeof password !== "string") throw new Error("Debe ser una cadena de texto");
      if (password.length < 7) throw new Error("Debe tener al menos 7 caracteres");
  
  
    }
  
   }
 