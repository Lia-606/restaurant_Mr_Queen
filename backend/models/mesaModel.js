const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true },
  capacidad: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['Libre', 'Ocupada', 'Reservada', 'Pendiente de pago', 'Cerrada'], 
    default: 'Libre' 
  },
  ubicacion: { type: String, trim: true }
}, { timestamps: true }); // <- Esto agrega createdAt y updatedAt automáticos

module.exports = mongoose.model('Mesa', mesaSchema);
