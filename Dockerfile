FROM node:8-alpine as base
LABEL maintainer="Kristofor Carle <kris@maphubs.com>"
ENV NODE_ENV=production

# Install app dependencies
RUN apk add --no-cache wget ca-certificates libx11-dev libxext && \
    mkdir -p /app

WORKDIR /app

FROM base AS dependencies

# Install build dependencies (not copied to release image)
RUN apk add --no-cache make gcc g++ python 

COPY package.json yarn.lock .yarnclean /app/
RUN yarn install --production --pure-lockfile && \
    yarn autoclean --force 

# Bundle app source
FROM base AS release 
COPY --from=dependencies /app /app
COPY ./components /app/components
COPY ./locales /app/locales
COPY ./pages /app/pages
COPY ./types /app/types
COPY ./utils /app/utils
COPY ./.next /app/.next
COPY .babelrc next.config.js server.js server.es6.js config.js client-config.js i18n.js docker-entrypoint.sh version.json style.less /app/

RUN chmod +x /app/docker-entrypoint.sh && \
    mkdir -p dataform

EXPOSE 4006
CMD /app/docker-entrypoint.sh