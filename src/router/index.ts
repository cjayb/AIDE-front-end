import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AdminDashboard from "../views/AdminDashboard.vue";
import ClinicalReview from "../views/ClinicalReview.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        redirect: "/admin-dashboard",
    },
    {
        path: "/admin-dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
    },
    {
        path: "/clinical-review/viewer/:study_id",
        name: "ClinicalReviewViewer",
        component: ClinicalReview,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
