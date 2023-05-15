export function toCamelCase(title: string) {
  return title
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "");
}
