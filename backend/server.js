import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';                
import path from 'path';                    
import { fileURLToPath } from 'url';        
import os from "os";

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

// CREAR producto con imagen
app.post('/api/products', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!nombre || !precio || !categoria)
      return res.status(400).json({ error: 'Campos requeridos: nombre, precio, categoria' });

    const imagenUrl = req.file
    ? `http://${localIP}:${PORT}/images/${req.file.filename}`
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

app.listen(PORT, "0.0.0.0", () => {
  console.log("🔥 Servidor corriendo:");
  console.log(`   📍 Local: http://localhost:${PORT}`);
  console.log(`   📱 Red:   http://${localIP}:${PORT}`);
});