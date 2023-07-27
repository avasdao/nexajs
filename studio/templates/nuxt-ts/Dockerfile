FROM node:18

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
RUN yarn install --silent

COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
