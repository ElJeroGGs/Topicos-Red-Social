import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { neoSchema } from "../schema/index.js";
import { env } from "../config/env.js";
import { driver } from "../config/neo4j.js";

export async function startServer() {
	// 🔥 TEST DE CONEXIÓN
	const session = driver.session();

	try {
		await session.run("RETURN 1");
		console.log("✅ Conectado a Neo4j");
	} catch (error) {
		console.error("❌ Error conectando a Neo4j:", error);
		process.exit(1);
	} finally {
		await session.close();
	}

	try {
		const server = new ApolloServer({
			schema: await neoSchema.getSchema(),
		});

		const { url } = await startStandaloneServer(server, {
			listen: { port: env.PORT },
		});

		console.log(`🚀 Server ready at ${url}`);
	} catch (error) {
		console.error("❌ Error obteniendo el esquema: ", error);
		process.exit(1);
	} finally {
		await session.close();
	}
}
