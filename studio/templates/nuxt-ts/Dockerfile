FROM node:16

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
RUN yarn install --silent

# Retrieve arguments from Docker Compose.
ARG PROJECT_ID
ARG PROJECT_NAME
ARG PROJECT_MNEMONIC

# Set environment variables (for build process).
ENV PROJECT_ID ${PROJECT_ID}
ENV PROJECT_NAME ${PROJECT_NAME}
ENV PROJECT_MNEMONIC ${PROJECT_MNEMONIC}

COPY . /usr/src/app
RUN yarn run build

# Expose port 3000.
EXPOSE 3000

# Start the Nuxt server.
CMD ["node", ".output/server/index.mjs"]
