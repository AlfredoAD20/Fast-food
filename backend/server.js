import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';                
import path from 'path';                    
import { fileURLToPath } from 'url';        
import os from "os";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage }); 

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// ----- Modelo -----
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  imagen: String,
  categoria: { type: String, enum: ['burger', 'hotdog'], required: true },
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// ----- Modelo Pedido -----
const orderSchema = new mongoose.Schema({
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// ----- Modelo Usuario -----
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ----- Middleware Auth -----
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer token"

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const [, token] = authHeader.split(' '); // ["Bearer", "xxxxx"]

  if (!token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secreto_cámbiame';
    const decoded = jwt.verify(token, secret); // { id, rol, iat, exp }
    req.user = decoded; // guardamos los datos del usuario en la request
    next(); // sigue a la ruta
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido o expirado' });
  }
}

// ----- Rutas -----
app.get('/', (_, res) => res.send('API FastFood OK'));

// LISTAR
app.get('/api/products', async (req, res) => {
  try {
    const { q, categoria } = req.query;
    const where = {};
    if (categoria) where.categoria = categoria;
    if (q) where.$or = [
      { nombre: { $regex: q, $options: 'i' } },
      { descripcion: { $regex: q, $options: 'i' } },
    ];

    const productos = await Product.find(where).sort({ createdAt: -1 });
    res.json(productos);
  } catch (err) {
    console.error('GET /api/products', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// OBTENER POR ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Crear un pedido
// Crear un pedido (solo usuario autenticado)
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'El pedido no puede estar vacío' });
    }

    const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    const nuevoPedido = new Order({
      productos,
      total,
    });

    const guardado = await nuevoPedido.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error('POST /api/orders', err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});


// Listar pedidos 
app.get('/api/orders', async (req, res) => {
  try {
    const pedidos = await Order.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    console.error('GET /api/orders', err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// CREAR producto con imagen
app.post('/api/products', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!nombre || !precio || !categoria)
      return res.status(400).json({ error: 'Campos requeridos: nombre, precio, categoria' });

    const imagenUrl = req.file
    ? `http://192.168.1.127:3000/images/${req.file.filename}`
    : null;  

    const nuevo = new Product({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen: imagenUrl
    });

    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ACTUALIZAR (PUT)
app.put('/api/products/:id', async (req, res) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido o datos no válidos' });
  }
});

// ELIMINAR (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos: nombre, email y password' });
    }

    // ¿Ya existe ese correo?
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Ese correo ya está registrado' });
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashed
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('POST /api/auth/register', err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Ingresa email y contraseña' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const esValido = await bcrypt.compare(password, user.password);
    if (!esValido) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const secret = process.env.JWT_SECRET || 'super_secreto_cámbiame';
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      secret,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login correcto',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      }
    });
  } catch (err) {
    console.error('POST /api/auth/login', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// 🔍 Detectar IP local automáticamente
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      const isIPv4 = net.family === "IPv4" && !net.internal;
      if (isIPv4) return net.address;
    }
  }
  return "localhost";
}

const localIP = getLocalIP();

app.listen(PORT, () => {
  console.log("🔥 Servidor corriendo:");
  console.log(`   📍 Local: http://localhost:${PORT}`);
  console.log(`   📱 Red:   http://${localIP}:${PORT}`);
});