FROM node:current-alpine

WORKDIR /opt

COPY index.js package.json /opt
COPY data /opt/data

RUN npm i

CMD node index.js

EXPOSE 3001