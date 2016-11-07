config = {
  port: 3000,
  mongoDev: PROCESS.ENV.MONGOURI,
  mongoCollection: 'metrics',
  mongoUsers: 'users',
  mongoCategories: 'categories',
  expressSecret: PROCESS.ENV.EXPRESS_SECRET,
  fbAppId: PROCESS.ENV.FB_APP_ID,
  fbSecret: PROCESS.ENV.FB_SECRET
}

module.exports = config;