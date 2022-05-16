<template>
    <v-container>
        <!-- Overview -->
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Overview</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col cols="3">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
        </v-row>

        <!-- Issues -->
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Issues</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>

        <!-- Models -->
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Models</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
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
export default class AdminHealthDashboard extends Vue {
    // Declared as component data
}
</script>

<style scoped></style>
