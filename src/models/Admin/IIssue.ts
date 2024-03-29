/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

export interface IIssue {
    task_id: string;
    payload_id: string;
    execution_id: string;
    workflow_name: string;
    workflow_instance_id: string;
    status: string;
    model_name: string;
    patient_name: string;
    patient_id: string;
    execution_time: string;
    failure_reason?: string;
}

export interface IIndexedIssue {
    index: number;
    issue: IIssue;
}
