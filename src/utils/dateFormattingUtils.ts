export const formatDateAndTimeOfArray = (items: any, itemProperty: string): void[] => {
    return items.map((item: any) => {
        const date = item[itemProperty].split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(item[itemProperty].split("T")[1].substr(0, 2));
        const suffix: string = hour >= 12 ? "PM" : "AM";
        const formattedHour = (hour % 12 || 12).toString();
        const minutes = item[itemProperty].split("T")[1].substr(2, 2).toString();
        item[itemProperty] =
            date +
            " " +
            (Number(formattedHour) < 10 ? "0" + formattedHour : formattedHour) +
            ":" +
            minutes +
            " " +
            suffix;
    });
};

export const formatDateAndTimeOfString = (item: string): string => {
    const date = item.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
    const hour = Number(item.split("T")[1].substr(0, 2));
    const minutes = item.split("T")[1].substr(2, 2).toString();
    return (item = date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes);
};
