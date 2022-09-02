# Base image
FROM node:16.17.0-slim
# Creating a directory inside the base image and defining as the base directory
WORKDIR /app
# Copying the files of the root directory into the base directory
ADD . /app
# Installing the project dependencies
RUN yarn install
RUN npm install pm2 -g
RUN yarn run build
# Starting the pm2 process and keeping the docker container alive
CMD pm2 start ecosystem.config.js && tail -f /dev/null
# Exposing the RestAPI port
EXPOSE 3002