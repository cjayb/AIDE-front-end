<!--
  Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <v-container>
        <section>
            <h1>Accessibility statement for AIDE</h1>
            <p>
                This accessibility statement applies to the AI Centre for Value Based Healthcare
                website AIDE.
            </p>
            <p>
                This website is run by the AI Centre for Value Based Healthcare. We want as many
                people as possible to be able to use this website. For example, that means you are
                able to:
            </p>
            <ul>
                <li>Zoom in up to 300% without the text spilling off the screen</li>
                <li>Navigate most of the website using just a keyboard</li>
                <li>Navigate most of the website using speech recognition software</li>
                <li>
                    listen to most of the website using a screen reader (including the most recent
                    versions of JAWS, NVDA and VoiceOver)
                </li>
            </ul>
            <p>
                <a href="https://mcmw.abilitynet.org.uk/">AbilityNet</a> has advice on making your
                device easier to use if you have a disability.
            </p>
        </section>

        <section>
            <h2>How accessible this website is</h2>
            <p>We know that some parts of this website are not fully accessible. For example:</p>
            <ul>
                <li>Clinical Review DICOM viewer cannot be operated by Keyboard alone.</li>
                <li>
                    Unable to access some radio buttons and checkboxes across the site via Keyboard.
                </li>
                <li>
                    Some column headers are missing labels which may mean that a screen reader is
                    ineffective on some tables.
                </li>
                <li>Colour contrast is insufficient on some input fields and table headers.</li>
            </ul>
        </section>

        <section>
            <h2>Reporting problems with this website</h2>
            <p>
                We're always looking to improve the accessibility of this website. If you find any
                problems not listed on this page or think we're not meeting accessibility
                requirements, please contact us.
            </p>
            <p>CONTACT-DETAILS-TO-BE-ADDED</p>
        </section>

        <section>
            <h2>Enforcement procedure</h2>
            <p>
                The Equality and Human Rights Commission (EHRC) is responsible for enforcing the
                Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility
                Regulations 2018 (the 'accessibility regulations'). If you're not happy with how we
                respond to your complaint, contact the
                <a href="https://www.equalityadvisoryservice.com/"
                    >Equality Advisory and Support Service (EASS)</a
                >.
            </p>
        </section>

        <section>
            <h2>Technical information about this website's accessibility</h2>
            <p>
                The AI Centre for Value Based Healthcare is committed to making its website
                accessible, in accordance with the Public Sector Bodies (Websites and Mobile
                Applications) (No. 2) Accessibility Regulations 2018.
            </p>
            <h3>Compliance status</h3>
            <p>
                This website is partially compliant with the
                <a href="https://www.w3.org/TR/WCAG21/"
                    >Web Content Accessibility Guidelines version 2.1</a
                >
                AA standard.
            </p>
            <h3>Non-accessible content</h3>
            <p>
                Despite our best efforts to ensure accessibility of AIDE, there may be some
                limitations. Below is a description of known limitations:
            </p>
            <v-simple-table>
                <thead>
                    <tr>
                        <th>Page</th>
                        <th>Issues</th>
                        <th>Type</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Admin page - System Statistics</td>
                        <td>
                            No column header above the first column in the 'Issues' table containing
                            the checkboxes
                        </td>
                        <td>Explicit labelling - WAVE</td>
                        <td>
                            Unable to use a screen reader to describe what this column is used for
                        </td>
                    </tr>
                    <tr>
                        <td>Admin page - System Statistics</td>
                        <td>Unable to access the checkboxes by tabbing to them</td>
                        <td>Keyboard accessibility - WAVE</td>
                        <td>
                            Individuals using only a keyboard will be unable to select or un-select
                            any checkbox
                        </td>
                    </tr>
                    <tr>
                        <td>Payload page - Payload table</td>
                        <td>
                            No text on the far left column which contains the drop-down/expansion
                            symbols
                        </td>
                        <td>Explicit labelling - WAVE</td>
                        <td>
                            Unable to use a screen reader to describe what this column is used for
                        </td>
                    </tr>
                    <tr>
                        <td>Payload page - Payload table</td>
                        <td>
                            &quot;A button is empty or has no text&quot; - Error next to all three
                            drop-down/expansion symbols
                        </td>
                        <td>Explicit labelling - WAVE</td>
                        <td>
                            Unable to use a screen reader to describe what this column is used for
                        </td>
                    </tr>
                    <tr>
                        <td>All pages with pagination</td>
                        <td>Pagination has a nested interactive element</td>
                        <td>Nested-interactive - AXE</td>
                        <td>
                            Ensures interactive controls are not nested as they are not always
                            announced by screen readers or can cause focus problems for assistive
                            technologies
                        </td>
                    </tr>
                    <tr>
                        <td>All pages with a modal</td>
                        <td>
                            Unable to add an aria-label on the whole modal component because Vuetify
                            does not allow it
                        </td>
                        <td>Aria-dialog-name - Axe</td>
                        <td>
                            Serious - Ensures every ARIA dialog and alertdialog node has an
                            accessible name
                        </td>
                    </tr>
                    <tr>
                        <td>All pages</td>
                        <td>Colour contrast - Placeholder text for input fields</td>
                        <td>Insufficient color contrast - Axe</td>
                        <td>Serious</td>
                    </tr>
                    <tr>
                        <td>All pages with pagination</td>
                        <td>Colour contrast on rows per page dropdown</td>
                        <td>Insufficient color contrast - Axe</td>
                        <td>Serious</td>
                    </tr>
                    <tr>
                        <td>Workflow editor page</td>
                        <td>
                            Element contains only non-text characters - the error is shown for the
                            little expansion arrows within the text editor
                        </td>
                        <td>Insufficient color contrast - Axe</td>
                        <td>Serious</td>
                    </tr>
                    <tr>
                        <td>Workflow editor page</td>
                        <td>
                            Aria-label error for the Editor - unable to change as it is an inbuilt
                            Vuetify library which errors if we change
                        </td>
                        <td>Aria-input-field-name</td>
                        <td>Serious</td>
                    </tr>
                    <tr>
                        <td>Payload page - Payload table</td>
                        <td>Unable to access the radio buttons by tabbing to them</td>
                        <td>Keyboard accessibility - WAVE</td>
                        <td>
                            Individuals using only a keyboard will be unable to select radio buttons
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </section>

        <section>
            <h2>Disproportionate burden</h2>
            <p>We believe that our approach to carrying out accessibility checks is reasonable.</p>
            <p>
                However, the accessibility regulations say that we don't need to make all elements
                on a website accessible, if doing so would impose a disproportionate burden on us.
                Under assessment we feel that the Clinical Review DICOM viewer falls under this
                section with regards to the technology it is built in and the additional effort it
                would take to extract that functionality to make it accessible.
            </p>
        </section>

        <section>
            <h2>Browser and device compatibility</h2>
            <p>
                AIDE is designed to be compatible with the following browsers running on a minimum
                of 1000px width:
            </p>
            <ul>
                <li>Sarafi</li>
                <li>Edge</li>
                <li>Chrome</li>
                <li>Firefox</li>
            </ul>
            <p>AIDE is not compatible with:</p>
            <ul>
                <li>Browsers older than 2 major versions</li>
                <li>Mobile device browsers</li>
            </ul>
        </section>

        <section>
            <h2>Preparation of this accessibility statement</h2>
            <p>
                This statement was prepared on {{ statementPreparedDate | formatDate }}. It was last
                reviewed on {{ statementLastReviewedDate | formatDate }}. This website was last
                tested on {{ websiteLastTestedDate | formatDate }}. The test was carried out by the
                AI Centre for Value Based Healthcare. We tested all pages.
            </p>
            <p>
                We also carried out automated and technical testing to check the website's code and
                content against the WCAG criteria.
            </p>
            <p>
                We carried out usability testing to make sure the website can be navigated using a
                keyboard and the following assistive technologies: Voiceover, NVDA and Zoomtext.
            </p>
        </section>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate } from "@/utils/date-utilities";

export default defineComponent({
    metaInfo: {
        title: "Accessibility Statement",
    },
    filters: {
        formatDate,
    },
    data() {
        return {
            statementPreparedDate: "2022-11-30T00:00:00",
            statementLastReviewedDate: "2022-11-30T00:00:00",
            websiteLastTestedDate: "2022-11-30T00:00:00",
        };
    },
});
</script>

<style scoped>
section {
    margin-top: 20px;
}

ul {
    margin-bottom: 16px;
}

p a {
    color: #1867c0;
    font-weight: bold;
}
</style>
