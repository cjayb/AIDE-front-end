import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AdminHealthDashboard from "@/views/AdminHealthDashboard.vue";
import AdminDicomConfiguration from "@/views/AdminDicomConfiguration.vue";
import AdminPayloadDashboard from "@/views/AdminPayloadDashboard.vue";
import ClinicalReview from "@/views/ClinicalReview.vue";
import AppRepo from "@/views/AppRepo.vue";
import ListView from "@/components/AppRepo/ListView/ListView.vue";
import DetailView from "@/components/AppRepo/DetailView/DetailView.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import UserManagement from "@/views/UserManagement.vue";
import Workflows from "@/views/Workflows.vue";
import WorkflowEditor from "@/views/WorkflowEditor.vue";
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";

Vue.use(VueRouter);

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const admin = "admin";
const clinician = "clinician";
const user_management = "user_management";
const deployer = "deployer";

export const routes: Array<RouteConfig> = [
    {
        path: "/admin-health-dashboard",
        name: "AdminHealthDashboard",
        component: AdminHealthDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [admin],
        },
    },
    {
        path: "/admin-payload-dashboard",
        name: "AdminPayloadDashboard",
        component: AdminPayloadDashboard,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [admin],
        },
    },
    {
        path: "/admin-export-configuration",
        name: "AdminExportConfiguration",
        component: AdminDicomConfiguration,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [admin],
        },
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [clinician],
        },
    },
    {
        path: "/clinical-review/viewer/:study_id",
        name: "ClinicalReviewViewer",
        component: ClinicalReview,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [clinician],
        },
    },
    {
        path: "/application-repository",
        component: AppRepo,
        name: "ApplicationRepositoryList",
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
            requiredRoles: [deployer],
        },
    },
    {
        path: "/user-management",
        name: "UserManagement",
        component: UserManagement,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [user_management],
        },
    },
    {
        path: "/workflows",
        name: "Workflows",
        component: Workflows,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [admin],
        },
    },
    {
        path: "/workflow-editor/:workflow_id?",
        name: "WorkflowEditor",
        component: WorkflowEditor,
        beforeEnter: roleAuthenticatedRoute,
        meta: {
            requiredRoles: [admin],
        },
    },
    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: Unauthorized,
    },
    {
        path: "/*",
        beforeEnter: async (to, from, next) => {
            if (process.env.VUE_APP_AUTH_ENABLED !== "true") {
                return next({ name: "AdminHealthDashboard" });
            }

            while (!Vue.prototype.$keycloak?.createLoginUrl) {
                await sleep(100);
            }

            if (!Vue.prototype.$keycloak?.authenticated) {
                const login = Vue.prototype.$keycloak.login;

                if (!login) {
                    return;
                }

                login({
                    redirectUri: `${window.location.origin}/#${to.path}`,
                });
            }

            let destination = "Unauthorized";

            const noRole = () => false;
            const hasRealmRole = Vue.prototype.$keycloak.hasRealmRole ?? noRole;

            if (hasRealmRole(admin)) {
                destination = "AdminHealthDashboard";
            } else if (hasRealmRole(clinician)) {
                destination = "ClinicalReview";
            } else if (hasRealmRole(deployer)) {
                destination = "ApplicationRepositoryList";
            }

            Vue.prototype.$keycloak.keycloak.updateToken(70).then(() => {
                const redirect = window.localStorage.getItem("currentPage");

                return next({ name: redirect ?? destination, replace: true });
            });
        },
    },
];

function roleAuthenticatedRoute(to: Route, _: Route, next: NavigationGuardNext<Vue>) {
    const { requiredRoles } = to.meta || {};

    if (process.env.VUE_APP_AUTH_ENABLED !== "true" || !requiredRoles) {
        return next();
    }

    const keycloak: VueKeycloakInstance = Vue.prototype.$keycloak;

    if (!keycloak) {
        return next({ name: "InternalServerError" });
    }

    if (!keycloak?.authenticated && keycloak.login) {
        keycloak.login({ redirectUri: `${window.location.origin}/${to.path}` });

        return;
    }

    const realmAccess = keycloak.tokenParsed?.realm_access;

    if (!realmAccess) {
        return;
    }

    const roles: string[] = realmAccess.roles ?? [];
    const hasRoles = requiredRoles.some((r: string) => roles.includes(r));

    if (!hasRoles) {
        return next({ name: "Unauthorized" });
    }

    keycloak.keycloak?.updateToken(70);
    return next();
}

const router = new VueRouter({
    routes,
    mode: "history",
});

router.afterEach((to) => {
    if (window.location.pathname === "/" || !to.name) {
        return;
    }

    window.localStorage.setItem("currentPage", to.name!);
});

export default router;
