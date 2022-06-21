import { IPayload } from "../../src/models/Admin/IPayload";
import ApiMocks from "../fixtures/mockIndex";

export class PayloadData implements IPayload {
    payload_id: number;
    patient_name: string;
    patient_id: string;
    payload_received: string;

    constructor(payload: IPayload) {
        this.payload_id = payload.payload_id;
        this.patient_name = payload.patient_name;
        this.patient_id = payload.patient_id;
        this.payload_received = payload.payload_received;
    }

    public static PAYLOAD_DATA_1: PayloadData = new PayloadData(
        <IPayload>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE[0]
    );
    public static PAYLOAD_DATA_2: PayloadData = new PayloadData(
        <IPayload>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE[1],
    );
    public static PAYLOAD_DATA_3: PayloadData = new PayloadData(
        <IPayload>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE[2],
    );
    public static PAYLOAD_DATA_4: PayloadData = new PayloadData(
        <IPayload>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE[3],
    );
    public static PAYLOAD_DATA_5: PayloadData = new PayloadData(
        <IPayload>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE[4]
    );
}
