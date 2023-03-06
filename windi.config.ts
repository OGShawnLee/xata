import { defineConfig } from "vite-plugin-windicss";

export default defineConfig({
	shortcuts: {
		button: "px-8 py-2 | rounded-xl outline-none",
		"button--disabled": "opacity-50 cursor-auto",
		"button-small": "px-6 py-1.75 | rounded-full outline-none",
		"button--sky":
			"bg-sky-600 text-white font-medium hover:(bg-sky-500) focus:(ring-2 ring-sky-200)",
		"button--white":
			"bg-white text-zinc-900 font-medium hover:(opacity-85) focus:(ring-2 ring-sky-500)",
		"button-zinc":
			"px-8 py-3 | border-2 border-zinc-800 rounded-full outline-none text-zinc-100 font-medium hover:(bg-zinc-800 text-white) focus:border-white"
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
