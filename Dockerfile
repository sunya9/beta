FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn && yarn run build

EXPOSE 8080

CMD [ "yarn", "start" ]