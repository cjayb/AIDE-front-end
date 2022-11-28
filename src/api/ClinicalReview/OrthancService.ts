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

import { createAxiosOrthancInstance } from "@/utils/axios-helpers";

const httpService = createAxiosOrthancInstance();

export async function findStudy(StudyInstanceUID: string): Promise<any> {
    const response = await httpService.post(`/tools/find`, {
        Level: "Study",
        Expand: true,
        Limit: 101,
        Query: {
            StudyDate: "",
            StudyInstanceUID: StudyInstanceUID,
        },
        Full: true,
    });
    return response.data;
}

export async function getStudy(StudyId: string): Promise<any> {
    const response = await httpService.get(`/studies/${StudyId}`);
    return response.data;
}

export async function getSeries(StudyId: string): Promise<any> {
    const response = await httpService.get(`/series/${StudyId}`);
    return response.data;
}

export async function getSeriesOrderedSlices(StudyId: string): Promise<any> {
    const response = await httpService.get(`/series/${StudyId}/ordered-slices`);
    return response.data;
}

export async function getInstance(StudyId: string): Promise<any> {
    const response = await httpService.get(`/instances/${StudyId}`);
    return response.data;
}

export async function getInstanceMetadata(StudyId: string): Promise<any> {
    const response = await httpService.get(`/instances/${StudyId}/tags`);
    return response.data;
}

export async function downloadStudy(StudyId: string): Promise<any> {
    const response = await httpService.get(`/studies/${StudyId}/media`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${StudyId}.zip`); //or any other extension
    document.body.appendChild(link);
    link.click();
    return response.data;
}
