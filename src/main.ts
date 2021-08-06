import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import authentication from "@/plugins/authentication";

Vue.config.productionTip = false;

Vue.prototype.$window = window;

Vue.use(authentication);

Vue.filter("formatDate", function (value: any) {
    if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
});

Vue.$keycloak.init({ checkLoginIframe: false }).then(() => {
    new Vue({
        router,
        store,
        vuetify,
        render: (h) => h(App),
    }).$mount("#app");
});
