import { setupWorker } from "msw";

import { userManagementHandlers } from "./user-management";

export const worker = setupWorker(...userManagementHandlers);
