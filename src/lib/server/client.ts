import * as dotenv from "dotenv";
import { getXataClient } from "$lib/server/xata";

dotenv.config();
export default getXataClient();
