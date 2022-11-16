<template>
    <router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    metaInfo: {
        title: "Application Repository",
    },
    components: {},
})
export default class AppRepo extends Vue {}
</script>
