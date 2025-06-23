import type { Theme } from "@/types";

interface DropdownItem {
  title: string;
  value: Theme;
};

export const dropdownItem: DropdownItem[] = [
  {
    title: "Claro",
    value: "light",
  },
  {
    title: "Oscuro",
    value: "dark",
  },
];