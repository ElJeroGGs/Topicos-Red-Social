import { Neo4jGraphQL } from "@neo4j/graphql";
import { driver } from "../config/neo4j.js";
import { categoryTypeDefs } from "./nodes/category.js";
import { cityTypeDefs } from "./nodes/city.js";
import { commentTypeDefs } from "./nodes/comment.js";
import { eventTypeDefs } from "./nodes/event.js";
import { groupTypeDefs } from "./nodes/group.js";
import { hashtagTypeDefs } from "./nodes/hashtag.js";
import { postTypeDefs } from "./nodes/post.js";
import { userTypeDefs } from "./nodes/user.js";

import { relationshipProps } from "./relationships/common.js";

export const typeDefs = [
	categoryTypeDefs,
	cityTypeDefs,
	commentTypeDefs,
	eventTypeDefs,
	groupTypeDefs,
	hashtagTypeDefs,
	postTypeDefs,
	userTypeDefs,
	relationshipProps,
];

export const neoSchema = new Neo4jGraphQL({
	typeDefs,
	driver,
});
