/*
  Warnings:

  - You are about to drop the `ProjectConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `projectConfigId` on the `ContentType` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProjectConfig";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT DEFAULT ''
);
INSERT INTO "new_ContentType" ("createdAt", "description", "handle", "id", "title", "updatedAt") SELECT "createdAt", "description", "handle", "id", "title", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_handle_key" ON "ContentType"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
