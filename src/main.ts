import Vue from "vue";
import Vue2Filters from "vue2-filters";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment-timezone";
import authentication from "@/plugins/authentication";
import VueToast from "vue-toast-notification";
// import "vue-toast-notification/dist/theme-default.css";
import "vue-toast-notification/dist/theme-sugar.css";

Vue.config.productionTip = false;

Vue.prototype.$window = window;

Vue.use(authentication);
Vue.use(VueToast, {
    // One of the options
    position: "bottom-right",
});
Vue.use(Vue2Filters);

Vue.filter("formatDate", function (value: any) {
    if (value) {
        return moment.tz(moment.utc(value), "Europe/London").format("DD/MM/YYYY HH:mm");
    }
});

Vue.filter("formatAge", function (value: any) {
    if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
    }
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

Vue.$keycloak.init({ checkLoginIframe: false }).then(() => {
    new Vue({
        router,
        store,
        vuetify,
        render: (h) => h(App),
    }).$mount("#app");
});
