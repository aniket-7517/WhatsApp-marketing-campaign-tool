const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  phone: { type: String, required: true },
  name: { type: String },
  sent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Contact', ContactSchema);