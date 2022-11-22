# Table of Contents
1. [Overview](#overview)
2. [Component props](#component-props)

# Overview
Modal used for confirming user actions such as deleting or updating items.
&nbsp;
![image](../static/confirmation-modal.png)

# Component props
- `dataCyPrefix: string` - string to be aded to the `data-cy` tag of the modal elements for Cypress tests.
- `persistent: boolean` - if set to true - dialog is not dismissed when clicking outside the modal or pressing `esc` key.
- `title: string` - descriptive title of the modal.
- `cancelBtnText: string` - text to be displayed on the button that cancels the action.
- `continueBtnText: string` - text to be displayed on the button that confirms the action.
- `value: boolean` - used to display/hide the modal.
