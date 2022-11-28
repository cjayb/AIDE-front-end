/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { rest } from "msw";

export const executionsHandlers = [
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/artifacts`,
        (_req, res, ctx) => {
            return res(ctx.json({ "file-name.ext": "minio-object-key/guid/file-name.ext" }));
        },
    ),
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/metadata`,
        (_req, res, ctx) => {
            return res(ctx.json({ key: "value" }));
        },
    ),
];
