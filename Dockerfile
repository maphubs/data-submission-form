FROM node:8-alpine
# Create app directory
RUN mkdir -p /app
WORKDIR /app
# Install app dependencies
COPY package.json yarn.lock /app/
RUN yarn install --production --pure-lockfile
# Bundle app source
COPY . /app
RUN yarn run build
EXPOSE 4004
CMD [ "yarn", "start" ]