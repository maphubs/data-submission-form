FROM node:8-alpine as base
LABEL maintainer="Kristofor Carle <kris@maphubs.com>"
ENV NODE_ENV=production

# Install app dependencies
RUN apk add --no-cache wget ca-certificates make gcc g++ python libx11-dev libxext

FROM base AS dependencies

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock .yarnclean /app/
RUN yarn install --production --pure-lockfile && \
    yarn autoclean --force 

# Bundle app source
FROM base AS release 
COPY . /app
COPY --from=dependencies /app/node_modules /app/node_modules
RUN chmod +x /app/docker-entrypoint.sh
EXPOSE 4006
CMD /app/docker-entrypoint.sh