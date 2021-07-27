import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        days: "1",
        stats: "execution",
    },
    mutations: {
        setDays(state, days) {
            state.days = days;
        },
        setStats(state, stats) {
            state.stats = stats;
        },
    },
    actions: {},
    modules: {},
});
