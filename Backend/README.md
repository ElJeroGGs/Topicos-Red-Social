# Backend - GraphQL API (Neo4j) para Red Social

Backend construido con Node.js, TypeScript y GraphQL, utilizando Neo4j como base de datos de grafos.

---

## 🚀 Tecnologías

- Node.js
- TypeScript
- GraphQL
- Neo4j
- Apollo Server

---

## 📁 Estructura del proyecto

```
src/
├── config/        # Configuración (env, db)
├── schema/        # Definición GraphQL
├── modules/       # Dominios (User, Post, etc.)
├── server/        # Inicialización del servidor
└── index.ts       # Entry point
```

---

## ⚙️ Requisitos

- Node.js >= 18
- pnpm
- Neo4j

---

## ▶️ Instalación

```bash
pnpm install
```

---

## 🔐 Variables de entorno

Crear archivo `.env`:

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
PORT=4000
```

---

## ▶️ Ejecutar en desarrollo

```bash
pnpm dev
```

---

## 🧪 GraphQL Playground

Disponible en:

```
http://localhost:4000
```

---

## 🧹 Formato de código

Este proyecto usa Prettier para mantener consistencia.

### Reglas:

- Uso de **tabulaciones**
- Tamaño de tab: **4**
- **Punto y coma obligatorio**
- Comas finales permitidas

### Comando:

```bash
pnpm format
```

### Verificar formato:

```bash
pnpm check-format
```

> Nota: No se utilizan hooks automáticos. Cada desarrollador es responsable de formatear antes de subir cambios.

---

## 🧠 Convención de commits

Se utiliza una convención simple basada en prefijos:

### Tipos:

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `refactor:` cambio interno sin afectar comportamiento
- `docs:` cambios en documentación
- `chore:` tareas generales (configs, deps)
- `test:` pruebas

---

#### Ejemplos:

```
feat: add user creation mutation
fix: correct relationship direction in schema
refactor: simplify neo4j connection logic
docs: update README with setup instructions
```

---

## 📌 Reglas de commits

- Usar presente (no pasado)
- Ser claro y conciso
- Un commit = un cambio lógico

---

## 💡 Buenas prácticas

- Pensar en términos de grafos (nodos y relaciones)
- Evitar lógica innecesaria en resolvers
- Mantener el schema como fuente de verdad
- Usar nombres claros para relaciones (`FRIEND`, `LIKES`, etc.)

---
