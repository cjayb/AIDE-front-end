<template>
    <v-col cols="12">
        <v-row><h2>Certification</h2></v-row>
        <v-row
            ><p data-cy="certification-details">
                {{ application.certification.certification_details }}
            </p></v-row
        >
        <v-row justify="left" data-cy="specification-table">
            <v-col
                md="auto"
                v-for="certification in application.certification.certifications"
                :key="certification"
            >
                <v-hover v-slot="{ hover }">
                    <!-- CE -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 2 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="ce-certification"
                        v-if="certification.includes('ce')"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/CE.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="ce-title">CE</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
                <v-hover v-slot="{ hover }">
                    <!-- UKCA -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 2 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="ukca-certification"
                        v-if="certification.includes('ukca')"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/UKCA.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="ukca-title">UKCA</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
                <v-hover v-slot="{ hover }">
                    <!-- FDA -->
                    <v-card
                        class="custom-card mx-auto my-5"
                        :elevation="hover ? 2 : 0"
                        :class="{ 'on-hover': hover }"
                        data-cy="fda-certification"
                        v-if="certification.includes('fda')"
                    >
                        <v-row justify="center">
                            <v-img
                                width="80px"
                                height="80px"
                                data-cy="certifications"
                                contain
                                class="mx-auto"
                                src="@/assets/FDA.png"
                            />
                        </v-row>
                        <v-row justify="center">
                            <v-card-title class="mx-0 my-0" data-cy="fda-title">FDA</v-card-title>
                        </v-row>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
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
export default class Certification extends Vue {
    @Prop() application!: ApplicationDetail;
}
</script>
