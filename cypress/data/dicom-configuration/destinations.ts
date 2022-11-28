import ApiMocks from "../../fixtures/mockIndex";
import { IExportDestination } from "../../../src/models/export-destinations/ExportDestination";

export class DestinationData implements IExportDestination {
    name: string;
    port: number;
    aeTitle: string;
    hostIp: string;

    constructor(destination: IExportDestination) {
        this.name = destination.name;
        this.port = destination.port;
        this.aeTitle = destination.aeTitle;
        this.hostIp = destination.hostIp;
    }

    public static DESTINATIONS_EXAMPLE: DestinationData = new DestinationData(
        <IExportDestination>ApiMocks.DESTINATIONS_EXAMPLE[0],
    );

    public static DESTINATION_ADD: DestinationData = new DestinationData(
        <IExportDestination>ApiMocks.DESTINATION_ADD,
    );
}
