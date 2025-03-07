FROM node:23.7.0

WORKDIR /usr/src

COPY package*.json ./
COPY src/ src/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
