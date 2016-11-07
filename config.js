config = {
  port: 3000,
  mongoDev: process.env.MONGOURI,
  mongoCollection: 'metrics',
  mongoUsers: 'users',
  mongoCategories: 'categories',
  expressSecret: process.env.EXPRESS_SECRET,
  fbAppId: process.env.FB_APP_ID,
  fbSecret: process.env.FB_SECRET
}

module.exports = config;