import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const publicacionRouter = Router();

// Actualizacion del back para Jerobook:
// lista publicaciones globales desde Neo4j para busqueda/exploracion publica.
// Esto evita depender del feed de un usuario especifico al cerrar sesion.
publicacionRouter.get("/", async (req, res) => {
	const { ciudad, hashtag, search, limit = "60" } = req.query;
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (autor:Usuario)-[:PUBLICA]->(p:Publicacion)
			OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
			OPTIONAL MATCH (p)-[:UBICADO_EN]->(ciudad:Ciudad)
			OPTIONAL MATCH (p)<-[:RESPUESTA_A]-(comentario:Comentario)
			OPTIONAL MATCH (reactor:Usuario)-[:REACCIONA]->(p)
			OPTIONAL MATCH (saver:Usuario)-[:GUARDA]->(p)
			OPTIONAL MATCH (sharer:Usuario)-[:COMPARTE]->(p)
			WITH
				p,
				autor,
				ciudad,
				collect(DISTINCT h.nombre) AS hashtags,
				count(DISTINCT comentario) AS comentariosCount,
				count(DISTINCT reactor) AS reaccionesCount,
				count(DISTINCT saver) AS guardadosCount,
				count(DISTINCT sharer) AS compartidosCount
			WITH
				p,
				autor,
				ciudad,
				hashtags,
				comentariosCount,
				reaccionesCount,
				guardadosCount,
				compartidosCount,
				replace(replace(replace(replace(replace(toLower(coalesce(p.contenido, "")), "á", "a"), "é", "e"), "í", "i"), "ó", "o"), "ú", "u") AS contenidoNormalizado,
				replace(replace(replace(replace(replace(toLower(coalesce(autor.username, "")), "á", "a"), "é", "e"), "í", "i"), "ó", "o"), "ú", "u") AS autorNormalizado,
				replace(replace(replace(replace(replace(toLower(coalesce(ciudad.nombre, "")), "á", "a"), "é", "e"), "í", "i"), "ó", "o"), "ú", "u") AS ciudadNormalizada,
				[tag IN hashtags | replace(replace(replace(replace(replace(toLower(coalesce(tag, "")), "á", "a"), "é", "e"), "í", "i"), "ó", "o"), "ú", "u")] AS hashtagsNormalizados
			WHERE
				($search IS NULL
					OR contenidoNormalizado CONTAINS $search
					OR autorNormalizado CONTAINS $search
					OR ciudadNormalizada CONTAINS $search
					OR any(tag IN hashtagsNormalizados WHERE tag CONTAINS $search))
				AND ($ciudad IS NULL OR ciudad.id = $ciudad OR ciudad.nombre = $ciudad)
				AND ($hashtag IS NULL OR any(tag IN hashtagsNormalizados WHERE tag = $hashtag))
				AND coalesce(p.status, "activo") = "activo"
				AND coalesce(p.visibilidad, "publica") IN ["publica", "publico"]
			RETURN p {
				.id,
				.contenido,
				.tipo_contenido,
				.visibilidad,
				.status,
				.fecha_creacion,
				hashtags: hashtags,
				comentariosCount: comentariosCount,
				reaccionesCount: reaccionesCount,
				guardadosCount: guardadosCount,
				compartidosCount: compartidosCount,
				reacciono: false,
				guardado: false,
				compartido: false,
				ciudad: ciudad { .id, .nombre, .estado, .pais },
				autor: autor {
					.id,
					.username,
					.nombre,
					.apellido,
					.foto_perfil_url
				}
			} AS publicacion
			ORDER BY coalesce(p.fecha_creacion, datetime("1970-01-01T00:00:00")) DESC
			LIMIT toInteger($limit)
			`,
			{
				ciudad: typeof ciudad === "string" && ciudad.trim() ? ciudad.trim() : null,
				hashtag:
					typeof hashtag === "string" && hashtag.trim()
						? normalizeSearchValue(hashtag.replace(/^#/, ""))
						: null,
				limit: Number(limit) > 0 ? Number(limit) : 60,
				search: typeof search === "string" && search.trim() ? normalizeSearchValue(search) : null,
			},
		);

		res.json({
			data: result.records.map((record) => normalizePublicacion(record.get("publicacion"))),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo publicaciones" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// crea publicaciones reales en Neo4j y las relaciona con el usuario autenticado.
// Modelo escrito: (Usuario)-[:PUBLICA]->(Publicacion).
publicacionRouter.post("/", requireAuth, async (req, res) => {
	const {
		contenido,
		tipo_contenido = "texto",
		visibilidad = "publica",
		ciudadId,
		hashtagIds = [],
		hashtagNames = [],
	} = req.body;

	if (!contenido || typeof contenido !== "string" || contenido.trim().length === 0) {
		return res.status(400).json({
			error: "contenido es requerido",
		});
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			CREATE (p:Publicacion {
				id: randomUUID(),
				contenido: $contenido,
				tipo_contenido: $tipo_contenido,
				visibilidad: $visibilidad,
				status: "activo",
				fecha_creacion: datetime()
			})
			CREATE (u)-[r:PUBLICA {fecha_relacion: datetime()}]->(p)
			RETURN p {
				.id,
				.contenido,
				.tipo_contenido,
				.visibilidad,
				.status,
				.fecha_creacion,
				hashtags: [],
				comentariosCount: 0,
				reaccionesCount: 0,
				guardadosCount: 0,
				compartidosCount: 0,
				reacciono: false,
				guardado: false,
				compartido: false,
				autor: {
					id: u.id,
					username: u.username,
					nombre: u.nombre,
					apellido: u.apellido,
					foto_perfil_url: u.foto_perfil_url
				}
			} AS publicacion
			`,
			{
				userId: req.user!.sub,
				contenido: contenido.trim(),
				tipo_contenido,
				visibilidad,
			},
		);

		const publicacion = result.records[0]?.get("publicacion");

		if (!publicacion) {
			return res.status(404).json({
				error: "Usuario no encontrado",
			});
		}

		if (ciudadId) {
			await session.run(
				`
				MATCH (p:Publicacion {id: $postId})
				MATCH (c:Ciudad {id: $ciudadId})
				MERGE (p)-[:UBICADO_EN]->(c)
				`,
				{ postId: publicacion.id, ciudadId },
			);
		}

		if (Array.isArray(hashtagIds) && hashtagIds.length > 0) {
			await session.run(
				`
				MATCH (p:Publicacion {id: $postId})
				UNWIND $hashtagIds AS hashtagId
				MATCH (h:Hashtag {id: hashtagId})
				MERGE (p)-[:TIENE]->(h)
				`,
				{ postId: publicacion.id, hashtagIds },
			);
		}

		if (Array.isArray(hashtagNames) && hashtagNames.length > 0) {
			await session.run(
				`
				MATCH (p:Publicacion {id: $postId})
				UNWIND $hashtagNames AS hashtagName
				MERGE (h:Hashtag {nombre: hashtagName})
				ON CREATE SET h.id = randomUUID(), h.fecha_creacion = datetime()
				MERGE (p)-[:TIENE]->(h)
				`,
				{
					postId: publicacion.id,
					hashtagNames: hashtagNames
						.filter((name: unknown) => typeof name === "string")
						.map((name: string) => name.trim())
						.filter(Boolean),
				},
			);
		}

		const enrichedResult = await session.run(
			`
			MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion {id: $postId})
			OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
			OPTIONAL MATCH (p)-[:UBICADO_EN]->(ciudad:Ciudad)
			WITH u, p, ciudad, collect(DISTINCT h.nombre) AS hashtags
			RETURN p {
				.id,
				.contenido,
				.tipo_contenido,
				.visibilidad,
				.status,
				.fecha_creacion,
				hashtags: hashtags,
				comentariosCount: 0,
				reaccionesCount: 0,
				guardadosCount: 0,
				compartidosCount: 0,
				reacciono: false,
				guardado: false,
				compartido: false,
				ciudad: ciudad { .id, .nombre, .estado, .pais },
				autor: {
					id: u.id,
					username: u.username,
					nombre: u.nombre,
					apellido: u.apellido,
					foto_perfil_url: u.foto_perfil_url
				}
			} AS publicacion
			`,
			{ postId: publicacion.id },
		);
		const enrichedPost = enrichedResult.records[0]?.get("publicacion") ?? publicacion;

		res.status(201).json({
			message: "Publicacion creada correctamente",
			publicacion: {
				...enrichedPost,
				comentariosCount: 0,
				reaccionesCount: 0,
				guardadosCount: 0,
				compartidosCount: 0,
				reacciono: false,
				guardado: false,
				compartido: false,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error creando publicacion",
		});
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// guarda publicaciones usando (Usuario)-[:GUARDA]->(Publicacion).
publicacionRouter.post("/:id/guardar", requireAuth, async (req, res) => {
	await togglePostRelation(req, res, "GUARDA", "guardado", "Publicacion guardada correctamente");
});

publicacionRouter.delete("/:id/guardar", requireAuth, async (req, res) => {
	await deletePostRelation(req, res, "GUARDA", "Publicacion quitada de guardados");
});

// Actualizacion del back para Jerobook:
// comparte publicaciones usando (Usuario)-[:COMPARTE]->(Publicacion).
publicacionRouter.post("/:id/compartir", requireAuth, async (req, res) => {
	await togglePostRelation(
		req,
		res,
		"COMPARTE",
		"compartido",
		"Publicacion compartida correctamente",
	);
});

// Actualizacion del back para Jerobook:
// obtiene comentarios asociados a una publicacion.
// Modelo leido: (Comentario)-[:RESPUESTA_A]->(Publicacion).
publicacionRouter.get("/:id/comentarios", async (req, res) => {
	const { id } = req.params;
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (:Publicacion {id: $postId})
			OPTIONAL MATCH (c:Comentario)-[:RESPUESTA_A]->(:Publicacion {id: $postId})
			OPTIONAL MATCH (autor:Usuario)-[:COMENTA]->(c)
			OPTIONAL MATCH (respuesta:Comentario)-[:RESPUESTA_A]->(c)
			OPTIONAL MATCH (reaccionUsuario:Usuario)-[:REACCIONA]->(c)
			WITH c, autor, count(DISTINCT respuesta) AS respuestasCount, count(DISTINCT reaccionUsuario) AS reaccionesCount
			WHERE c IS NOT NULL
			RETURN c {
				.id,
				.contenido,
				.status,
				respuestasCount: respuestasCount,
				reaccionesCount: reaccionesCount,
				autor: {
					id: autor.id,
					username: autor.username,
					nombre: autor.nombre,
					apellido: autor.apellido,
					foto_perfil_url: autor.foto_perfil_url
				}
			} AS comentario
			LIMIT 30
			`,
			{ postId: id },
		);

		res.json({
			data: result.records.map((record) => {
				const comentario = record.get("comentario");

				return {
					...comentario,
					respuestasCount:
						comentario.respuestasCount?.toNumber?.() ?? comentario.respuestasCount ?? 0,
					reaccionesCount:
						comentario.reaccionesCount?.toNumber?.() ?? comentario.reaccionesCount ?? 0,
				};
			}),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error obteniendo comentarios",
		});
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// crea comentarios reales en Neo4j y los relaciona con usuario y publicacion.
// Modelo escrito: (Usuario)-[:COMENTA]->(Comentario)-[:RESPUESTA_A]->(Publicacion).
publicacionRouter.post("/:id/comentarios", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { contenido } = req.body;

	if (!contenido || typeof contenido !== "string" || contenido.trim().length === 0) {
		return res.status(400).json({
			error: "contenido es requerido",
		});
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (p:Publicacion {id: $postId})
			CREATE (c:Comentario {
				id: randomUUID(),
				contenido: $contenido,
				status: "activo",
				fecha_creacion: datetime()
			})
			CREATE (u)-[uc:COMENTA {fecha_relacion: datetime()}]->(c)
			CREATE (c)-[cp:RESPUESTA_A {fecha_relacion: datetime()}]->(p)
			RETURN c {
				.id,
				.contenido,
				.status,
				autor: {
					id: u.id,
					username: u.username,
					nombre: u.nombre,
					apellido: u.apellido,
					foto_perfil_url: u.foto_perfil_url
				}
			} AS comentario
			`,
			{
				userId: req.user!.sub,
				postId: id,
				contenido: contenido.trim(),
			},
		);

		const comentario = result.records[0]?.get("comentario");

		if (!comentario) {
			return res.status(404).json({
				error: "Publicacion o usuario no encontrado",
			});
		}

		res.status(201).json({
			message: "Comentario creado correctamente",
			comentario,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error creando comentario",
		});
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// crea o actualiza una reaccion del usuario autenticado sobre una publicacion.
// Modelo escrito: (Usuario)-[:REACCIONA {tipo: "like"}]->(Publicacion).
publicacionRouter.post("/:id/reaccion", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { tipo = "like" } = req.body;
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			MATCH (p:Publicacion {id: $postId})
			MERGE (u)-[r:REACCIONA]->(p)
			SET r.tipo = $tipo
			RETURN p.id AS postId
			`,
			{ userId: req.user!.sub, postId: id, tipo },
		);

		if (!result.records[0]) {
			return res.status(404).json({
				error: "Publicacion o usuario no encontrado",
			});
		}

		res.json({
			message: "Reaccion registrada correctamente",
			reacciono: true,
			tipo,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error registrando reaccion",
		});
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// elimina la reaccion del usuario autenticado sobre una publicacion.
publicacionRouter.delete("/:id/reaccion", requireAuth, async (req, res) => {
	const { id } = req.params;
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:REACCIONA]->(:Publicacion {id: $postId})
			DELETE r
			`,
			{ userId: req.user!.sub, postId: id },
		);

		res.json({
			message: "Reaccion eliminada correctamente",
			reacciono: false,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error eliminando reaccion",
		});
	} finally {
		await session.close();
	}
});

async function togglePostRelation(
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
			MATCH (p:Publicacion {id: $postId})
			MERGE (u)-[r:${relation}]->(p)
			SET r.tipo = $tipo
			RETURN p.id AS postId
			`,
			{ userId: req.user!.sub, postId: req.params.id, tipo },
		);

		if (!result.records[0]) {
			return res.status(404).json({ error: "Publicacion o usuario no encontrado" });
		}

		res.json({ message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando publicacion" });
	} finally {
		await session.close();
	}
}

async function deletePostRelation(req: any, res: any, relation: string, message: string) {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:${relation}]->(:Publicacion {id: $postId})
			DELETE r
			`,
			{ userId: req.user!.sub, postId: req.params.id },
		);

		res.json({ message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando publicacion" });
	} finally {
		await session.close();
	}
}

function normalizePublicacion(publicacion: any) {
	return {
		...publicacion,
		fecha_creacion: normalizeNeo4jDate(publicacion.fecha_creacion),
		comentariosCount: publicacion.comentariosCount?.toNumber?.() ?? publicacion.comentariosCount ?? 0,
		reaccionesCount: publicacion.reaccionesCount?.toNumber?.() ?? publicacion.reaccionesCount ?? 0,
		guardadosCount: publicacion.guardadosCount?.toNumber?.() ?? publicacion.guardadosCount ?? 0,
		compartidosCount: publicacion.compartidosCount?.toNumber?.() ?? publicacion.compartidosCount ?? 0,
	};
}

function normalizeNeo4jDate(value: any) {
	if (!value) return null;
	if (typeof value === "string") return value;
	if (typeof value.toString === "function") return value.toString();
	return value;
}

function normalizeSearchValue(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}
