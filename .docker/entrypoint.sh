#!/bin/sh
echo "Running entrypoint file"

echo "Instaling dependeces"
npm install

npm install bcrypt

echo "Starting project"
npm run start:dev