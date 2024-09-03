const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('Campaign', CampaignSchema);