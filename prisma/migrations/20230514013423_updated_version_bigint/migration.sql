-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "version" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_ProjectConfig" ("createdAt", "id", "updatedAt", "version") SELECT "createdAt", "id", "updatedAt", "version" FROM "ProjectConfig";
DROP TABLE "ProjectConfig";
ALTER TABLE "new_ProjectConfig" RENAME TO "ProjectConfig";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
