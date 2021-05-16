FROM node:14 as base
WORKDIR /usr/bot
# Copy both package and package-lock.json
COPY package*.json ./
RUN npm i
# Get the bots source code for the Docker image
COPY . .
CMD ["npm", "start"]
