### STAGE 1: Build ###
FROM node:18 AS build

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
RUN yarn install --silent

COPY . /usr/src/app
RUN yarn run build


### STAGE 2: NGINX ###
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
