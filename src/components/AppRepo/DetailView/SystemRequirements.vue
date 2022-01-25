<template>
    <v-col cols="12">
        <v-row><h2 data-cy="system-requirements">System Requirements</h2></v-row>
        <v-row justify="left" data-cy="system-requirements-icons"
            ><template v-for="(specification, key) in application.specification">
                <v-col
                    md="auto"
                    :key="specification"
                    v-if="!key.includes('input_types') && !key.includes('output_types')"
                >
                    <!-- GPU memory -->
                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="min-gpu-memory-card"
                        v-if="key == 'min_gpu_memory'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="min-gpu-memory-icon"
                                >mdi-expansion-card</v-icon
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-gpu-memory-value"
                                >{{ specification | formatNumber }} GB</v-card-title
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-gpu-memory-title"
                                >GPU memory</v-card-title
                            >
                        </v-row>
                    </v-card>

                    <!-- Number of Cores -->
                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="min-cpu-cores-card"
                        v-if="key == 'min_cpu_cores'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="min-cpu-cores-icon">mdi-cpu-64-bit</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title
                                class="px-0 py-0 mx-0 my-0"
                                data-cy="min-cpu-cores-value"
                                >{{ specification | formatNumber }}</v-card-title
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-cpu-cores-title"
                                >Number of Cores</v-card-title
                            >
                        </v-row>
                    </v-card>

                    <!-- Disk spaces -->
                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="min-disk-space-card"
                        v-if="key == 'min_disk_space'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="min-disk-space-icon">mdi-harddisk</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title
                                class="px-0 py-0 mx-0 my-0"
                                data-cy="min-disk-space-value"
                                >{{ specification | formatNumber }}</v-card-title
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-disk-space-title"
                                >Disk space</v-card-title
                            >
                        </v-row>
                    </v-card>

                    <!-- Ram -->
                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="min-ram-mb-card"
                        v-if="key == 'min_ram_mb'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="min-ram-mb-icon">mdi-memory</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-ram-mb-value">{{
                                specification | formatNumber
                            }}</v-card-title>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="min-ram-mb-title"
                                >Ram</v-card-title
                            >
                        </v-row>
                    </v-card>
                </v-col>
            </template></v-row
        >
        <v-row><h3 data-cy="input-output-types">Input and Output Types</h3></v-row>
        <v-row justify="left" data-cy="input-output-icons"
            ><template v-for="(specification, key) in application.specification">
                <v-col
                    md="auto"
                    :key="specification"
                    v-if="key.includes('input_types') || key.includes('output_types')"
                >
                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="input-types-card"
                        v-if="key == 'input_types'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="input-types-icon">mdi-import</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="input-types-title"
                                >Input Types</v-card-title
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-chip-group
                                active-class="deep-purple accent-4 white--text"
                                data-cy="input-types-values"
                                column
                            >
                                <v-chip
                                    x-small
                                    dark
                                    data-cy="input-types-value"
                                    v-for="type in specification"
                                    v-bind:key="type"
                                    >{{ type }}</v-chip
                                >
                            </v-chip-group>
                        </v-row>
                    </v-card>

                    <v-card
                        class="mx-auto my-5"
                        :elevation="0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="application-card"
                        v-if="key == 'output_types'"
                    >
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-icon size="80" data-cy="output-types-icon">mdi-export</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="output-types-title"
                                >Output Types</v-card-title
                            >
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-chip-group
                                active-class="deep-purple accent-4 white--text"
                                column
                                data-cy="output-types-values"
                            >
                                <v-chip
                                    x-small
                                    dark
                                    data-cy="output-types-value"
                                    v-for="type in specification"
                                    v-bind:key="type"
                                    >{{ type }}</v-chip
                                >
                            </v-chip-group>
                        </v-row>
                    </v-card>
                </v-col>
            </template></v-row
        >
    </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {},
})
export default class SystemRequirements extends Vue {
    @Prop() application!: ApplicationDetail;
}
</script>
