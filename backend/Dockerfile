FROM node:18-alpine

ENV TERM xterm

RUN adduser -D nodeuser
USER nodeuser

ADD --chown=nodeuser . /opt/app
WORKDIR /opt/app
RUN yarn
RUN yarn build

EXPOSE 3000

ENTRYPOINT yarn start:prod