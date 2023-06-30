import type { Chat, ChatData, Message, Paginated, Recipient } from "@types";
import type { Result } from "malachite-ui/types";
import { parse } from "devalue";
import { useAwait } from ".";

interface APIEndpoints {
	"/messages": Paginated<Chat>;
	"/messages/[uid]": ChatData & { token: string };
	"/messages/[uid]:POST": Message;
	"/messages/search/user/[query]": Recipient[];
}

export default function useAPI(
	endpoint: "/messages/[uid]",
	uid: string
): Promise<Result<APIEndpoints["/messages/[uid]"]>>;

export default function useAPI(
	endpoint: "/messages/search/user/[query]",
	query: string
): Promise<Result<APIEndpoints["/messages/search/user/[query]"]>>;

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
		if (endpoint.includes("/search") && uid) {
			pathname = pathname.replace("[query]", uid);
		}
		const response = await fetch(uid ? pathname.replace("[uid]", uid) : pathname, {
			body,
			method: endpoint.includes("POST") ? "POST" : "GET"
		});
		const text = await response.text();
		return parse(text) as APIEndpoints[T];
	});
}
