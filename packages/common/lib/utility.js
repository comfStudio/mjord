export function getEnumMembers(myEnum) {
    // @ts-ignore
    return Object.keys(myEnum).filter((k) => typeof myEnum[k] === 'number');
}
export function getEnumMembersMKeyMap(myEnum) {
    const obj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key of getEnumMembers(myEnum)) {
        obj[key] = key;
    }
    return obj;
}
