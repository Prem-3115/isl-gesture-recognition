/**
 * utils/cn.ts
 *
 * The `cn` class-name utility, moved out of the UI component folder.
 * This is a shared utility, not a UI component.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
