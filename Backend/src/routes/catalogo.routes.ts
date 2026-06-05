import { Router } from "express";
import { driver } from "../config/neo4j.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const catalogoRouter = Router();

// Actualizacion del back para Jerobook:
// expone catalogos del grafo original para que el frontend conecte publicaciones,
// eventos y perfiles sin inventar relaciones nuevas.
catalogoRouter.get("/ciudades", async (_req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (c:Ciudad)
			RETURN c { .id, .nombre, .estado, .pais } AS ciudad
			ORDER BY c.nombre ASC
			LIMIT 200
			`,
		);

		res.json({ data: result.records.map((record) => record.get("ciudad")) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo ciudades" });
	} finally {
		await session.close();
	}
});

catalogoRouter.get("/hashtags", async (_req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (h:Hashtag)
			OPTIONAL MATCH (h)-[:PERTENECE_A]->(c:Categoria)
			OPTIONAL MATCH (p:Publicacion)-[:TIENE]->(h)
			WITH h, collect(DISTINCT c { .id, .nombre }) AS categorias, count(DISTINCT p) AS publicacionesCount
			RETURN h {
				.id,
				.nombre,
				.descripcion,
				categorias: categorias,
				publicacionesCount: publicacionesCount
			} AS hashtag
			ORDER BY publicacionesCount DESC, h.nombre ASC
			LIMIT 200
			`,
		);

		res.json({ data: result.records.map((record) => record.get("hashtag")) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo hashtags" });
	} finally {
		await session.close();
	}
});

catalogoRouter.get("/categorias", async (_req, res) => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (c:Categoria)
			OPTIONAL MATCH (child:Categoria)-[:SUBCATEGORIA_DE]->(c)
			WITH c, collect(DISTINCT child { .id, .nombre }) AS subcategorias
			RETURN c {
				.id,
				.nombre,
				.descripcion,
				subcategorias: subcategorias
			} AS categoria
			ORDER BY c.nombre ASC
			LIMIT 200
			`,
		);

		res.json({ data: result.records.map((record) => record.get("categoria")) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error obteniendo categorias" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// permite crear hashtags y conectarlos con Categoria usando la relacion original
// (Hashtag)-[:PERTENECE_A]->(Categoria).
catalogoRouter.post("/hashtags", requireAuth, async (req, res) => {
	const { nombre, descripcion = "", categoriaId } = req.body;

	if (!nombre || typeof nombre !== "string") {
		return res.status(400).json({ error: "nombre es requerido" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MERGE (h:Hashtag {nombre: $nombre})
			ON CREATE SET h.id = randomUUID(), h.descripcion = $descripcion, h.fecha_creacion = datetime()
			WITH h
			OPTIONAL MATCH (c:Categoria {id: $categoriaId})
			FOREACH (_ IN CASE WHEN c IS NULL THEN [] ELSE [1] END |
				MERGE (h)-[:PERTENECE_A]->(c)
			)
			RETURN h { .id, .nombre, .descripcion } AS hashtag
			`,
			{ nombre: nombre.trim(), descripcion, categoriaId: categoriaId ?? null },
		);

		res.status(201).json({
			message: "Hashtag creado correctamente",
			hashtag: result.records[0].get("hashtag"),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando hashtag" });
	} finally {
		await session.close();
	}
});

// Actualizacion del back para Jerobook:
// permite crear ciudades para relaciones VIVE_EN, NACIO_EN, UBICADO_EN y OCURRE_EN.
catalogoRouter.post("/ciudades", requireAuth, async (req, res) => {
	const { nombre, estado = "", pais = "Mexico" } = req.body;

	if (!nombre || typeof nombre !== "string") {
		return res.status(400).json({ error: "nombre es requerido" });
	}

	const session = driver.session();

	try {
		const result = await session.run(
			`
			MERGE (c:Ciudad {nombre: $nombre, estado: $estado, pais: $pais})
			ON CREATE SET c.id = randomUUID()
			RETURN c { .id, .nombre, .estado, .pais } AS ciudad
			`,
			{ nombre: nombre.trim(), estado, pais },
		);

		res.status(201).json({
			message: "Ciudad creada correctamente",
			ciudad: result.records[0].get("ciudad"),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando ciudad" });
	} finally {
		await session.close();
	}
});
