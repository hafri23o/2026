// Function to delete IndexedDB databases based on version
export const deleteIDBDatabases = async (
  baseName: string,
  latestVersion: number,
): Promise<void> => {
  const idb = window.indexedDB;

  if ('databases' in idb) {
    // Use idb.databases() for modern browsers that support it
    const fullName = `${baseName}-${latestVersion}`;
    const dbs = await idb.databases();

    dbs.forEach((db) => {
      // Only delete databases that start with the baseName but aren't the current version
      if (db.name && db.name.startsWith(baseName) && db.name !== fullName) {
        window.indexedDB.deleteDatabase(db.name);
      }
    });
  } else {
    // Fallback for browsers (e.g., Firefox) that don't support idb.databases()
    for (let i = 0; i < latestVersion; i += 1) {
      const dbName = `${baseName}-${i}`;
      if (idb) {
        idb.deleteDatabase(dbName);
      }
    }
  }
};
