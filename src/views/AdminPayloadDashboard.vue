<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Payloads/Inputs</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class AdminPayloadDashboard extends Vue {
    // Declared as component data
}
</script>

<style scoped></style>
