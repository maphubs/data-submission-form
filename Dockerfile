FROM node:8-alpine
# Create app directory
RUN mkdir -p /app
WORKDIR /app
# Install app dependencies
COPY package.json yarn.lock .yarnclean /app/
RUN apk add --no-cache wget ca-certificates make gcc g++ python libx11-dev libxext && \
  yarn install --production --pure-lockfile && \
  yarn autoclean --force  && \
  apk del make gcc g++ python libx11-dev libxext
# Bundle app source
COPY . /app
RUN chmod +x /app/docker-entrypoint.sh
EXPOSE 4006
CMD /app/docker-entrypoint.sh