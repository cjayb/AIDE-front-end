import Vue from "vue";
import Vue2Filters from "vue2-filters";
import App from "@/App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment-timezone";
import numeral from "numeral";
import VueKeycloak from "@dsb-norge/vue-keycloak-js";
import VueToast from "vue-toast-notification";
import "./styles/toast.scss";

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require("./__mocks__/_setup");
    await worker.start();

    worker.printHandlers();
}

Vue.config.productionTip = false;

Vue.prototype.$window = window;

Vue.use(VueToast, {
    position: "bottom-right",
});
Vue.use(Vue2Filters);

Vue.filter("formatDate", function (value: string | number) {
    if (value) {
        return moment.tz(moment.utc(value), "Europe/London").format("DD/MM/YYYY HH:mm");
    }
});

Vue.filter("formatAge", function (value: string | number) {
    if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
    }
});

Vue.filter("formatNumber", function (value: string | number) {
    return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});

Vue.filter("formatFileTitle", function (value: string) {
    return value.replaceAll(/[\W_]+/g, " "); // displaying other groupings/separators is possible, look at the docs
});

Vue.config.errorHandler = (err, vm, info) => {
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.
    console.log(vm);
    console.log(info);
    console.log(err);
    // Vue.$toast.error("Something unexpected went wrong!");
};

const app = new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
});

if (process.env.VUE_APP_AUTH_ENABLED === "true") {
    Vue.use(VueKeycloak, {
        config: {
            url: window.KEYCLOAK_URL,
            realm: process.env.VUE_APP_KEYCLOAK_REALM,
            clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
        },
        onReady: () => {
            app.$mount("#app");
        },
    });
} else {
    if (process.env.NODE_ENV === "development") {
        Vue.prototype.isLocal = true;
        Vue.prototype.localRoles = {
            roles: ["admin", "clinician", "user_management", "deployer"],
        };
    }
    app.$mount("#app");
}
