declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module "!url-loader!*" {
    export default any;
}
