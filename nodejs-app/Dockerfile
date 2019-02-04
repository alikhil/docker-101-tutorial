FROM node:8 
# 8-apline

RUN mkdir /app
WORKDIR /app

ADD package.json .
RUN npm install

ADD . .


CMD ["node", "index.js"]