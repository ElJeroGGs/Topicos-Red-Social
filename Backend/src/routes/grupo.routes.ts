import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const grupoRouter = Router();

// Actualizacion del back para Jerobook:
// lista grupos del modelo original junto con miembros y admins.
grupoRouter.get("/", async (_req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (g:Grupo)
			OPTIONAL MATCH (member:Usuario)-[:PERTENECE_A]->(g)
			OPTIONAL MATCH (admin:Usuario)-[:ADMINISTRA]->(g)
			WITH g, count(DISTINCT member) AS miembrosCount, collect(DISTINCT admin { .id, .username }) AS admins
			RETURN g {
				.id,
				.nombre,
				.descripcion,
				.privacidad,
				.status,
				miembrosCount: miembrosCount,
				admins: admins
			} AS grupo
			ORDER BY miembrosCount DESC
			LIMIT 40
			`,
		);

		res.json({ data: result.records.map((record) => normalizeCounts(record.get("grupo"))) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo grupos" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// crea grupos sin cambiar el modelo original, usando ADMINISTRA y PERTENECE_A.
grupoRouter.post("/", requireAuth, async (req, res) => {
	const { nombre, descripcion = "", privacidad = "publico" } = req.body;

	if (!nombre || typeof nombre !== "string") {
		return res.status(400).json({ error: "nombre es requerido" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			CREATE (g:Grupo {
				id: randomUUID(),
				nombre: $nombre,
				descripcion: $descripcion,
				privacidad: $privacidad,
				fecha_creacion: datetime(),
				status: "activo"
			})
			CREATE (u)-[:ADMINISTRA]->(g)
			CREATE (u)-[:PERTENECE_A {fecha_relacion: datetime()}]->(g)
			RETURN g { .id, .nombre, .descripcion, .privacidad, .status, miembrosCount: 1 } AS grupo
			`,
			{ userId: req.user!.sub, nombre: nombre.trim(), descripcion, privacidad },
		);

		res.status(201).json({
			message: "Grupo creado correctamente",
			grupo: normalizeCounts(result.records[0].get("grupo")),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando grupo" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// usa la relacion original (Usuario)-[:PERTENECE_A]->(Grupo).
grupoRouter.post("/:id/unirse", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (g:Grupo {id: $groupId})
			MERGE (u)-[r:PERTENECE_A]->(g)
			ON CREATE SET r.fecha_relacion = datetime()
			RETURN g { .id, .nombre, .descripcion, .privacidad, .status } AS grupo
			`,
			{ userId: req.user!.sub, groupId: req.params.id },
		);

		if (!result.records[0]) {
			return res.status(404).json({ error: "Grupo o usuario no encontrado" });
		}

		res.json({ message: "Te uniste al grupo", grupo: result.records[0].get("grupo") });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error uniendose al grupo" });
	} finally {
		await session.close();
	}
});

grupoRouter.delete("/:id/unirse", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:PERTENECE_A]->(:Grupo {id: $groupId})
			DELETE r
			`,
			{ userId: req.user!.sub, groupId: req.params.id },
		);

		res.json({ message: "Saliste del grupo" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error saliendo del grupo" });
	} finally {
		await session.close();
	}
});

function normalizeCounts(grupo: any) {
	return {
		...grupo,
		miembrosCount: grupo.miembrosCount?.toNumber?.() ?? grupo.miembrosCount ?? 0,
	};
}
