FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# run app
FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

# expose the port the app runs on
EXPOSE 3000

CMD ["node", "dist/main.js"]
