import { z } from "zod";

export const error_message = {
	invalid_type: (name: string, type: string) => {
		return `${name} must be ${type}`;
	},
	min: (name: string, amount: number) => {
		const char = amount === 1 ? "character" : "characters";
		return `${name} must be at least ${amount} ${char} long.`;
	},
	max: (name: string, amount: number) => {
		const char = amount === 1 ? "character" : "characters";
		return `${name} must be less than ${amount} ${char} long.`;
	},
	required: (name: string) => {
		return `${name} is required.`;
	},
	duplicate: (name: string) => {
		return `${name} already in use.`;
	}
};

export const user_schema = z.object({
	display_name: z
		.string({
			required_error: error_message.required("Username"),
			invalid_type_error: error_message.invalid_type("Username", "string")
		})
		.min(1, error_message.min("Username", 1))
		.max(16, error_message.max("Username", 16))
		.trim(),
	email: z
		.string({
			required_error: error_message.required("Email"),
			invalid_type_error: error_message.invalid_type("Email", "string")
		})
		.min(1, error_message.min("Email", 1))
		.max(64, error_message.max("Email", 64))
		.email("Please type a valid email.")
		.trim(),
	name: z
		.string({
			required_error: error_message.required("Name"),
			invalid_type_error: error_message.invalid_type("Name", "string")
		})
		.min(1, error_message.min("Name", 1))
		.max(50, error_message.max("Name", 50))
		.trim(),
	password: z
		.string({
			required_error: error_message.required("Password"),
			invalid_type_error: error_message.invalid_type("Password", "string")
		})
		.min(8, error_message.min("Password", 8))
		.max(80, error_message.max("Password", 80))
		.trim()
});
