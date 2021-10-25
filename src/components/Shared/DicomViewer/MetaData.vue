<template>
    <v-container style="height: 67vh; overflow-y: hidden">
        <v-list class="metadatalist" style="clear: both">
            <v-list-item-group color="primary" class="pinnedlist">
                <v-list-item
                    v-for="item in pinnedInstanceMetadata"
                    :key="item"
                    data-cy="metadata-series"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click="unpinItem(item)">
                            <v-icon color="grey lighten-1">mdi-pin</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list-item-group>
        </v-list>
        <v-list class="metadatalist" style="height: 97%; overflow-y: auto; clear: both">
            <v-list-item-group color="primary">
                <template v-for="(value, name) in selectedInstanceMetadata">
                    <v-list-item data-cy="metadata-series" v-if="!!value" :key="value">
                        <v-list-item-content>
                            <v-tooltip bottom open-delay="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-title v-bind="attrs" v-on="on">
                                        {{ name }}
                                    </v-list-item-title>
                                </template>
                                <span>{{ name }}</span>
                            </v-tooltip>

                            <v-tooltip bottom open-delay="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-subtitle v-bind="attrs" v-on="on">{{
                                        value
                                    }}</v-list-item-subtitle>
                                </template>
                                <span>{{ value }}</span>
                            </v-tooltip>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon @click="pinItem(name, value)">
                                <v-icon color="grey lighten-1">mdi-pin-off</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { Prop } from "vue-property-decorator";
import { getInstanceMetadata } from "../../../api/OrthancService";
@Component
export default class MetaData extends Vue {
    selectedInstanceMetadata: Array<any> = [];
    pinnedInstanceMetadata: Array<any> = [];
    selectedItem: any = 0;

    async created(): Promise<void> {
        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            this.selectedInstanceMetadata = [];
            this.selectedInstanceMetadata = await getInstanceMetadata(selectedSeries.Instances[0]);

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
    }

    unpinItem(item: any): void {
        this.selectedInstanceMetadata[item.name] = item.value;
        this.pinnedInstanceMetadata.splice(this.pinnedInstanceMetadata.indexOf(item), 1);
    }
}
</script>

<style>
.metadatalist {
    background: black !important;
    color: white !important;
}

.metadatalist-header {
    color: white;
}

.metadatalist-header .v-icon {
    color: white;
}

.metadatalist-header .v-icon {
    color: white;
}

.metadatalist .v-list-item__title {
    color: #757575 !important;
    text-align: center;
}

.metadatalist .v-list-item__subtitle {
    color: #fff !important;
    text-align: center;
}

.metadatalist .v-list-item-group .v-list-item {
    margin: 5px 5px;
}

.metadatalist .v-list-item-group .v-list-item--active {
    opacity: 100%;
    border-radius: 10px;
    /* border: solid 1px white; */
}

.metadatalist .v-list-item--link:hover {
    background-color: #46464680;
    opacity: 100%;
    border-radius: 10px;
}

.metadatalist .v-list-item--link:before {
    background-color: #46464680;
    opacity: 50%;
    border-radius: 10px;
    margin: 0px;
}

.pinnedlist .v-list-item--link:before {
    background-color: #46464680;
    border: solid 1px white;
    opacity: 100%;
    border-radius: 10px;
    margin: 0px;
}

.cornerstone-canvas {
    width: 100% !important;
    height: 100% !important;
}
</style>
