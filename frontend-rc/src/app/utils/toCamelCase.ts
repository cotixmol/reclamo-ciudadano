export const toCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      (acc as Record<string, unknown>)[camelKey] = toCamelCase((obj as Record<string, unknown>)[key]);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
};
