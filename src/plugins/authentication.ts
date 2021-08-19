import Vue from "vue";
import Keycloak from "keycloak-js";

const options = {
    url: window.KEYCLOAK_URL,
    realm: process.env.VUE_APP_KEYCLOAK_REALM,
    clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
    // onLoad: process.env.VUE_APP_KEYCLOAK_ON_LOAD,
};

const _keycloak = Keycloak(options);

const Plugin = {
    install(Vue: any) {
        Vue.$keycloak = _keycloak;
    },
};

Plugin.install = (Vue) => {
    Vue.$keycloak = _keycloak;
    Object.defineProperties(Vue.prototype, {
        $keycloak: {
            get() {
                return _keycloak;
            },
        },
    });
};

Vue.use(Plugin);

export default Plugin;
