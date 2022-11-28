import { IPagedResponse, IPayload } from "../../../src/models/Admin/IPayload";
import ApiMocks from "../../fixtures/mockIndex";

export class PayloadData implements IPagedResponse<IPayload> {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: string;
    previousPage: string;
    data: IPayload[];

    constructor(payload: IPagedResponse<IPayload>) {
        this.pageNumber = payload.pageNumber;
        this.pageSize = payload.pageSize;
        this.firstPage = payload.firstPage;
        this.lastPage = payload.lastPage;
        this.totalPages = payload.totalPages;
        this.totalRecords = payload.totalRecords;
        this.nextPage = payload.nextPage;
        this.previousPage = payload.previousPage;
        this.data = payload.data;
    }

    public static PAYLOAD_TABLE_DATA: PayloadData = new PayloadData(
        <IPagedResponse<IPayload>>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE,
    );
    public static PAYLOAD_SEARCH: PayloadData = new PayloadData(
        <IPagedResponse<IPayload>>ApiMocks.PAYLOAD_SEARCH,
    );
}
