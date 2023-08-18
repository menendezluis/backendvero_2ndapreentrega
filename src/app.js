import express from "express";
import mongoose from "mongoose";
import handlebars, { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as dotenv from "dotenv";
import cartModel from "./dao/models/cart.js";

import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 8080;

//Configuracion para handlebars
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static("public"));

// Configurar la conexión a MongoDB usando las variables de entorno
const MONGO_URI = process.env.MONGO_URI;

let dbConnect = mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbConnect.then(
  () => {
    console.log("Conexión a la base de datos exitosa");
    cartModel
      .findOne({ _id: "64deaede018651e7a53a9597" })
      //.populate("products.product")
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  (error) => {
    console.log("Error en la conexión a la base de datos", error);
  }
);

// Middleware para procesar los datos del formulario y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar las rutas
//app.use('/api/carts', cartRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Ruta de inicio
app.get("/", (req, res) => {
  res.send("Bienvenido a mi e-commerce");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
