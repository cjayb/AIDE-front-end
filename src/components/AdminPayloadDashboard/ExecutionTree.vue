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
                    link-style="straight"
                >
                    <template v-slot:node="{ node }">
                        <div
                            class="rich-media-node"
                            :style="{ cursor: !node.execution_id ? 'not-allowed' : 'pointer' }"
                            @click="setSelectedNode(node)"
                        >
                            <span
                                :class="`tree-node d-flex flex-column ${node.status} ${
                                    selectedNode?.id === node.id ? 'selected' : ''
                                }`"
                                :data-cy="`node ${node.name}`"
                            >
                                <span class="tree-node-title mt-5" :data-cy="`name ${node.name}`">
                                    {{ node.name }}
                                </span>
                                <span v-if="node.id === 'workflow-instance'" class="tree-node-text">
                                    Workflow
                                </span>
                                <span v-else-if="node.id !== 'root-node'" class="tree-node-text">
                                    Task
                                </span>
                                <span
                                    v-if="node.id !== 'root-node'"
                                    class="tree-node-text"
                                    :data-cy="`date ${node.name}`"
                                >
                                    {{ node.start_date | formatDateString }}
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
            <ModelDetailsSection v-if="selectedNode" :selected-node="selectedNode" />
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
import { getPayloadExecutions } from "@/api/Admin/payloads/PayloadService";
import { formatDateString } from "@/utils/date-utilities";
import { EventBus } from "@/event-bus";
import ModelDetailsSection from "./ModelDetailsSection.vue";
import { Prop } from "vue-property-decorator";
import { mapToExecutionTree } from "@/utils/workflow-instance-mapper";

Vue.component("vue-tree", VueTree);

@Component({
    components: {
        "vue-tree": VueTree,
        ModelDetailsSection,
    },
    filters: {
        formatDateString,
    },
})
export default class ExecutionTree extends Vue {
    @Prop({ required: true })
    payloadId!: string;

    loading = false;
    selectedNode: any = null;
    payloadExecutions: object = {};
    treeConfig = { nodeWidth: 100, nodeHeight: 70, levelHeight: 200 };

    mounted() {
        this.getPayloadExecutionsForTree();
    }

    async getPayloadExecutionsForTree(): Promise<void> {
        this.loading = true;

        const workflowInstances = await getPayloadExecutions(this.payloadId);
        this.payloadExecutions = mapToExecutionTree(workflowInstances);

        this.loading = false;
    }

    setSelectedNode(node: any): void {
        if (node.id === "root-node" || node.id === "workflow-instance") {
            return;
        }

        if (this.selectedNode?.id === node.id) {
            this.selectedNode = null;
            return;
        }

        this.selectedNode = node;
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

<style>
.node-slot {
    cursor: initial !important;
}
</style>

<style lang="scss" scoped>
.tree-node {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    background-color: orange;

    &.Failed,
    &.failed {
        background-color: red;
    }

    &.Succeeded,
    &.succeeded {
        background-color: green;
    }

    &.selected {
        border: 2px solid black;
    }
}

.tree-node-title {
    font-weight: bold;
    font-size: 14px;
}

.tree-node-text {
    font-size: 12px;
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
