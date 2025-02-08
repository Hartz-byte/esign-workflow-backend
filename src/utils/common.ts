// src/utils/common.ts
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
