/*
  Warnings:

  - You are about to alter the column `version` on the `ProjectConfig` table. The data in that column could be lost. The data in that column will be cast from `String` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "version" BIGINT NOT NULL DEFAULT 1
);
INSERT INTO "new_ProjectConfig" ("createdAt", "id", "updatedAt", "version") SELECT "createdAt", "id", "updatedAt", "version" FROM "ProjectConfig";
DROP TABLE "ProjectConfig";
ALTER TABLE "new_ProjectConfig" RENAME TO "ProjectConfig";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
