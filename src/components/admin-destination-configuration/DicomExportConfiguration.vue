<template>
    <v-container fluid class="mt-3 mb-7 px-7">
        <div class="d-flex mb-4 justify-space-between">
            <h2 class="section-title mb-4">DICOM Configuration</h2>
            <v-btn
                color="primary"
                data-cy="add-dicom-configuration-button"
                @click="createDestination"
            >
                Add DICOM Configuration
                <v-icon class="ml-1">mdi-plus</v-icon>
            </v-btn>
        </div>
        <v-card elevation="1">
            <v-simple-table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>AE Name</th>
                        <th>Port</th>
                        <th>Echo Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dest, index) of destinations" :key="dest.name">
                        <td :data-cy="`destination-name-${index}`">{{ dest.name }}</td>
                        <td>
                            <code :data-cy="`destination-ip-${index}`">{{ dest.hostIp }}</code>
                        </td>
                        <td :data-cy="`destination-ae-title-${index}`">{{ dest.aeTitle }}</td>
                        <td :data-cy="`destination-port-${index}`">
                            <code>{{ dest.port }}</code>
                        </td>
                        <td>
                            <v-chip
                                v-if="dest.status"
                                :color="dest.status | chipStatusBg"
                                :text-color="dest.status | chipStatusText"
                                :data-cy="`destination-echo-status-${index}`"
                                class="text-capitalised"
                                small
                            >
                                {{ dest.status }}
                            </v-chip>
                        </td>
                        <td>
                            <v-btn
                                small
                                elevation="0"
                                class="mr-2"
                                :data-cy="`destination-action-echo-${index}`"
                                @click="echoDestination(dest)"
                            >
                                Echo
                                <v-icon small>mdi-play</v-icon>
                            </v-btn>
                            <v-btn
                                small
                                class="mr-2"
                                elevation="0"
                                aria-label="Edit DICOM Configuration"
                                :data-cy="`destination-action-edit-${index}`"
                                @click="editDestination(dest)"
                            >
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn
                                small
                                elevation="0"
                                aria-label="Delete DICOM Configuration"
                                :data-cy="`destination-action-delete-${index}`"
                                @click="confirmDeletion(dest)"
                            >
                                <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card>

        <!-- create/edit modal -->
        <v-dialog persistent v-model="destinationModal" max-width="350px" v-if="destination">
            <ConfigurationModal
                :destination="destination"
                @save="saveDestination"
                @discard="cancelCreate"
            />
        </v-dialog>

        <confirmation-modal
            persistent
            v-model="confirmDeleteModal"
            title="Delete destination"
            continue-btn-text="Yes, delete"
            data-cy-prefix="destination-delete"
            @cancel="cancelDestinationDelete"
            @continue="deleteDestination"
        >
            Are you sure you would like to delete
            <strong> {{ destination?.name }} </strong>?
        </confirmation-modal>

        <confirmation-modal
            persistent
            v-model="confirmEditModal"
            title="Edit destination"
            continue-btn-text="Yes, save changes"
            data-cy-prefix="destination-edit"
            @cancel="cancelDestinationEdit"
            @continue="updateDestination"
        >
            Are you sure you would like to edit
            <strong> {{ destination?.name }} </strong>?
        </confirmation-modal>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
    getExportDestinations,
    deleteExportDestination,
    createExportDestination,
    updateExportDestination,
    echoExportDestination,
} from "@/api/export-destination/ExportDestinationService";
import { IExportDestination } from "@/models/export-destinations/ExportDestination";
import ConfigurationModal from "./ConfigurationModal.vue";
import ConfirmationModal from "@/components/Shared/ConfirmationModal.vue";
import { isResultOk } from "@/utils/axios-helpers";

type EchoStatus = "loading" | "succeeded" | "failed";

type IExportDestinationStatus = IExportDestination & {
    status: EchoStatus;
};

@Component({
    components: {
        ConfigurationModal,
        ConfirmationModal,
    },
    filters: {
        chipStatusBg(status: EchoStatus) {
            if (status === "succeeded") {
                return "light-green lighten-4";
            } else if (status === "failed") {
                return "red lighten-5";
            }
        },
        chipStatusText(status: EchoStatus) {
            if (status === "succeeded") {
                return "light-green darken-4";
            } else if (status === "failed") {
                return "red darken-4";
            }
        },
    },
})
export default class DicomExportConfiguration extends Vue {
    destinations: IExportDestinationStatus[] = [];

    destinationModal = false;
    destination: IExportDestination | null = null;
    destinationToSave: IExportDestination | null = null;

    confirmDeleteModal = false;
    confirmEditModal = false;

    async mounted() {
        await this.fetchDestinations();
    }

    async echoDestination(destination: IExportDestinationStatus) {
        const dest = this.destinations.find((d) => d.name === destination.name);

        if (!dest) {
            return;
        }

        destination.status = "loading";
        this.destinations = [...this.destinations];

        try {
            const response = await echoExportDestination(dest.name);

            const ok = isResultOk(response);

            destination.status = ok ? "succeeded" : "failed";
        } catch {
            destination.status = "failed";
        }

        this.destinations = [...this.destinations];
    }

    createDestination() {
        this.destination = {} as IExportDestination;
        this.destinationModal = true;
    }

    cancelCreate() {
        this.destinationModal = false;
        this.clearDestinationObject();
    }

    editDestination(destination: IExportDestination) {
        this.destination = destination;
        this.destinationModal = true;
    }

    confirmDeletion(destination: IExportDestination) {
        this.destination = destination;
        this.confirmDeleteModal = true;
    }

    cancelDestinationDelete() {
        this.confirmDeleteModal = false;
        this.clearDestinationObject();
    }

    async deleteDestination() {
        if (!this.destination) {
            return;
        }

        const success = await deleteExportDestination(this.destination?.name);

        if (!success) {
            return;
        }

        this.confirmDeleteModal = false;
        this.clearDestinationObject();
        Vue.$toast.success("Destination successfully deleted");

        await this.fetchDestinations();
    }

    async saveDestination(destination: IExportDestination) {
        this.destinationToSave = destination;

        if (this.destination?.name) {
            this.confirmEditModal = true;

            return;
        }

        const success = await createExportDestination(this.destinationToSave);

        if (!success) {
            return;
        }

        this.destinationModal = false;
        this.clearDestinationObject();
        this.destinationToSave = null;

        Vue.$toast.success("Destination created");

        await this.fetchDestinations();
    }

    async updateDestination() {
        if (!this.destinationToSave || !this.destination) {
            return;
        }

        const success = await updateExportDestination(
            this.destination?.name,
            this.destinationToSave,
        );

        if (!success) {
            return;
        }

        this.confirmEditModal = false;
        this.destinationModal = false;
        this.clearDestinationObject();
        this.destinationToSave = null;

        Vue.$toast.success("Destination updated");

        await this.fetchDestinations();
    }

    cancelDestinationEdit() {
        this.confirmEditModal = false;
    }

    private clearDestinationObject() {
        setTimeout(() => {
            this.destination = null;
        }, 500);
    }

    private async fetchDestinations() {
        this.destinations = (await getExportDestinations()) as IExportDestinationStatus[];
    }
}
</script>

<style scoped>
.text-capitalised {
    text-transform: capitalize;
}
</style>
