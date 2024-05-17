FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

#Variables de entorno
ENV PORT_NODE=3000
ENV TOKEN=a7ab7c13eca9c4d87556998dff78a606
ENV HOST_MYSQL=localhost
ENV USER_MYSQL=root
ENV PASSWORD_MYSQL=root
ENV DATABASE_MYSQL=moodlepadres
ENV PORT=3308

EXPOSE $PORT_NODE

CMD ["node","main.js"]