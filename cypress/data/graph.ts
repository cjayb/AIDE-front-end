import { IGraph, Days } from "../../src/models/AdminStatistics/Graph";
import ApiMocks from "../fixtures/mockIndex";

export class GraphData implements IGraph {
    model_id: number;
    status: string;
    model_name: string;
    total_executions: number;
    total_failures: number;
    days: Days [];

    constructor(graph: IGraph) {
        this.model_id = graph.model_id;
        this.status = graph.status;
        this.model_name = graph.model_name;
        this.total_executions = graph.total_executions;
        this.total_failures = graph.total_failures;
        this.days = graph.days;
    }

    public static GRAPH_ONE_YEAR: GraphData = new GraphData(
        <IGraph>ApiMocks.ADMIN_DASHBOARD_GRAPH_ONE_YEAR
    );

    public static GRAPH_TEN_DAYS: GraphData = new GraphData(
        <IGraph>ApiMocks.ADMIN_DASHBOARD_GRAPH_TEN_DAYS
    );
}