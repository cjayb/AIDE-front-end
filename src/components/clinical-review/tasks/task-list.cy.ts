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

import TaskList from "./task-list.vue";

describe("<Tasks />", () => {
    it("renders the page with search and radio buttons visible", () => {
        cy.intercept(
            "/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            {
                data: [],
            },
        );

        cy.mount(TaskList);

        cy.dataCy("radio-buttons").should("be.visible");
        cy.dataCy("worklist-search").should("be.visible");
        cy.dataCy("pagination").should("be.visible");
    });
});
