import { z } from "zod";

export const errorMessage = {
	invalidType: (name: string, type: string) => {
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

export const folderSchema = z.object({
	name: z
		.string({
			required_error: errorMessage.required("Name"),
			invalid_type_error: errorMessage.invalidType("Name", "string")
		})
		.min(1, errorMessage.min("Name", 1))
		.max(50, errorMessage.max("Name", 50)),
	description: z
		.string({
			invalid_type_error: errorMessage.invalidType("Description", "string")
		})
		.max(12, errorMessage.max("Description", 12))
		.optional()
});

export const messageSchema = z
	.string({
		required_error: errorMessage.required("Message"),
		invalid_type_error: errorMessage.invalidType("Message", "string")
	})
	.min(1, errorMessage.min("Message", 1))
	.max(280, errorMessage.max("Message", 280))
	.trim();

export const notificationSchema = z.object({
	type: z.enum(["FOLLOW", "LIKE", "REPLY", "RETWEET"]),
	"from.id": z.string(),
	"to.id": z.string(),
	"tweet.id": z.string().optional(),
	"reply.id": z.string().optional()
});

export const tweetSchema = z
	.string({
		required_error: errorMessage.required("Tweet"),
		invalid_type_error: errorMessage.invalidType("Tweet", "string")
	})
	.min(1, errorMessage.min("Tweet", 1))
	.max(280, errorMessage.max("Tweet", 280))
	.trim();

export const tweetEventSchema = z.object({
	"tweet.id": z.string(),
	"user.id": z.string()
});

export const unfollowEventSchema = z.object({
	"unfollowed.id": z.string(),
	"unfollower.id": z.string()
});

export const userSchema = z.object({
	displayName: z
		.string({
			required_error: errorMessage.required("Username"),
			invalid_type_error: errorMessage.invalidType("Username", "string")
		})
		.min(1, errorMessage.min("Username", 1))
		.max(16, errorMessage.max("Username", 16))
		.trim(),
	description: z
		.string({
			required_error: errorMessage.required("Description"),
			invalid_type_error: errorMessage.invalidType("Description", "string")
		})
		.max(160, errorMessage.max("Description", 160))
		.trim(),
	location: z
		.string({
			required_error: errorMessage.required("Location"),
			invalid_type_error: errorMessage.invalidType("Location", "string")
		})
		.max(30, errorMessage.max("Location", 30))
		.trim(),
	email: z
		.string({
			required_error: errorMessage.required("Email"),
			invalid_type_error: errorMessage.invalidType("Email", "string")
		})
		.min(1, errorMessage.min("Email", 1))
		.max(64, errorMessage.max("Email", 64))
		.email("Please type a valid email.")
		.trim(),
	name: z
		.string({
			required_error: errorMessage.required("Name"),
			invalid_type_error: errorMessage.invalidType("Name", "string")
		})
		.min(1, errorMessage.min("Name", 1))
		.max(50, errorMessage.max("Name", 50))
		.trim(),
	password: z
		.string({
			required_error: errorMessage.required("Password"),
			invalid_type_error: errorMessage.invalidType("Password", "string")
		})
		.min(8, errorMessage.min("Password", 8))
		.max(80, errorMessage.max("Password", 80))
		.trim()
});
