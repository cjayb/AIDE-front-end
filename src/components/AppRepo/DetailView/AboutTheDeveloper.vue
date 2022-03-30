<template>
    <v-row
        ><v-col cols="12"
            ><h2 data-cy="developer-details-title">About The Developer</h2>
            <p data-cy="developer-details">
                {{ application.developer_details }}
            </p></v-col
        ></v-row
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Application } from "@/models/Application";

@Component({
    components: {},
})
export default class AboutTheDeveloper extends Vue {
    @Prop() application!: Application;
}
</script>
