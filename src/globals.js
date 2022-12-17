const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export { httpsAgent };
