import { setupWorker } from "msw";

import { userManagementHandlers } from "./user-management";
import { workflowsHandlers } from "./workflows";
import { payloadsHandlers } from "./payloads";
import { executionsHandlers } from "./executions";
import { logsHandlers } from "./logs";

export const worker = setupWorker(
    ...userManagementHandlers,
    ...workflowsHandlers,
    ...payloadsHandlers,
    ...executionsHandlers,
    ...logsHandlers,
);
