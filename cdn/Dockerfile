# Initialize Nginx (alpine edition)
FROM nginx:alpine

# Copy all WEB source files
COPY ./src /usr/share/nginx/html

# Copy all STYLESHEET source files
COPY ./css /usr/share/nginx/html/css

# Copy all IMAGE source files
COPY ./img /usr/share/nginx/html/img

# Copy all JAVASCRIPT source files
COPY ./js /usr/share/nginx/html/js

# Copy all SNIPPET source files
COPY ./snippets /usr/share/nginx/html/snippets

# Copy all ARCHIVED source folders
COPY ./archived/. /usr/share/nginx/html
