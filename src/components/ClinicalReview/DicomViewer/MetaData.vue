<template>
    <v-container
        style="
            height: calc(100vh - 251px);
            overflow-y: hidden;
            display: flex;
            flex-direction: column;
        "
        class="ma-0 pa-0"
    >
        <v-progress-linear
            color="#61366e"
            indeterminate
            rounded
            height="6"
            :active="loading"
        ></v-progress-linear>
        <v-list class="metadatalist" style="clear: both">
            <v-list-item-group color="primary" class="pinnedlist">
                <v-slide-y-transition class="py-0" group tag="v-list">
                    <template v-for="item in pinnedInstanceMetadata">
                        <v-list-item
                            :key="item.name"
                            data-cy="pinned-metadata"
                            v-if="item.value != null"
                        >
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.value.Name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ item.value.Value }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="unpinItem(item)" data-cy="pin-metadata">
                                    <v-icon color="grey lighten-1">mdi-pin</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-slide-y-transition>
            </v-list-item-group>
        </v-list>
        <v-list class="metadatalist" style="height: 100%; overflow-y: auto; clear: both">
            <v-list-item-group color="primary">
                <v-slide-y-transition class="py-0" group tag="v-list">
                    <template v-for="(value, name) in selectedInstanceMetadata">
                        <v-list-item
                            data-cy="metadata-series"
                            v-if="name != null && value != null && value.Value != ''"
                            :key="name"
                        >
                            <v-list-item-content>
                                <v-tooltip bottom open-delay="500">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-list-item-title v-bind="attrs" v-on="on">
                                            {{ value.Name }}
                                        </v-list-item-title>
                                    </template>
                                    <span>{{ value.Name }}</span>
                                </v-tooltip>

                                <v-tooltip bottom open-delay="500">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-list-item-subtitle v-bind="attrs" v-on="on">{{
                                            value.Value
                                        }}</v-list-item-subtitle>
                                    </template>
                                    <span>{{ value.Value }}</span>
                                </v-tooltip>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="pinItem(name, value)" data-cy="pin-metadata">
                                    <v-icon color="grey lighten-1">mdi-pin-off</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-slide-y-transition>
            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { Prop } from "vue-property-decorator";
import { getInstanceMetadata } from "../../../api/ClinicalReview/OrthancService";
@Component
export default class MetaData extends Vue {
    selectedInstanceMetadata: Array<any> = [];
    pinnedInstanceMetadata: Array<any> = [];
    selectedItem: any = 0;
    loading = true;

    async created(): Promise<void> {
        EventBus.$on("updateSelectedInstance", async (currentInstanceId: any) => {
            this.loading = true;
            this.pinnedInstanceMetadata = this.$store.state.pinnedMetadata;
            this.selectedInstanceMetadata = [];
            this.selectedInstanceMetadata = await getInstanceMetadata(currentInstanceId);
            this.loading = false;
            this.pinnedInstanceMetadata.forEach((item) => {
                item.value = this.selectedInstanceMetadata[item.name];
                this.selectedInstanceMetadata[item.name] = null;
            });
        });
    }

    toggleMetadata(): void {
        EventBus.$emit("toggleMetadata");
    }

    pinItem(name: any, value: any): void {
        this.selectedInstanceMetadata[name] = null;
        this.pinnedInstanceMetadata.push({ name: name, value: value });
        this.$store.commit("setPinnedMetadata", this.pinnedInstanceMetadata);
    }

    unpinItem(item: any): void {
        this.selectedInstanceMetadata[item.name] = item.value;
        this.pinnedInstanceMetadata.splice(this.pinnedInstanceMetadata.indexOf(item), 1);
        this.$store.commit("setPinnedMetadata", this.pinnedInstanceMetadata);
    }
}
</script>

<style scoped>
.metadatalist {
    background: black !important;
    color: white !important;
}

.metadatalist .v-list-item__title {
    color: #757575 !important;
    text-align: left;
}

.metadatalist .v-list-item__subtitle {
    color: #fff !important;
    text-align: left;
}

.metadatalist .v-list-item-group .v-list-item {
    margin: 5px 5px;
}

.metadatalist .v-list-item-group .v-list-item--active {
    opacity: 1;
    border-radius: 10px;
    /* border: solid 1px white; */
}

.metadatalist .v-list-item--link:hover {
    background-color: #464646;
    opacity: 1;
    border-radius: 10px;
}

.metadatalist .v-list-item--link:before {
    background-color: rgba(70, 70, 70, 0);
    opacity: 0.6;
    border-radius: 10px;
    margin: 0px;
}

.pinnedlist .v-list-item--link:before {
    background-color: rgba(70, 70, 70, 0.5);
    border: solid 1px white;
    opacity: 0.6;
    border-radius: 10px;
    margin: 0px;
}

.pinnedlist .v-list-item__title {
    color: #757575 !important;
    text-align: center;
}

.pinnedlist .v-list-item__subtitle {
    color: #fff !important;
    text-align: center;
}

.cornerstone-canvas {
    width: 100% !important;
    height: 100% !important;
}

.list-enter-active,
.list-leave-active {
    transition: all;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
