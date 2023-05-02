FROM node

WORKDIR /usr/src/app

COPY package*.json .
COPY .env .

RUN npm install
RUN npm install --save @nestjs/sequelize sequelize sequelize-typescript

COPY . .