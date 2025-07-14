const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/shorturls', urlController.createShortUrl);
router.get('/shorturls/:code', urlController.getStats);
router.get('/:code', urlController.redirectToOriginalUrl);

module.exports = router;
