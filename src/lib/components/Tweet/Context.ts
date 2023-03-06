import { isBoolean, isInterface, isNumber, isObject, isString } from "malachite-ui/predicate";
import { useContext } from "malachite-ui/hooks";
import { isDate } from "$lib/utils/predicate";

export default useContext({
	component: "tweet",
	predicate: (value): value is TweetObject => {
		return isInterface<TweetObject>(value, {
			id: isString,
			likeCount: isNumber,
			retweetCount: isNumber,
			createdAt: isDate,
			text: isString,
			isBookmarked: isBoolean,
			isLiked: isBoolean,
			quoteCount: isNumber,
			quoteOf: (value): value is TweetObject["quoteOf"] => {
				return value === undefined || isObject(value, ["id", "createdAt", "text", "user"]);
			},
			retweetOf: (value): value is TweetObject["retweetOf"] => {
				return value === undefined || isObject(value, ["id", "createdAt", "text", "user"]);
			},
			user: (value): value is TweetObject["user"] => {
				return isObject(value, ["id", "displayName", "name"]);
			}
		});
	}
});
