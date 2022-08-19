// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { awsRouter } from "./aws";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("aws.", awsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
