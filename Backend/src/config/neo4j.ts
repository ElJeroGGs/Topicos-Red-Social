import neo4j from "neo4j-driver";
import { env } from "./env.js";

export const driver = neo4j.driver(
	env.NEO4J_URI,
	neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
);
