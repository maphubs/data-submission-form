FROM node:12-alpine as builder
LABEL maintainer="Kristofor Carle <kris@maphubs.com>"
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache --upgrade git python make gcc g++
COPY package.json yarn.lock /app/
RUN yarn install --production --pure-lockfile

# Bundle app source
FROM node:12-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app .
COPY . .
EXPOSE 4006
CMD ["node", "/app/server.js"]