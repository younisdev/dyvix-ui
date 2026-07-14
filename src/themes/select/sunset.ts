import { SelectTheme } from "@/types/select";

export const sunsetSelectTheme: SelectTheme = {
  name: "Sunset",
  select: {
    base: "relative w-full cursor-pointer",
    trigger: {
      base: "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-200",
      colors: {
        default: "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-900 hover:border-orange-400 hover:from-orange-100 hover:to-amber-100",
        focus: "border-orange-500 ring-2 ring-orange-200 outline-none",
        disabled: "opacity-50 cursor-not-allowed border-orange-200 bg-orange-50",
        error: "border-red-400 bg-red-50 text-red-900",
      },
    },
    content: {
      base: "absolute z-50 mt-1 w-full rounded-lg border shadow-lg overflow-hidden",
      colors: {
        default: "border-orange-200 bg-gradient-to-b from-orange-50 to-amber-50",
      },
    },
    item: {
      base: "flex w-full cursor-pointer items-center px-3 py-2 text-sm transition-colors duration-150",
      colors: {
        default: "text-orange-900 hover:bg-orange-100/70",
        selected: "bg-gradient-to-r from-orange-200/60 to-amber-200/60 text-orange-900 font-medium",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    icon: {
      base: "h-4 w-4 shrink-0 transition-transform duration-200",
      colors: {
        default: "text-orange-500",
      },
    },
  },
};
