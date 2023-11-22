FROM node:18

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN apt-get update -y
RUN apt-get install -y
RUN apt-get install -y pkg-config
RUN apt-get install -y build-essential
RUN apt-get install -y libsecret-1-dev
RUN apt-get install -y libx11-dev
RUN apt-get install -y libxkbfile-dev

COPY package.json /usr/src/app/package.json
RUN yarn install --silent

COPY . /usr/src/app
RUN yarn download:plugins
RUN yarn browser build

EXPOSE 3000

CMD ["yarn", "browser", "start"]
