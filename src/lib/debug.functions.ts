import { createServerFn } from "@tanstack/react-start";
import { Client } from "@planetscale/database";

// Embora o usuário use MySQL legado (38.190.176.170), se o ambiente Edge falhar com mysql2,
// o driver HTTP do PlanetScale ou um fetch direto via TCP (se suportado pelo worker) seria a alternativa.
// No entanto, mysql2 costuma exigir node:net que não existe no Edge sem polyfills.

export const testEdgeCompatibility = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      // Teste básico de importação dinâmica para ver se quebra no Edge
      // @ts-ignore
      const mysql = await import('mysql2/promise');
      return { success: true, message: "mysql2 importado com sucesso no servidor" };
    } catch (e: any) {
      return { success: false, error: e.message, stack: e.stack };
    }
  });
