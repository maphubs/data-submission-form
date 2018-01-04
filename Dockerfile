FROM node:8-alpine
# Create app directory
RUN mkdir -p /app
WORKDIR /app
# Install app dependencies
COPY package.json yarn.lock .yarnclean /app/
RUN apk add --no-cache make gcc g++ python libx11-dev libxext && \
  yarn install --production --pure-lockfile && \
  yarn clean --force  && \
  apk del make gcc g++ python libx11-dev libxext
# Bundle app source
COPY . /app
RUN yarn run build
EXPOSE 4006
CMD [ "yarn", "start" ]