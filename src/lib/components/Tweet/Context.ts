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
			retweetOf: (value): value is TweetObject["retweetOf"] => {
				return value === undefined || isString(value);
			},
			user: (value): value is TweetObject["user"] => {
				return isObject(value, ["id", "displayName", "name"]);
			}
		});
	}
});
