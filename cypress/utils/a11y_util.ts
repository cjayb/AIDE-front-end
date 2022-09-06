import axe from "axe-core";
import { Options } from "cypress-axe";

export function nodeTerminal(violations: axe.Result[]) {
    cy.task(
        "log",
        `${violations.length} accessibility violation${violations.length === 1 ? "" : "s"} ${
            violations.length === 1 ? "was" : "were"
        } detected`,
    );
    // pluck specific keys to keep the table readable
    const violationData: Array<any> = violations.map(
        ({ id, impact, description, nodes, helpUrl }) => ({
            id,
            impact,
            description,
            nodes: nodes.length,
            helpUrl,
        }),
    );

    cy.task("table", violationData);
}

export const a11yConfig: Options = {
    runOnly: {
        type: "tags",
        values: ["wcag21a", "wcag21aa", "wcag2a", "wcag2aa"],
    },
};
