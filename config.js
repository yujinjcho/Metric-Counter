config = {
  port: process.env.port || 8000,
  mongoDev: process.env.MONGODB_URI,
  mongoCollection: 'metrics',
  mongoUsers: 'users',
  mongoCategories: 'categories',
  expressSecret: process.env.EXPRESS_SECRET,
  fbAppId: process.env.FB_APP_ID,
  fbSecret: process.env.FB_SECRET
}

module.exports = config;