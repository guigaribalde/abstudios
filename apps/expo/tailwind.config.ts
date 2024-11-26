import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@acme/tailwind-config/native";

export default {
  content: [
    "index.{tsx,jsx,ts,js}",
    "src/**/*.{tsx,jsx,ts,js}",
    "components/**/*.{tsx,jsx,ts,js}",
  ],
  presets: [baseConfig, nativewind],
} satisfies Config;
