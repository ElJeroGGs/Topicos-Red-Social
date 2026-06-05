import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

type NeoMap = Record<string, any>;

export const usuarioRouter = Router();

// Actualizacion del back para Jerobook:
// entrega sugerencias reales de usuarios desde Neo4j sin modificar el modelo original.
usuarioRouter.get("/sugerencias", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario)
			WHERE u.id <> $userId
				AND NOT EXISTS { MATCH (:Usuario {id: $userId})-[:SIGUE]->(u) }
				AND NOT EXISTS { MATCH (:Usuario {id: $userId})-[:BLOQUEA]->(u) }
			OPTIONAL MATCH (u)-[:PUBLICA]->(p:Publicacion)
			OPTIONAL MATCH (follower:Usuario)-[:SIGUE]->(u)
			WITH u, count(DISTINCT p) AS postsCount, count(DISTINCT follower) AS followersCount
			RETURN u {
				.id,
				.username,
				.nombre,
				.apellido,
				.bio,
				.foto_perfil_url,
				postsCount: postsCount,
				followersCount: followersCount
			} AS usuario
			ORDER BY followersCount DESC, postsCount DESC
			LIMIT 12
			`,
			{ userId: req.user!.sub },
		);

		res.json({
			data: result.records.map((record) => normalizeUserStats(record.get("usuario"))),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo sugerencias" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// resume las relaciones personales del usuario autenticado para que el front sepa que ya guardo,
// asistio, organizo, siguio o bloqueo sin consultar Neo4j directamente desde el navegador.
usuarioRouter.get("/me/social", requireAuth, async (req, res) => {
	const userId = req.user!.sub;
	const session = driver.session();

	try {
		const profileResult = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			OPTIONAL MATCH (u)-[:VIVE_EN]->(actual:Ciudad)
			OPTIONAL MATCH (u)-[:NACIO_EN]->(nacimiento:Ciudad)
			RETURN u {
				.id,
				.username,
				.nombre,
				.apellido,
				.correo,
				.bio,
				.foto_perfil_url,
				.status,
				ciudadActual: actual { .id, .nombre, .estado, .pais },
				ciudadNacimiento: nacimiento { .id, .nombre, .estado, .pais }
			} AS profile
			`,
			{ userId },
		);

		const profile = profileResult.records[0]?.get("profile");

		if (!profile) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		const grupos = await getUserGroups(session, userId);
		const eventosAsiste = await getUserEvents(session, userId, "ASISTE");
		const eventosGuardados = await getUserEvents(session, userId, "GUARDA");
		const eventosOrganizados = await getUserEvents(session, userId, "ORGANIZA");
		const publicacionesGuardadas = await getUserPosts(session, userId, "GUARDA");
		const publicacionesCompartidas = await getUserPosts(session, userId, "COMPARTE");
		const siguiendo = await getRelatedUsers(session, userId, "following");
		const seguidores = await getRelatedUsers(session, userId, "followers");
		const bloqueados = await getBlockedUsers(session, userId);

		res.json({
			profile: normalizeProfile(profile),
			grupos,
			eventosAsiste,
			eventosGuardados,
			eventosOrganizados,
			publicacionesGuardadas,
			publicacionesCompartidas,
			siguiendo,
			seguidores,
			bloqueados,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo resumen social" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// actualiza datos editables del perfil sin tocar password ni campos de autenticacion.
usuarioRouter.patch("/me/perfil", requireAuth, async (req, res) => {
	const { nombre, apellido, bio, foto_perfil_url } = req.body;
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			SET
				u.nombre = coalesce($nombre, u.nombre),
				u.apellido = coalesce($apellido, u.apellido),
				u.bio = $bio,
				u.foto_perfil_url = $foto_perfil_url
			RETURN u {
				.id,
				.username,
				.nombre,
				.apellido,
				.correo,
				.bio,
				.foto_perfil_url,
				.status
			} AS user
			`,
			{
				userId: req.user!.sub,
				nombre: cleanOptionalText(nombre),
				apellido: cleanOptionalText(apellido),
				bio: cleanOptionalText(bio),
				foto_perfil_url: cleanOptionalText(foto_perfil_url),
			},
		);

		const user = result.records[0]?.get("user");

		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json({ message: "Perfil actualizado", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando perfil" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// escribe VIVE_EN y NACIO_EN en Neo4j desde la pantalla de perfil.
usuarioRouter.patch("/me/ciudades", requireAuth, async (req, res) => {
	const { ciudadActualId, ciudadNacimientoId } = req.body;
	const session = driver.session();

	try {
		if (ciudadActualId !== undefined) {
			await setCityRelation(session, req.user!.sub, ciudadActualId, "VIVE_EN");
		}

		if (ciudadNacimientoId !== undefined) {
			await setCityRelation(session, req.user!.sub, ciudadNacimientoId, "NACIO_EN");
		}

		res.json({ message: "Ciudades del perfil actualizadas" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error actualizando ciudades" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// usa la relacion original (Usuario)-[:SIGUE]->(Usuario).
usuarioRouter.post("/:id/seguir", requireAuth, async (req, res) => {
	const targetId = req.params.id;

	if (targetId === req.user!.sub) {
		return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (me:Usuario {id: $userId})
			MATCH (target:Usuario {id: $targetId})
			MERGE (me)-[r:SIGUE]->(target)
				ON CREATE SET r.fecha_relacion = datetime()
				OPTIONAL MATCH (target)-[:PUBLICA]->(p:Publicacion)
				OPTIONAL MATCH (follower:Usuario)-[:SIGUE]->(target)
				WITH target, count(DISTINCT p) AS postsCount, count(DISTINCT follower) AS followersCount
				RETURN target {
					.id,
					.username,
					.nombre,
					.apellido,
					.bio,
					.foto_perfil_url,
					postsCount: postsCount,
					followersCount: followersCount
				} AS usuario
			`,
			{ userId: req.user!.sub, targetId },
		);

		const usuario = result.records[0]?.get("usuario");

		if (!usuario) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json({ message: "Usuario seguido", usuario: normalizeUserStats(usuario) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error siguiendo usuario" });
	} finally {
		await session.close();
	}
});

usuarioRouter.delete("/:id/seguir", requireAuth, async (req, res) => {
	const session = driver.session();

	try {
		await session.run(
			`
			MATCH (:Usuario {id: $userId})-[r:SIGUE]->(:Usuario {id: $targetId})
			DELETE r
			`,
			{ userId: req.user!.sub, targetId: req.params.id },
		);

		res.json({ message: "Usuario dejado de seguir" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error dejando de seguir usuario" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// usa la relacion original (Usuario)-[:BLOQUEA]->(Usuario).
usuarioRouter.post("/:id/bloquear", requireAuth, async (req, res) => {
	const targetId = req.params.id;

	if (targetId === req.user!.sub) {
		return res.status(400).json({ error: "No puedes bloquearte a ti mismo" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (me:Usuario {id: $userId})
			MATCH (target:Usuario {id: $targetId})
			MERGE (me)-[r:BLOQUEA]->(target)
			ON CREATE SET r.fecha_relacion = datetime()
			WITH me, target
			OPTIONAL MATCH (me)-[s:SIGUE]->(target)
			DELETE s
			RETURN target.id AS targetId
			`,
			{ userId: req.user!.sub, targetId },
		);

		if (!result.records[0]) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json({ message: "Usuario bloqueado" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error bloqueando usuario" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// feed personalizado usando PUBLICA, SIGUE, TIENE, UBICADO_EN, RESPUESTA_A,
// REACCIONA, GUARDA y COMPARTE.
usuarioRouter.get("/:id/feed", async (req, res) => {
	const session = driver.session();
	const { id } = req.params;

	try {
		const result = await session.run(
			`
			MATCH (viewer:Usuario {id: $id})
			MATCH (autor:Usuario)-[:PUBLICA]->(p:Publicacion)
			WHERE autor.id = viewer.id OR EXISTS { MATCH (viewer)-[:SIGUE]->(autor) }
			OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
			OPTIONAL MATCH (p)-[:UBICADO_EN]->(ciudad:Ciudad)
			OPTIONAL MATCH (p)<-[:RESPUESTA_A]-(comentario:Comentario)
			OPTIONAL MATCH (reactor:Usuario)-[:REACCIONA]->(p)
			OPTIONAL MATCH (saver:Usuario)-[:GUARDA]->(p)
			OPTIONAL MATCH (sharer:Usuario)-[:COMPARTE]->(p)
			OPTIONAL MATCH (viewer)-[myReaction:REACCIONA]->(p)
			OPTIONAL MATCH (viewer)-[mySave:GUARDA]->(p)
			OPTIONAL MATCH (viewer)-[myShare:COMPARTE]->(p)
			WITH
				p,
				autor,
				ciudad,
				collect(DISTINCT h.nombre) AS hashtags,
				count(DISTINCT comentario) AS comentariosCount,
				count(DISTINCT reactor) AS reaccionesCount,
				count(DISTINCT saver) AS guardadosCount,
				count(DISTINCT sharer) AS compartidosCount,
				count(DISTINCT myReaction) > 0 AS reacciono,
				count(DISTINCT mySave) > 0 AS guardado,
				count(DISTINCT myShare) > 0 AS compartido
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
				reacciono: reacciono,
				guardado: guardado,
				compartido: compartido,
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
			LIMIT 40
			`,
			{ id },
		);

		res.json({
			data: result.records.map((record) => normalizePost(record.get("publicacion"))),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo feed del usuario" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// perfil publico de un usuario con sus publicaciones, grupos y eventos visibles.
usuarioRouter.get("/:id/perfil", async (req, res) => {
	const session = driver.session();
	const { id } = req.params;

	try {
		const profileResult = await session.run(
			`
			MATCH (u:Usuario {id: $id})
			OPTIONAL MATCH (u)-[:VIVE_EN]->(actual:Ciudad)
			OPTIONAL MATCH (u)-[:NACIO_EN]->(nacimiento:Ciudad)
				OPTIONAL MATCH (u)<-[:SIGUE]-(follower:Usuario)
				OPTIONAL MATCH (u)-[:SIGUE]->(following:Usuario)
				WITH
					u,
					actual,
					nacimiento,
					count(DISTINCT follower) AS followersCount,
					count(DISTINCT following) AS followingCount
				RETURN u {
					.id,
					.username,
				.nombre,
				.apellido,
				.bio,
				.foto_perfil_url,
				.status,
				ciudadActual: actual { .id, .nombre, .estado, .pais },
				ciudadNacimiento: nacimiento { .id, .nombre, .estado, .pais }
				} AS profile,
				followersCount,
				followingCount
			`,
			{ id },
		);

		const record = profileResult.records[0];

		if (!record) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		const publicaciones = await getOwnPosts(session, id);
		const grupos = await getUserGroups(session, id);
		const eventos = await getUserEvents(session, id, "ORGANIZA");

		res.json({
			profile: normalizeProfile(record.get("profile")),
			followersCount: toNumber(record.get("followersCount")),
			followingCount: toNumber(record.get("followingCount")),
			publicaciones,
			grupos,
			eventos,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo perfil" });
	} finally {
		await session.close();
	}
});

async function setCityRelation(
	session: any,
	userId: string,
	cityId: unknown,
	relation: "VIVE_EN" | "NACIO_EN",
) {
	await session.run(
		`
		MATCH (u:Usuario {id: $userId})
		OPTIONAL MATCH (u)-[old:${relation}]->(:Ciudad)
		DELETE old
		WITH u
		OPTIONAL MATCH (c:Ciudad {id: $cityId})
		FOREACH (_ IN CASE WHEN c IS NULL THEN [] ELSE [1] END |
			MERGE (u)-[:${relation}]->(c)
		)
		RETURN u.id AS userId
		`,
		{ userId, cityId: cleanOptionalText(cityId) },
	);
}

async function getUserGroups(session: any, userId: string) {
	const result = await session.run(
		`
			MATCH (:Usuario {id: $userId})-[:PERTENECE_A]->(g:Grupo)
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
		ORDER BY g.nombre
		`,
		{ userId },
	);

	return result.records.map((record: any) => normalizeGroup(record.get("grupo")));
}

async function getUserEvents(
	session: any,
	userId: string,
	relation: "ASISTE" | "GUARDA" | "ORGANIZA",
) {
	const result = await session.run(
		`
		MATCH (:Usuario {id: $userId})-[:${relation}]->(e:Evento)
			OPTIONAL MATCH (e)-[:OCURRE_EN]->(ciudad:Ciudad)
			OPTIONAL MATCH (attendee:Usuario)-[:ASISTE]->(e)
			OPTIONAL MATCH (organizer:Usuario)-[:ORGANIZA]->(e)
			WITH e, ciudad, count(DISTINCT attendee) AS asistentesCount, collect(DISTINCT organizer { .id, .username }) AS organizadores
			RETURN e {
				.id,
				.titulo,
			.descripcion,
			.modalidad,
			.lugar,
			.capacidad,
				.status,
				.fecha_inicio,
				.fecha_fin,
				ciudad: ciudad { .id, .nombre, .estado, .pais },
				asistentesCount: asistentesCount,
				organizadores: organizadores
			} AS evento
		ORDER BY coalesce(e.fecha_inicio, datetime("1970-01-01T00:00:00")) DESC
		`,
		{ userId },
	);

	return result.records.map((record: any) => normalizeEvent(record.get("evento")));
}

async function getUserPosts(session: any, userId: string, relation: "GUARDA" | "COMPARTE") {
	const result = await session.run(
		`
		MATCH (viewer:Usuario {id: $userId})-[:${relation}]->(p:Publicacion)
		MATCH (autor:Usuario)-[:PUBLICA]->(p)
		OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
		OPTIONAL MATCH (p)-[:UBICADO_EN]->(ciudad:Ciudad)
		OPTIONAL MATCH (p)<-[:RESPUESTA_A]-(comentario:Comentario)
		OPTIONAL MATCH (reactor:Usuario)-[:REACCIONA]->(p)
		OPTIONAL MATCH (saver:Usuario)-[:GUARDA]->(p)
		OPTIONAL MATCH (sharer:Usuario)-[:COMPARTE]->(p)
			OPTIONAL MATCH (viewer)-[myReaction:REACCIONA]->(p)
			OPTIONAL MATCH (viewer)-[mySave:GUARDA]->(p)
			OPTIONAL MATCH (viewer)-[myShare:COMPARTE]->(p)
			WITH
				p,
				autor,
				ciudad,
				collect(DISTINCT h.nombre) AS hashtags,
				count(DISTINCT comentario) AS comentariosCount,
				count(DISTINCT reactor) AS reaccionesCount,
				count(DISTINCT saver) AS guardadosCount,
				count(DISTINCT sharer) AS compartidosCount,
				count(DISTINCT myReaction) > 0 AS reacciono,
				count(DISTINCT mySave) > 0 AS guardado,
				count(DISTINCT myShare) > 0 AS compartido
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
				reacciono: reacciono,
				guardado: guardado,
				compartido: compartido,
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
		`,
		{ userId },
	);

	return result.records.map((record: any) => normalizePost(record.get("publicacion")));
}

async function getOwnPosts(session: any, userId: string) {
	const result = await session.run(
		`
		MATCH (autor:Usuario {id: $userId})-[:PUBLICA]->(p:Publicacion)
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
		LIMIT 30
		`,
		{ userId },
	);

	return result.records.map((record: any) => normalizePost(record.get("publicacion")));
}

async function getRelatedUsers(session: any, userId: string, mode: "following" | "followers") {
	const direction =
		mode === "following"
			? "MATCH (:Usuario {id: $userId})-[:SIGUE]->(u:Usuario)"
			: "MATCH (:Usuario {id: $userId})<-[:SIGUE]-(u:Usuario)";

	const result = await session.run(
		`
			${direction}
			OPTIONAL MATCH (u)-[:PUBLICA]->(p:Publicacion)
			OPTIONAL MATCH (follower:Usuario)-[:SIGUE]->(u)
			WITH u, count(DISTINCT p) AS postsCount, count(DISTINCT follower) AS followersCount
			RETURN u {
				.id,
				.username,
			.nombre,
				.apellido,
				.bio,
				.foto_perfil_url,
				postsCount: postsCount,
				followersCount: followersCount
			} AS usuario
		ORDER BY u.username
		`,
		{ userId },
	);

	return result.records.map((record: any) => normalizeUserStats(record.get("usuario")));
}

async function getBlockedUsers(session: any, userId: string) {
	const result = await session.run(
		`
		MATCH (:Usuario {id: $userId})-[:BLOQUEA]->(u:Usuario)
		RETURN u { .id, .username, .nombre, .apellido } AS usuario
		ORDER BY u.username
		`,
		{ userId },
	);

	return result.records.map((record: any) => record.get("usuario"));
}

function normalizeProfile(profile: NeoMap) {
	return {
		...profile,
		ciudadActual: removeNullMap(profile.ciudadActual),
		ciudadNacimiento: removeNullMap(profile.ciudadNacimiento),
	};
}

function normalizeUserStats(usuario: NeoMap) {
	return {
		...usuario,
		postsCount: toNumber(usuario.postsCount),
		followersCount: toNumber(usuario.followersCount),
	};
}

function normalizeGroup(grupo: NeoMap) {
	return {
		...grupo,
		miembrosCount: toNumber(grupo.miembrosCount),
		admins: (grupo.admins ?? []).filter((admin: NeoMap | null) => admin?.id),
	};
}

function normalizeEvent(evento: NeoMap) {
	return {
		...evento,
		capacidad: toNumber(evento.capacidad),
		asistentesCount: toNumber(evento.asistentesCount),
		fecha_inicio: normalizeNeoDate(evento.fecha_inicio),
		fecha_fin: normalizeNeoDate(evento.fecha_fin),
		ciudad: removeNullMap(evento.ciudad),
		organizadores: (evento.organizadores ?? []).filter(
			(organizer: NeoMap | null) => organizer?.id,
		),
	};
}

function normalizePost(publicacion: NeoMap) {
	return {
		...publicacion,
		fecha_creacion: normalizeNeoDate(publicacion.fecha_creacion),
		comentariosCount: toNumber(publicacion.comentariosCount),
		reaccionesCount: toNumber(publicacion.reaccionesCount),
		guardadosCount: toNumber(publicacion.guardadosCount),
		compartidosCount: toNumber(publicacion.compartidosCount),
		hashtags: (publicacion.hashtags ?? []).filter(Boolean),
		ciudad: removeNullMap(publicacion.ciudad),
	};
}

function toNumber(value: any) {
	return value?.toNumber?.() ?? value ?? 0;
}

function normalizeNeoDate(value: any) {
	if (!value) {
		return value;
	}

	if (typeof value === "string") {
		return value;
	}

	if (typeof value.toString === "function") {
		return value.toString();
	}

	return value;
}

function removeNullMap<T extends NeoMap | null | undefined>(value: T) {
	if (!value || Object.values(value).every((item) => item === null || item === undefined)) {
		return undefined;
	}

	return value;
}

function cleanOptionalText(value: unknown) {
	if (typeof value !== "string") {
		return null;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
