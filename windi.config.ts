import { defineConfig } from "vite-plugin-windicss";

export default defineConfig({
	shortcuts: {
		button: "h-10 min-h-10 outline-none border-2 font-medium focus:(ring-2 ring-white)",
		"button-sm": "h-8.5 min-h-8.5 | outline-none border-2 font-medium focus:(ring-2 ring-white)",
		"button-xs": "h-8 min-h-8 | outline-none border-2 font-medium focus:(ring-2 ring-white)",
		"button--danger": "hover:(bg-rose-900/50 text-rose-400 focus:ring-rose-500)",
		"button--disabled": "opacity-50 cursor-not-allowed",
		"button--sky": "bg-sky-600 border-transparent text-white hover:bg-sky-500 focus:border-black",
		"button--white":
			"bg-white border-transparent text-zinc-900 hover:opacity-90 focus:border-black",
		"button--zinc": "border-zinc-800 text-zinc-100 hover:bg-zinc-800",
	},
	theme: {
		extend: {
			colors: {
				zinc: {
					1000: "#121217",
					900: "#18181B",
					800: "#212127",
					700: "#2A2A37",
					600: "#414158",
					500: "#818198",
					400: "#9F9FAD",
					300: "#CACACE",
					200: "#D7D7DB",
					100: "#E4E4E7"
				}
			}
		},
		fontFamily: {
			poppins: ["Poppins", "sans-serif"],
			raleway: ["Raleway", "sans-serif"],
			urbanist: ["Urbanist", "sans-serif"],
			roboto: ["Roboto", "sans-serif"],
			victor: ["Victor Mono", "sans-serif"]
		}
	}
});
