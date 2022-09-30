import moment from "moment";

export function formatDateString(dateString: string): string {
    const date = moment(dateString);

    if (!date.isValid()) {
        return "";
    }

    return date.format("YYYY-MM-DD HH:mm");
}
