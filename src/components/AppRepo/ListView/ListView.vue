<template>
    <v-container style="max-width: 100%">
        <AppRepoHeader></AppRepoHeader>
        <Filters
            :applications="applicationResult.results"
            v-if="applicationResult.results.length > 0"
        ></Filters>
        <v-row justify="center" v-if="filteredApplications.length > 0" data-cy="application-table">
            <v-col v-for="application in filteredApplications" :key="application.id" md="auto">
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="mx-2 my-5"
                        width="320"
                        height="490"
                        :elevation="hover ? 12 : 2"
                        :class="{ 'on-hover': hover }"
                        data-cy="application-card"
                    >
                        <v-card-title
                            ><div class="title" data-cy="application-name">
                                {{ application.name }}
                            </div></v-card-title
                        >
                        <v-card-subtitle>
                            <div>
                                <v-row>
                                    <v-col
                                        class="py-0 my-0 text-left subTitle"
                                        cols="7"
                                        style="font-weight: bold"
                                        data-cy="developer-name"
                                        >{{ application.developer_details }}</v-col
                                    >
                                    <v-col
                                        class="py-0 my-0 text-right subTitle"
                                        cols="5"
                                        data-cy="version"
                                        ><span style="font-weight: bold">Version:</span>
                                        <span>{{ application.latest_version }}</span></v-col
                                    >
                                </v-row>
                            </div>
                        </v-card-subtitle>
                        <v-card-text>
                            <div class="shortDescription" data-cy="short-description">
                                {{ application.short_description }}
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                color="#1976D2"
                                @click="viewDetails(application.id)"
                                dark
                                small
                                class="mx-3"
                                data-cy="view-application-button"
                            >
                                View Application
                            </v-btn>
                        </v-card-actions>
                        <v-img
                            v-if="application.image != ''"
                            data-cy="application-image"
                            height="150"
                            width
                            style="border-radius: 10px"
                            class="ma-4"
                            :src="application.image"
                        ></v-img>
                        <v-img
                            v-if="application.image == ''"
                            data-cy="application-image"
                            height="150"
                            width
                            style="border-radius: 10px"
                            class="ma-5"
                            src="@/assets/test-stock.jpg"
                        ></v-img>
                        <v-card-text class="py-0">
                            <v-chip-group active-class="deep-purple accent-4 white--text" column>
                                <v-chip
                                    x-small
                                    dark
                                    :color="hex[index]"
                                    data-cy="specialty"
                                    v-for="(speciality, index) in application.medical_specialties"
                                    v-bind:key="speciality"
                                    >{{ speciality }}</v-chip
                                >
                            </v-chip-group>
                        </v-card-text>
                        <v-card-text class="py-0">
                            <v-item-group>
                                <v-container>
                                    <v-row>
                                        <v-col
                                            cols="4"
                                            md="4"
                                            v-for="certification in application.certification
                                                .certifications"
                                            :key="certification"
                                        >
                                            <v-img
                                                v-if="certification.includes('ce')"
                                                data-cy="ce-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/CE.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                            <v-img
                                                v-if="certification.includes('ukca')"
                                                data-cy="ukca-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/UKCA.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                            <v-img
                                                v-if="certification.includes('fda')"
                                                data-cy="fda-logo"
                                                contain
                                                class="mx-auto"
                                                src="@/assets/FDA.png"
                                                style="color: red"
                                                height="40px"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-item-group>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        <v-row
            style="padding-left: 56px"
            v-else
            class="d-flex justify-center my-12"
            data-cy="no-results-message"
            ><h2>No Results</h2></v-row
        >
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import AppRepoHeader from "../Shared/AppRepoHeader.vue";
import Filters from "../ListView/Filters.vue";
import { getAllApplications } from "../../../api/ApplicationService";
import { ApplicationResult } from "@/models/ApplicationResult";

@Component({
    components: { AppRepoHeader, Filters },
})
export default class ListView extends Vue {
    loading = true;
    applicationResult: ApplicationResult = {
        count: 0,
        next: 0,
        previous: 0,
        results: [],
    };
    searchTerm = "";
    selected_speciality = "";
    selected_sort = "az asc";
    hex = ["#2196F3", "#6383D2", "#797CC7", "#A66FB1", "#BC69A6", "#D2629B", "#E85C90"];

    async created(): Promise<void> {
        await getAllApplications()
            .then((applicationResult: ApplicationResult) => {
                this.applicationResult = applicationResult;
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });

        EventBus.$on("toggleSelectedSpeciality", (selected_speciality: string) => {
            if (selected_speciality == null) {
                this.selected_speciality = "";
            } else {
                this.selected_speciality = selected_speciality;
            }
        });

        EventBus.$on("toggleSelectedSort", (selected_sort: string) => {
            if (selected_sort == null) {
                this.selected_sort = "Ascending";
            } else {
                this.selected_sort = selected_sort;
            }
        });

        EventBus.$on("search", (searchTerm: string) => {
            this.searchTerm = searchTerm;
        });
    }

    get filteredApplications() {
        return this.applicationResult.results
            .filter((application) => {
                if (this.selected_speciality != "") {
                    return application.medical_specialties.includes(this.selected_speciality);
                } else {
                    return true;
                }
            })
            .filter((application) => {
                if (this.searchTerm != "") {
                    return application.name.toLowerCase().includes(this.searchTerm.toLowerCase());
                } else {
                    return true;
                }
            })
            .sort((a, b) => {
                if (this.selected_sort == "Ascending") {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                }
                if (this.selected_sort == "Descending") {
                    if (a.name > b.name) {
                        return -1;
                    }
                    if (a.name < b.name) {
                        return 1;
                    }
                }
                return 0;
            });
    }

    viewDetails(id: string): void {
        console.log(id);
        this.$router.push({ name: "ApplicationRepositoryDetail", params: { application_id: id } });
    }
}
</script>
<style>
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
}
.subTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: normal;
}
.shortDescription {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    height: 44px;
}
.v-slide-group__content {
    justify-content: center;
    height: 48px;
}
</style>
