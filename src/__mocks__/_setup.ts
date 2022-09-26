import { setupWorker } from "msw";

import { userManagementHandlers } from "./user-management";
import { workflowsHandlers } from "./workflows";

export const worker = setupWorker(...userManagementHandlers, ...workflowsHandlers);
