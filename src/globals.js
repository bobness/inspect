const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export { httpsAgent };
