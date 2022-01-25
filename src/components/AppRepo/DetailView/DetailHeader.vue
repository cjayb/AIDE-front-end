<template>
    <v-row>
        <v-col cols="12"
            ><v-row
                ><v-col cols="12"
                    ><v-img
                        data-cy="application-image"
                        height="372"
                        width
                        style="border-radius: 10px"
                        class="ma-5"
                        :src="application.image"
                    ></v-img></v-col
            ></v-row>
            <v-row
                ><v-col
                    cols="12"
                    style="color: #23212a; font-weight: 600; font-size: 32px; line-height: 44px"
                    data-cy="short-description"
                    >{{ application.short_description }}</v-col
                ></v-row
            >
            <v-row
                ><v-col cols="12">
                    <v-chip-group column style="flex: 0 0 auto !important">
                        <v-chip
                            small
                            dark
                            :color="hex[index]"
                            data-cy="specialty"
                            v-for="(speciality, index) in application.medical_specialties"
                            v-bind:key="speciality"
                            >{{ speciality }}</v-chip
                        >
                    </v-chip-group></v-col
                ></v-row
            ></v-col
        ></v-row
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {},
})
export default class DetailHeader extends Vue {
    @Prop() application!: ApplicationDetail;
    hex = ["#2196F3", "#6383D2", "#797CC7", "#A66FB1", "#BC69A6", "#D2629B", "#E85C90"];
}
</script>
