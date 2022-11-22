# Table of Contents
- [Project folder structure](#project-folder-structure)
    - [api](#api)
    - [assets](#assets)
    - [components](#components)
    - [models](#models)
    - [plugins](#plugins)
    - [router](#router)
    - [store](#store)
    - [styles](#styles)
    - [utils](#utils)
    - [views](#views)

# Project folder structure
### api
- This folder stores all of the API services required for the AIDE application.
- API requests are made using axios. 

### assets
- Assets folder is used to store the images used throughout the app.

### components
- Components folder contains Vue components that make up the Vue pages. Components are split into separate folders depending on the page they belong to.
- Shared folder within components is used to store reusable components.

### models
- Models are split into separate folders depending on the area of the app they are referenced in.

### plugins
- Used to add plugins to the app, currently holds Vuetify and Keycloak setup files.

### router
- Contains the `index.ts` file responsible for the routing of the application.

### store
- Store folder contains the `index.ts` file with setup for the Vuex store for the application.

### styles
- Currently only contains a file to overwrite the styling of toast notification component.

### utils
- Utils folder holds reusable helper functions such as date or string formatting utils.

### views
- Stores all the pages of the application.
