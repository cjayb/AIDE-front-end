export const formatDateAndTimeOfArray = (items: any, itemProperty: string): void[] => {
    return items.map((item: any) => {
        const date = item[itemProperty].split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(item[itemProperty].split("T")[1].substr(0, 2));
        const minutes = item[itemProperty].split("T")[1].substr(2, 2).toString();
        item[itemProperty] =
            date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes + " ";
    });
};

export const formatDateAndTimeOfString = (item: string): string => {
    const date = item.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
    const hour = Number(item.split("T")[1].substr(0, 2));
    const minutes = item.split("T")[1].substr(2, 2).toString();
    return date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes;
};
