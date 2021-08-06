declare module "vuetify/lib/framework" {
    import Vuetify from "vuetify";
    export default Vuetify;
}

declare module "vue-json-pretty" {
    function VueJsonPretty(): void;
    export = VueJsonPretty;
}
