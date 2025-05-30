import { twMerge } from "tailwind-merge";

const addClass = (base: string, newClass: string) => {
  if (!newClass) return base;
  if (base === "") return newClass;
  return `${base} ${newClass}`;
};

type Classes =
  | Array<string | Record<string, boolean> | null | undefined>
  | string
  | Record<string, boolean>
  | null
  | undefined;

export const cx = (classes: Classes) => {
  const arrayified = Array.isArray(classes) ? classes : [classes];
  const combinedClasses = arrayified.reduce((toApply: string, newClass) => {
    if (!newClass) return toApply;
    if (typeof newClass === "string") return addClass(toApply, newClass);

    return Object.keys(newClass).reduce((conditionals, className) => {
      if (!!newClass[className]) return addClass(conditionals, className);
      return conditionals;
    }, toApply);
  }, "");

  return twMerge(combinedClasses);
};
