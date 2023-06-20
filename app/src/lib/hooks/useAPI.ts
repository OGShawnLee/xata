import type { Chat, ChatData, Message, Paginated } from "@types";
import type { Result } from "malachite-ui/types";
import { parse } from "devalue";
import { useAwait } from ".";

interface APIEndpoints {
	"/messages": Paginated<Chat>;
	"/messages/[uid]": ChatData & { token: string };
	"/messages/[uid]:POST": Message;
}

export default function useAPI(
	endpoint: "/messages/[uid]",
	uid: string
): Promise<Result<APIEndpoints["/messages/[uid]"]>>;

export default function useAPI(
	endpoint: "/messages/[uid]:POST",
	uid: string,
	body: FormData
): Promise<Result<APIEndpoints["/messages/[uid]:POST"]>>;

export default function useAPI<T extends keyof APIEndpoints>(
	endpoint: T
): Promise<Result<APIEndpoints[T]>>;

export default function useAPI<T extends keyof APIEndpoints>(
	endpoint: T,
	uid?: string,
	body?: FormData
) {
	return useAwait(async () => {
		let pathname = "/api" + endpoint;
		if (endpoint.endsWith(":POST")) {
			pathname = pathname.substring(0, pathname.indexOf(":"));
		}
		const response = await fetch(uid ? pathname.replace("[uid]", uid) : pathname, {
			body,
			method: endpoint.includes("POST") ? "POST" : "GET"
		});
		const text = await response.text();
		return parse(text) as APIEndpoints[T];
	});
}
