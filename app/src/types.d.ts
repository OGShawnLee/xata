import type { Nullable, Ref } from "malachite-ui/types";
import type { Action } from "svelte/action";

interface Chat {
	id: string;
	recipient: Recipient;
}

interface ChatData {
	recipient: Recipient;
	messages: Message[];
}

interface ChatContext {
	connected: Readable<boolean>;
	messages: Ref<Message[]>;
	recipient: Ref<Recipient>;
	emitMessage: (text: string) => void;
}

type Hashtags = string[] | undefined;

interface JWTPayloadState {
	id: string;
	displayName: string;
	name: string;
}

interface Message {
	id: string;
	createdAt: Date;
	user: string | undefined;
	text: Nullable<string>;
}

interface NotificationEvent {
	"from.id": string;
	"to.id": string;
	"tweet.id"?: string;
	"reply.id"?: string;
	type: NotificationEventType;
}

type NotificationEventType = "FOLLOW" | "LIKE" | "REPLY" | "RETWEET";

interface Notification {
	id: string;
	createdAt: Date;
	type: NotificationEventType;
	from: Pick<User, "displayName" | "name">;
	tweet: Pick<Tweet, "text">;
	reply?: Tweet;
}

interface Paginated<T> {
	page: {
		cursor: string;
		more: boolean;
	};
	records: T[];
}

type Quote = Pick<Tweet, "id" | "createdAt" | "text" | "user">;

type Reply = Pick<Tweet, "id" | "user"> | Tweet;

type Retweet = Pick<Tweet, "id" | "createdAt" | "quoteOf" | "text" | "user">;

interface Recipient extends User {
	createdAt: Date;
	followerCount: number;
}

interface Tweet {
	id: string;
	createdAt: Date;
	bookmarkCount: number;
	isBookmarked: boolean;
	isLiked: boolean;
	likeCount: number;
	replyCount: number;
	replyOf: Reply | undefined;
	retweetCount: number;
	retweetOf: Retweet | undefined;
	quoteOf: Quote | undefined;
	quoteCount: number;
	text: string;
	user: User;
}

// * Triggers user following feed fn
interface TweetEvent {
	"user.id": string;
	"tweet.id": string;
}

interface UnfollowEvent {
	"unfollowed.id": string;
	"unfollower.id": string;
}

interface User {
	id: string | undefined;
	description: Nullable<string>;
	displayName: Nullable<string>;
	name: Nullable<string>;
}

interface UserLike {
	id: string;
	likedAt: Date;
	user: User;
}

interface UserProfile extends User {
	createdAt: Date;
	followerCount: number;
	followingCount: number;
	location: Nullable<string>;
	isFollowed: boolean;
	tweetCount: number;
}

interface UserRetweet {
	id: string;
	retweetedAt: Date;
	user: User;
}

interface UserState extends JWTPayloadState {
	description?: Pick<User, "description">;
	location?: Nullable<string>;
}
