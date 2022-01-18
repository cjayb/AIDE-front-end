<template>
    <v-row style="">
        <v-spacer></v-spacer>
        <v-col class="d-flex" cols="3">
            <v-select
                dense
                hide-details
                clearable
                v-model="selected_speciality"
                :items="medical_specialties"
                @change="toggleSelectedSpeciality()"
                label="Medical Speciality"
                solo
                data-cy="medical-speciality-filter"
            ></v-select>
        </v-col>
        <v-col class="d-flex" cols="3">
            <v-select
                dense
                hide-details
                clearable
                v-model="selected_sort"
                :items="sorts"
                @change="toggleSelectedSort()"
                label="Sort by"
                solo
                data-cy="sort-by"
            ></v-select>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Application } from "@/models/ApplicationResult";
import { EventBus } from "@/event-bus";

@Component({
    components: {},
})
export default class Filters extends Vue {
    @Prop() applications!: Application[];
    medical_specialties: string[] = [];
    sorts = ["az asc", "az desc"];
    selected_speciality = "";
    selected_sort = "";

    mounted(): void {
        console.log(this.applications);
        this.applications.forEach((application) => {
            console.log(application.medical_specialties);
            this.medical_specialties = this.medical_specialties.concat(
                application.medical_specialties,
            );
        });
    }

    toggleSelectedSpeciality(): void {
        EventBus.$emit("toggleSelectedSpeciality", this.selected_speciality);
    }

    toggleSelectedSort(): void {
        EventBus.$emit("toggleSelectedSort", this.selected_sort);
    }
}
</script>
