FROM node:22.11.0 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/ --global

RUN npm ci

COPY . .

EXPOSE 4300

CMD ["npm", "start"]