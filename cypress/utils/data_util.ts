/**
 * Filter an object by its keys
 * @param obj object to filter
 * @param predicate to apply to object's values
 * @returns filtered object
 */
export function filterObject(obj, predicate): object {
    let newObj = {};
    let filteredKeys = Object.keys(obj)
        .filter(key => predicate(key));
    filteredKeys.forEach(key => newObj[`${key}`] = obj[key]);
    return newObj;
}
