# Metric Counter
Phone-based tool for tracking metrics. Built using React, Express, Mongo, and C3.js. Login through facebook Oauth process to create and track categories.

![alt tag](http://i.imgur.com/C96MYzR.png)

# Run Locally
* Copy repository

```git clone https://github.com/yujinjcho/Metric-Counter.git```
* Install packages

```npm install```
* Create localConfig.js in root folder
```
localConfig = {
  port: 3000,
  mongoDev: 'mongodb://localhost:27017/metric_counter',
  mongoCollection: 'metrics',
  mongoUsers: 'users',
  mongoCategories: 'categories',
  expressSecret: [SECRET],
  fbAppId: [YOUR APP ID HERE],
  fbSecret: [YOUR APP SECRET HERE]
};

module.exports = localConfig;

```
You will need to create an app through Facebook to obtain the id and secret.



