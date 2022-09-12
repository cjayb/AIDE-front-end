import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AdminHealthDashboard from "@/views/AdminHealthDashboard.vue";
import AdminPayloadDashboard from "@/views/AdminPayloadDashboard.vue";
import ClinicalReview from "@/views/ClinicalReview.vue";
import AppRepo from "@/views/AppRepo.vue";
import ListView from "@/components/AppRepo/ListView/ListView.vue";
import DetailView from "@/components/AppRepo/DetailView/DetailView.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import UserManagement from "@/views/UserManagement.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/admin-health-dashboard",
        name: "AdminHealthDashboard",
        component: AdminHealthDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "admin",
        },
    },
    {
        path: "/admin-payload-dashboard",
        name: "AdminPayloadDashboard",
        component: AdminPayloadDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "admin",
        },
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "clinician",
        },
    },
    {
        path: "/clinical-review/viewer/:study_id",
        name: "ClinicalReviewViewer",
        component: ClinicalReview,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "clinician",
        },
    },
    {
        path: "/application-repository",
        component: AppRepo,
        children: [
            {
                path: "",
                name: "ApplicationRepositoryList",
                component: ListView,
                meta: {
                    breadCrumb: [
                        {
                            text: "Application Repository",
                        },
                    ],
                },
            },
            {
                path: ":application_id",
                name: "ApplicationRepositoryDetail",
                component: DetailView,
                meta: {
                    breadCrumb(route: Route) {
                        const application_id = route.params.application_id;
                        return [
                            {
                                text: "Application Repository",
                                to: { name: "ApplicationRepositoryList" },
                            },
                            {
                                text: application_id,
                            },
                        ];
                    },
                },
            },
        ],
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "deployer",
        },
    },
    {
        path: "/user-management",
        name: "UserManagement",
        component: UserManagement,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRole: "admin",
        },
    },
    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: Unauthorized,
    },
    {
        path: "/",
        name: "Home",
        beforeEnter: (to, _, next) => {
            if (process.env.VUE_APP_AUTH_ENABLED !== "true") {
                return next({ name: "AdminHealthDashboard" });
            }

            if (!Vue.$keycloak.authenticated) {
                Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });
            }

            let destination = "Unauthorized";

            if (Vue.$keycloak.hasRealmRole("admin")) {
                destination = "AdminHealthDashboard";
            } else if (Vue.$keycloak.hasRealmRole("clinician")) {
                destination = "ClinicalReview";
            } else if (Vue.$keycloak.hasRealmRole("deployer")) {
                destination = "ApplicationRepositoryList";
            } else {
                return next({ name: "Unauthorized" });
            }

            Vue.$keycloak.updateToken(70).then(() => {
                return next({ name: destination, replace: true });
            });
        },
    },
];

function roleAuthenticatedRoute(to: Route, _: Route, next: NavigationGuardNext<Vue>) {
    const { requiredRole } = to.meta || {};

    if (!requiredRole || process.env.VUE_APP_AUTH_ENABLED !== "true") {
        return next();
    }

    if (!Vue.$keycloak.authenticated) {
        Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });

        return;
    }

    if (Vue.$keycloak.hasResourceRole(requiredRole)) {
        Vue.$keycloak.updateToken(70).then(() => {
            next();
        });
    } else {
        next({ name: "Unauthorized" });
    }
}

const router = new VueRouter({
    routes,
});

export default router;
