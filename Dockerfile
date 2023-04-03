FROM node:18.12
WORKDIR /backend
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn prisma generate
CMD [ "yarn", "ts-node", "src/server.ts" ]
