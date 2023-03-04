import { writable } from "svelte/store";
import { useTweetLikesDialog } from "./useTweetLikesDialog";

export const currentUser = writable<UserState | undefined>();
export const tweetLikesDialog = useTweetLikesDialog();
