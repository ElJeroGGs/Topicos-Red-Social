import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const eventoRouter = Router();

// Actualizacion del back para Jerobook:
// lista eventos usando relaciones originales OCURRE_EN, ASISTE, GUARDA y ORGANIZA.
eventoRouter.get("/", async (_req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (e:Evento)
			OPTIONAL MATCH (e)-[:OCURRE_EN]->(city:Ciudad)
			OPTIONAL MATCH (attendee:Usuario)-[:ASISTE]->(e)
			OPTIONAL MATCH (organizer:Usuario)-[:ORGANIZA]->(e)
			WITH e, city, count(DISTINCT attendee) AS asistentesCount, collect(DISTINCT organizer { .id, .username }) AS organizadores
			RETURN e {
				.id,
				.titulo,
				.descripcion,
				.modalidad,
				.lugar,
				.capacidad,
				.status,
				ciudad: city { .id, .nombre, .estado },
				asistentesCount: asistentesCount,
				organizadores: organizadores
			} AS evento
			LIMIT 40
			`,
		);

		res.json({ data: result.records.map((record) => normalizeCounts(record.get("evento"))) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo eventos" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// crea eventos y los relaciona con Usuario ORGANIZA y Ciudad OCURRE_EN.
eventoRouter.post("/", requireAuth, async (req, res) => {
	const {
		titulo,
		descripcion = "",
		modalidad = "presencial",
		lugar = "",
		capacidad = 50,
		ciudadId,
	} = req.body;

	if (!titulo || typeof titulo !== "string") {
		return res.status(400).json({ error: "titulo es requerido" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			CREATE (e:Evento {
				id: randomUUID(),
				titulo: $titulo,
				descripcion: $descripcion,
				fecha_inicio: datetime(),
				fecha_fin: datetime(),
				modalidad: $modalidad,
				lugar: $lugar,
				capacidad: toInteger($capacidad),
				status: "activo"
			})
			CREATE (u)-[:ORGANIZA {tipo: "organizador"}]->(e)
			WITH e
			OPTIONAL MATCH (c:Ciudad {id: $ciudadId})
			FOREACH (_ IN CASE WHEN c IS NULL THEN [] ELSE [1] END |
				MERGE (e)-[:OCURRE_EN]->(c)
			)
			RETURN e {
				.id,
				.titulo,
				.descripcion,
				.modalidad,
				.lugar,
				.capacidad,
				.status,
				ciudad: c { .id, .nombre, .estado, .pais }
			} AS evento
			`,
			{
				userId: req.user!.sub,
				titulo: titulo.trim(),
				descripcion,
				modalidad,
				lugar,
				capacidad,
				ciudadId: ciudadId ?? null,
			},
		);

		res.status(201).json({
			message: "Evento creado correctamente",
			evento: normalizeCounts(result.records[0].get("evento")),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando evento" });
	} finally {
		await session.close();
	}
});

eventoRouter.post("/:id/asistir", requireAuth, async (req, res) => {
	await toggleEventRelation(req, res, "ASISTE", "asistente", "Asistencia registrada");
});

eventoRouter.delete("/:id/asistir", requireAuth, async (req, res) => {
	await deleteEventRelation(req, res, "ASISTE", "Asistencia eliminada");
});

eventoRouter.post("/:id/guardar", requireAuth, async (req, res) => {
	await toggleEventRelation(req, res, "GUARDA", "guardado", "Evento guardado");
});

eventoRouter.delete("/:id/guardar", requireAuth, async (req, res) => {
	await deleteEventRelation(req, res, "GUARDA", "Evento quitado de guardados");
});

async function toggleEventRelation(
	req: any,
	res: any,
	relation: string,
	tipo: string,
	message: string,
) {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (e:Evento {id: $eventId})
			MERGE (u)-[r:${relation}]->(e)
			SET r.tipo = $tipo
			RETURN e.id AS eventId
			`,
			{ userId: req.user!.sub, eventId: req.params.id, tipo },
		);

		if (!result.records[0]) {
			return res.status(404).json({ error: "Evento o usuario no encontrado" });
		}

		res.json({ message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando evento" });
	} finally {
		await session.close();
	}
}

async function deleteEventRelation(req: any, res: any, relation: string, message: string) {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:${relation}]->(:Evento {id: $eventId})
			DELETE r
			`,
			{ userId: req.user!.sub, eventId: req.params.id },
		);

		res.json({ message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando evento" });
	} finally {
		await session.close();
	}
}

function normalizeCounts(evento: any) {
	return {
		...evento,
		asistentesCount: evento.asistentesCount?.toNumber?.() ?? evento.asistentesCount ?? 0,
		capacidad: evento.capacidad?.toNumber?.() ?? evento.capacidad,
	};
}
