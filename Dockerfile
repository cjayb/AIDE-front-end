FROM node:13 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

RUN npm run build

FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY docker_entrypoint.sh ./docker_entrypoint.sh
COPY generate_env_config.sh ./generate_env_config.sh

EXPOSE 443
ENTRYPOINT ["sh", "./docker_entrypoint.sh"]
