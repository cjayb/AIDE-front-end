<template>
    <div class="container">
        <v-row v-if="!loading">
            <div style="width: 75%">
                <vue-tree
                    ref="tree"
                    style="width: 100%; height: 380px"
                    :dataset="payloadExecutions"
                    :config="treeConfig"
                    direction="horizontal"
                    :collapse-enabled="false"
                >
                    <template v-slot:node="{ node }">
                        <div class="rich-media-node" @click="setSelectedNode(node)">
                            <span
                                class="tree-node d-flex flex-column"
                                :style="{
                                    background: node.execution_status === 'error' ? 'red' : 'green',
                                    border:
                                        selectedNode.execution_id === node.execution_id
                                            ? '2px solid black'
                                            : '',
                                    borderRadius: '50%',
                                }"
                                :data-cy="'node ' + node.model_name"
                            >
                                <span
                                    class="tree-node-title mt-5"
                                    style="font-weight: bold; font-size: 14px"
                                    :data-cy="'name ' + node.model_name"
                                >
                                    {{ node.model_name }}
                                </span>
                                <span
                                    class="tree-node-text"
                                    style="font-size: 12px"
                                    :data-cy="'date ' + node.model_name"
                                >
                                    {{ formatDate(node.execution_finished) }}
                                </span>
                            </span>
                        </div>
                    </template>
                </vue-tree>
                <v-btn elevation="2" fab class="tree-button ml-5" @click="resetExecutionTree">
                    <v-icon color="black" data-cy="reset"> mdi-arrow-u-left-bottom </v-icon>
                </v-btn>
                <v-btn elevation="2" fab class="tree-button" @click="zoomInExecutionTree">
                    <v-icon color="black" data-cy="zoom-in"> mdi-magnify-plus-outline </v-icon>
                </v-btn>
                <v-btn elevation="2" fab class="tree-button" @click="zoomOutExecutionTree">
                    <v-icon color="black" data-cy="zoom-out"> mdi-magnify-minus-outline </v-icon>
                </v-btn>
            </div>
            <ModelDetailsSection :selectedNodeDetails="selectedNode" />
        </v-row>
        <div v-else class="text-center my-3">
            <v-progress-circular indeterminate color="grey" data-cy="progress" />
        </div>
    </div>
</template>

<script lang="ts">
import VueTree from "@ssthouse/vue-tree-chart";
import Component from "vue-class-component";
import Vue from "vue";
import { IPayloadExecutionsFormatted } from "@/models/Admin/IPayload";
import { getPayloadExecutions } from "@/api/Admin/AdminStatisticsService";
import { formatDateAndTimeOfString } from "@/utils/dateFormattingUtils";
import { EventBus } from "@/event-bus";
import ModelDetailsSection from "./ModelDetailsSection.vue";

Vue.component("vue-tree", VueTree);

const ExecutionTreeProps = Vue.extend({
    props: {
        payload_id: { type: Number, required: true },
    },
});

@Component({
    components: {
        "vue-tree": VueTree,
        ModelDetailsSection,
    },
})
export default class ExecutionTree extends ExecutionTreeProps {
    loading = false;
    selectedNode: IPayloadExecutionsFormatted | null = {
        execution_id: 0,
        payload_id: 0,
        model_name: "",
        execution_status: "",
        execution_started: "",
        execution_finished: "",
        children: [],
    };
    payloadExecutions: IPayloadExecutionsFormatted[] = [];
    treeConfig = { nodeWidth: 100, nodeHeight: 70, levelHeight: 200 };

    async created(): Promise<void> {
        this.getPayloadExecutionsForTree();
    }

    async getPayloadExecutionsForTree(): Promise<void> {
        this.loading = true;
        await getPayloadExecutions(this.payload_id)
            .then((executions) => {
                this.payloadExecutions = JSON.parse(
                    JSON.stringify(executions).replace(/"executions"/g, '"children"'),
                );
                this.selectedNode = this.payloadExecutions[0];
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loading = false;
    }

    setSelectedNode(node: IPayloadExecutionsFormatted): void {
        this.selectedNode = node;
    }

    formatDate(date: string): string {
        return formatDateAndTimeOfString(date);
    }

    zoomInExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.zoomIn();
        }
    }

    zoomOutExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.zoomOut();
        }
    }

    resetExecutionTree(): void {
        if (typeof this.$refs.tree !== "undefined") {
            (this as any).$refs.tree.restoreScale();
        }

        const tree = document.querySelector(".dom-container") as HTMLElement;
        const treeLink = document.querySelector(".vue-tree") as HTMLElement;
        if (tree && treeLink) {
            tree.style.transform = "translate(" + -100 + "px," + 190 + "px)";
            treeLink.style.transform = "translate(" + -100 + "px," + 190 + "px)";
        }
    }

    openLogsDialog(execution_id: number): void {
        EventBus.$emit("openLogsDialog", true, execution_id);
    }
}
</script>

<style scoped>
.tree-node {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
}

.tree-node-title,
.tree-node-text {
    width: 8rem;
    text-align: left;
}

.tree-button {
    width: 30px;
    height: 30px;
    margin: 10px 3px;
}
</style>
