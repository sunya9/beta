FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn && yarn run build

EXPOSE 3000

CMD [ "yarn", "start" ]