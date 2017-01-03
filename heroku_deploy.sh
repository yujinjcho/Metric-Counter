#!/bin/bash

git checkout -b heroku-deploy
sed -i "/dist/d" .gitignore
webpack
git add .
git commit -m "Heroku Deploy"
git push --force heroku heroku-deploy:master