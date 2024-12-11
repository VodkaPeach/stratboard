import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(slider|popover).js"
  ],
  safelist:[
    'bg-Abyss',
    'bg-Ascent',
    'bg-Bind',
    'bg-Breeze',
    'bg-Fracture',
    'bg-Haven',
    'bg-Icebox',
    'bg-Lotus',
    'bg-Pearl',
    'bg-Split',
    'bg-Sunset',
  ],
  theme: {
    extend: {
      backgroundImage:{
        'Abyss': 'url(/map_bg/Abyss.webp)',
        'Ascent': 'url(/map_bg/Ascent.webp)',
        'Bind': 'url(/map_bg/Bind.webp)',
        'Fracture': 'url(/map_bg/Fracture.webp)',
        'Lotus': 'url(/map_bg/Lotus.webp)',
        'Split': 'url(/map_bg/Split.webp)',
        'Sunset': 'url(/map_bg/Sunset.webp)',
        'Pearl': 'url(/map_bg/Pearl.webp)',
        'Haven': 'url(/map_bg/Haven.webp)',
        'Icebox': 'url(/map_bg/Icebox.webp)',
        'Breeze': 'url(/map_bg/Breeze.webp)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [nextui()],
};
export default config;
