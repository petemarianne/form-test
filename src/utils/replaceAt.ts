export const replaceAt = (str: string, index: number, char: string) => {
    return str.substring(0, index) + char + str.substring(index + char.length);
}
