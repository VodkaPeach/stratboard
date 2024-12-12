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
        'Abyss': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Abyss.webp)',
        'Ascent': 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/map_bg/Ascent.webp)',
        'Bind': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Bind.webp)',
        'Fracture': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Fracture.webp)',
        'Lotus': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Lotus.webp)',
        'Split': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Split.webp)',
        'Sunset': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Sunset.webp)',
        'Pearl': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Pearl.webp)',
        'Haven': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Haven.webp)',
        'Icebox': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Icebox.webp)',
        'Breeze': 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/map_bg/Breeze.webp)',
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
