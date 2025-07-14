const Url = require('../models/url');
const generateCode = require('../utils/generateCode');
const geoip = require('geoip-lite');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }
  let code = shortcode || generateCode();
  if (shortcode && !/^[a-zA-Z0-9]{3,10}$/.test(shortcode)) {
    return res.status(400).json({ error: 'Invalid custom shortcode' });
  }
  const existing = await Url.findOne({ shortcode: code });
  if (existing) {
    if (shortcode) {
      return res.status(409).json({ error: 'Shortcode already in use' });
    } else {
      code = generateCode(); 
    }
  }
  const expiryDate = new Date(Date.now() + validity * 60000);
  const newUrl = new Url({
    originalUrl: url,
    shortcode: code,
    expiryAt: expiryDate,
  });
  await newUrl.save();
  return res.status(201).json({
    shortLink: `${process.env.BASE_URL}/${code}`,
    expiry: expiryDate.toISOString(),
  });
};
exports.redirectToOriginalUrl = async (req, res) => {
  const { code } = req.params;
  const urlEntry = await Url.findOne({ shortcode: code });
  if (!urlEntry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  if (new Date() > urlEntry.expiryAt) {
    return res.status(410).json({ error: 'Link has expired' });
  }
  const location = geoip.lookup(req.ip)?.country || 'Unknown';
  const referrer = req.get('Referrer') || 'Direct';
  urlEntry.clicks.push({ referrer, location });
  await urlEntry.save();
  return res.redirect(urlEntry.originalUrl);
};
exports.getStats = async (req, res) => {
  const { code } = req.params;

  const urlEntry = await Url.findOne({ shortcode: code });
  if (!urlEntry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  return res.json({
    originalUrl: urlEntry.originalUrl,
    createdAt: urlEntry.createdAt,
    expiryAt: urlEntry.expiryAt,
    totalClicks: urlEntry.clicks.length,
    clicks: urlEntry.clicks,
  });
};
