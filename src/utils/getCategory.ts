// src/utils/getCategory.ts
import { CATEGORY_MAP } from "../data/categoryMap";

export const getDomain = (url: string) =>
  new URL(url).hostname.replace("www.", "");

export const getCategory = (url: string): string => {
  const domain = getDomain(url);
  return CATEGORY_MAP[domain] || "Uncategorized";
};
