FROM node:18

ENV TZ America/Sao_Paulo
WORKDIR /var/www/dados/
COPY package*.json ./
RUN apt-get update \
    && apt-get upgrade -y 
RUN apt-get install -yq nano
RUN chmod -R 777 /var/www/dados  && chown -R node:node /var/www/dados
COPY --chown=node:node . .
RUN npm install --unsafe-perm
#RUN npm install -g knex
EXPOSE 30000
USER node

CMD [ "npm", "start" ]