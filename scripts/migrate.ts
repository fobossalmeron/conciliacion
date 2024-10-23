const { tursoClient } = require('../lib/db');

async function migrateDatabase() {
  const alterTableQueries = [
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS doctor TEXT;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS direccion TEXT;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS paquetes INTEGER;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS telefono TEXT;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS comprobantePago BLOB;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS totalPagado REAL;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS tipoCambio REAL;",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS createdAt TEXT DEFAULT (datetime('now'));",
    "ALTER TABLE tareas ADD COLUMN IF NOT EXISTS updatedAt TEXT DEFAULT (datetime('now'));"
  ];

  try {
    for (const query of alterTableQueries) {
      await tursoClient.execute(query);
    }
    console.log('Migración de la base de datos completada.');
  } catch (error) {
    console.error('Error durante la migración de la base de datos:', error);
  }
}

migrateDatabase().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
