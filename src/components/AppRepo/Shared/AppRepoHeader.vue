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
                        <span v-if="application && item.text.includes(application.id)">{{
                            application.name
                        }}</span>
                        <span v-else>{{ item.text }}</span>
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="d-flex" cols="3">
            <v-text-field
                :disabled="searchDisabled"
                :dark="searchDisabled"
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
import { Watch, Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { Application } from "@/models/Application";

@Component({
    components: {},
})
export default class AppRepoHeader extends Vue {
    @Prop() application!: Application;
    medical_specialties = ["General Medicine", "Radiology"];
    sorts = ["alphabetical", "date"];
    searchTerm = "";
    searchDisabled = true;

    get breadcrumbs() {
        if (typeof this.$route!.meta!.breadCrumb === "function") {
            return this.$route!.meta!.breadCrumb.call(this, this.$route);
        }
        return this.$route!.meta!.breadCrumb;
    }

    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        if (this.$route.name?.includes("ApplicationRepositoryDetail")) {
            this.searchDisabled = true;
        } else {
            this.searchDisabled = false;
        }
    }

    search(): void {
        EventBus.$emit("search", this.searchTerm);
    }
}
</script>
