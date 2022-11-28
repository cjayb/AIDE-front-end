import Vue from "vue";

export enum UserRole {
    admin = "admin",
    clinician = "clinician",
    user_management = "user_management",
    deployer = "deployer",
}

export const getDefaultDestinationForUser = () => {
    if (process.env.VUE_APP_AUTH_ENABLED === "false") {
        return "AdminHealthDashboard";
    }

    const noRole = () => false;
    const hasRealmRole = Vue.prototype.$keycloak.hasRealmRole ?? noRole;

    if (hasRealmRole(UserRole.admin)) {
        return "AdminHealthDashboard";
    } else if (hasRealmRole(UserRole.clinician)) {
        return "ClinicalReview";
    } else if (hasRealmRole(UserRole.deployer)) {
        return "ApplicationRepositoryList";
    } else if (hasRealmRole(UserRole.user_management)) {
        return "UserManagement";
    }

    return "Unauthorized";
};
