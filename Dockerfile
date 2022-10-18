FROM node:14 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

RUN npm run build

FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY docker_entrypoint.sh /app/docker_entrypoint.sh
COPY generate_env_config.sh /app/generate_env_config.sh

EXPOSE 80
ENTRYPOINT ["sh", "/app/docker_entrypoint.sh"]
