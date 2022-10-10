FROM node:16-alpine as builder

ARG NODE_ENV=test

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn -s

COPY . .
COPY .env.${NODE_ENV} .env

RUN REACT_APP_ENV=${NODE_ENV} yarn build

FROM nginx:1.23-alpine

RUN apk update && apk upgrade

RUN ln -sf /proc/1/fd/1 /var/log/nginx/access.log \
    && ln -sf /proc/1/fd/2 /var/log/nginx/error.log

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
