const mongoose = require('mongoose');
const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String,
});
const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiryAt: { type: Date },
  clicks: [ClickSchema],
});

module.exports = mongoose.model('Url', UrlSchema);
