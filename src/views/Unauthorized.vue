<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="5">
                <v-card color="amber">
                    <v-card-title><v-icon>mdi-alert</v-icon> Warning</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>You are not authorised to visit this page</v-card-text>
                </v-card>
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
export default class Unauthorized extends Vue {
    // Declared as component data
}
</script>

<style scoped></style>
