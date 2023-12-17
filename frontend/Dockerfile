FROM node:18-alpine as node

ENV TERM xterm

RUN adduser -D nodeuser
USER nodeuser

ADD --chown=nodeuser . /opt/app
WORKDIR /opt/app
RUN yarn
RUN yarn build:deployment

FROM nginx:alpine

COPY --from=node /opt/app/dist/frontend /usr/share/nginx/html/fleetmanager
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./startup.sh /docker-entrypoint.d/startup.sh

