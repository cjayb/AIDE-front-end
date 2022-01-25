<template>
    <v-row style="border: 1px solid #eeeeee; background: #fff">
        <v-col class="d-flex" cols="6">
            <v-breadcrumbs :items="breadcrumbs" class="px-0 py-0" data-cy="breadcrumbs">
                <template v-slot:item="{ item }">
                    <v-breadcrumbs-item
                        data-cy="breadcrumb-item"
                        :to="item.to"
                        class="text-subtitle-2 crumb-item"
                        :disabled="item.disabled"
                        exact
                    >
                        {{ item.text }}
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="d-flex" cols="3">
            <v-text-field
                dense
                hide-details
                v-model="searchTerm"
                @input="search()"
                label="Search Application Repository"
                prepend-inner-icon="mdi-magnify"
                outlined
                data-cy="search-application-repository"
            ></v-text-field>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {},
})
export default class AppRepoHeader extends Vue {
    medical_specialties = ["General Medicine", "Radiology"];
    sorts = ["alphabetical", "date"];
    searchTerm = "";

    get breadcrumbs() {
        if (typeof this.$route!.meta!.breadCrumb === "function") {
            return this.$route!.meta!.breadCrumb.call(this, this.$route);
        }
        return this.$route!.meta!.breadCrumb;
    }

    search(): void {
        EventBus.$emit("search", this.searchTerm);
    }
}
</script>
