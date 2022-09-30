<template>
    <v-alert text type="error" icon="mdi-alert" data-cy="error-container">
        <li
            class="red--text text--accent-4 mb-1 body-2"
            :data-cy="error"
            v-for="error in errorMessages"
            :key="error"
        >
            {{ error }}
        </li>
    </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class ErrorMessageContainer extends Vue {
    @Prop() errorMessages!: string[];
}
</script>
