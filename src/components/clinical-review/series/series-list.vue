<template>
    <v-navigation-drawer
        absolute
        temporary
        left
        hide-overlay
        dark
        floating
        :value="displaySeries"
        :stateless="true"
    >
        <v-list></v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    computed: {
        displaySeries(): boolean {
            return this.showSeries;
        },
    },
    props: {
        showSeries: { default: false, type: Boolean },
    },
});
</script>

<style lang="scss" scoped>
.theme--dark.v-navigation-drawer {
    background: none;
}

.v-navigation-drawer--is-mobile,
.v-navigation-drawer--temporary {
    box-shadow: none;
    top: 60px !important;
}
</style>
