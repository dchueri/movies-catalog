FROM node:lts

WORKDIR /app

RUN apt-get update && apt-get install npm -y

RUN npm install -g @nestjs/cli

COPY package*.json ./

ARG PORT=3000

ENV PORT=$PORT

EXPOSE $PORT

COPY . .

RUN chmod +x ./.docker/entrypoint.sh

ENTRYPOINT [ "./.docker/entrypoint.sh" ]