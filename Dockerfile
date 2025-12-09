FROM node:20 AS build
ARG VITE_BACKEND_URL=https://ominous-fortnight-g46p5qg94xrrfvwr9-3001.app.github.dev/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

#Start the SSR Server
CMD ["npm", "start"]