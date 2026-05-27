import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const comentarioRouter = Router();

// Actualizacion del back para Jerobook:
// responde comentarios con la relacion original Comentario-[:RESPUESTA_A]->Comentario.
comentarioRouter.post("/:id/respuestas", requireAuth, async (req, res) => {
	const { contenido } = req.body;

	if (!contenido || typeof contenido !== "string") {
		return res.status(400).json({ error: "contenido es requerido" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (parent:Comentario {id: $commentId})
			CREATE (c:Comentario {
				id: randomUUID(),
				contenido: $contenido,
				status: "activo",
				fecha_creacion: datetime()
			})
			CREATE (u)-[:COMENTA {fecha_relacion: datetime()}]->(c)
			CREATE (c)-[:RESPUESTA_A {fecha_relacion: datetime()}]->(parent)
			RETURN c { .id, .contenido, .status, autor: u { .id, .username, .nombre, .apellido } } AS comentario
			`,
			{ userId: req.user!.sub, commentId: req.params.id, contenido: contenido.trim() },
		);

		if (!result.records[0]) {
			return res.status(404).json({ error: "Comentario o usuario no encontrado" });
		}

		res.status(201).json({
			message: "Respuesta creada",
			comentario: result.records[0].get("comentario"),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando respuesta" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// reacciones a comentarios usando (Usuario)-[:REACCIONA]->(Comentario).
comentarioRouter.post("/:id/reaccion", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (c:Comentario {id: $commentId})
			MERGE (u)-[r:REACCIONA]->(c)
			SET r.fecha_relacion = datetime()
			`,
			{ userId: req.user!.sub, commentId: req.params.id },
		);

		res.json({ message: "Reaccion registrada", reacciono: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error reaccionando comentario" });
	} finally {
		await session.close();
	}
});

comentarioRouter.delete("/:id/reaccion", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:REACCIONA]->(:Comentario {id: $commentId})
			DELETE r
			`,
			{ userId: req.user!.sub, commentId: req.params.id },
		);

		res.json({ message: "Reaccion eliminada", reacciono: false });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error eliminando reaccion" });
	} finally {
		await session.close();
	}
});
