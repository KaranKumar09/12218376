const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs/access.log');
module.exports = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}\n`;
  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Logging failed:", err);
  });
  next();
};
