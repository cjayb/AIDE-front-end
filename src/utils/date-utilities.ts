import moment from "moment";

// example:
// 27 Oct 2022 1.05pm
export const NhsDateTimeFormat = "DD-MMM-YYYY h:mma";

export const formatDateAndTimeOfArray = (
    items: any,
    itemProperty: string,
    inludeFromNow = true,
): void => {
    items.map((item: any) => {
        item[itemProperty] = formatDateAndTimeOfString(item[itemProperty], inludeFromNow);
    });
};

/// Returns date time for examples...
/// 27 Oct 2022 1.05pm (44 minutes ago)
/// 27 Oct 2022 1.05pm (20 years ago)
/// You can remove from now bit of sting by passning in false too inludeFromNow param.
export function formatDateAndTimeOfString(dateStr: string, inludeFromNow = true) {
    const dateMoment = moment(dateStr);
    if (!dateMoment.isValid()) {
        return "";
    }
    return inludeFromNow
        ? `${dateMoment.format(NhsDateTimeFormat)} (${dateMoment.fromNow()})`
        : `${dateMoment.format(NhsDateTimeFormat)}`;
}
