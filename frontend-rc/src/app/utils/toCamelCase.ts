export const toCamelCase = <T>(obj: T, skipTransformation: boolean = false): T => {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item, skipTransformation)) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      // Transform the key if we're not skipping.
      const newKey = skipTransformation
        ? key
        : key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // If the current key is "presigned_url", then its children should not be transformed.
      const childSkip = key === "presigned_url" ? true : skipTransformation;
      
      (acc as Record<string, unknown>)[newKey] = toCamelCase((obj as Record<string, unknown>)[key], childSkip);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
};
