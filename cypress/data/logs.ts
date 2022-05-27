import { ILog } from "../../src/models/AdminStatistics/ExecutionStatistics";
import ApiMocks from "../fixtures/mockIndex";


export class LogData implements ILog {
    execution_id: string;
    level: string;
    line_no: number
    logger: string;
    model_name: string;
    model_version: string;
    module: string;
    msg: string;
    thread: string;
    type: string;
    written_at: string;
    written_ts: number;

    constructor(log: ILog) {
        this.execution_id = log.execution_id;
        this.level = log.level;
        this.line_no = log.line_no;
        this.model_name = log.model_name;
        this.model_version = log.model_version;
        this.module = log.module;
        this.msg = log.msg;
        this.thread = log.thread;
        this.type = log.type;
        this.written_at = log.written_at;
        this.written_ts = log.written_ts;
    }

    public static LOG_DATA_1: LogData = new LogData(<ILog>ApiMocks.EXECUTION_LOGS);
    // public static LOG_DATA_2: LogData = new LogData(<ILog>ApiMocks.EXECUTION_LOGS[1]);
    // public static LOG_DATA_3: LogData = new LogData(<ILog>ApiMocks.EXECUTION_LOGS[2]);
    // public static LOG_DATA_4: LogData = new LogData(<ILog>ApiMocks.EXECUTION_LOGS[3]);
    // public static LOG_DATA_5: LogData = new LogData(<ILog>ApiMocks.EXECUTION_LOGS[4]);
}
