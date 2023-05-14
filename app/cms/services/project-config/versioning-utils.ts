// Deep compare two objects
export const objectsEqual: any = (obj1: any, obj2: any) =>
  typeof obj1 === "object" && Object.keys(obj1).length > 0
    ? Object.keys(obj1).length === Object.keys(obj2).length &&
      Object.keys(obj1).every((p) => objectsEqual(obj1[p], obj2[p]))
    : obj1 === obj2;

// Deep compare two arrays
export const arraysEqual = (a1: Array<any>, a2: Array<any>) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
