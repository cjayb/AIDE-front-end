<template>
    <v-tab-item>
        <v-card class="px-4 py-4">
            <div class="d-flex mb-4 justify-space-between">
                <div class="text-h5">Roles</div>
            </div>
            <v-card elevation="1">
                <!-- table goes here -->
            </v-card>
        </v-card>
    </v-tab-item>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class UserRolesTabItem extends Vue {}
</script>
