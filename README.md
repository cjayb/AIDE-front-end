# aide-frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

create a .env file in the projects root directory and add/configure the following

```
VUE_APP_KEYCLOAK_REALM=aide
VUE_APP_KEYCLOAK_CLIENT_ID=aide-app
VUE_APP_KEYCLOAK_ON_LOAD=login-required
VUE_APP_AUTH_ENABLED=false
```

To modify the Backend API host or the Keycloak url, you must update the env-config.js within the public/ directory

```
window.FRONTEND_API_HOST = "http://localhost:5000";
window.KEYCLOAK_URL = "https://localhost:8443/auth";
