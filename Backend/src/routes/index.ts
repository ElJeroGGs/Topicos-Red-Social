import { Router } from "express";
import { healthRouter } from "./health.routes";
import { usuarioRouter } from "./usuario.routes";
import { authRouter } from "./auth.routes";
import { catalogoRouter } from "./catalogo.routes";
import { comentarioRouter } from "./comentario.routes";
import { eventoRouter } from "./evento.routes";
import { grupoRouter } from "./grupo.routes";
import { publicacionRouter } from "./publicacion.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/usuarios", usuarioRouter);
apiRouter.use("/auth", authRouter);
// Actualizacion del back para Jerobook:
// se conectan las rutas REST agregadas sin cambiar los resolvers GraphQL originales.
apiRouter.use("/catalogos", catalogoRouter);
apiRouter.use("/comentarios", comentarioRouter);
apiRouter.use("/eventos", eventoRouter);
apiRouter.use("/grupos", grupoRouter);
apiRouter.use("/publicaciones", publicacionRouter);
