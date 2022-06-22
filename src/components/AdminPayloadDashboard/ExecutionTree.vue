<template>
    <div class="container">
        <vue-tree
            v-if="!loading"
            style="width: 80%; height: 300px"
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
                        :data-cy="node.model_name"
                    >
                        <span
                            class="tree-node-title mt-5"
                            style="font-weight: bold; font-size: 14px"
                        >
                            {{ node.model_name }}
                        </span>
                        <span class="tree-node-text" style="font-size: 12px">
                            {{ formatDate(node.execution_finished) }}
                        </span>
                    </span>
                </div>
            </template>
        </vue-tree>
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
Vue.component("vue-tree", VueTree);

const ExecutionTreeProps = Vue.extend({
    props: {
        payload_id: { type: Number, required: true },
    },
});

@Component({
    components: {},
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
    treeConfig = { nodeWidth: 120, nodeHeight: 70, levelHeight: 200 };

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

    setSelectedNode(node: IPayloadExecutionsFormatted) {
        this.selectedNode = node;
    }

    formatDate(date: string): string {
        return formatDateAndTimeOfString(date);
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
</style>
