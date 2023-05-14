/*
  Warnings:

  - Added the required column `projectConfigId` to the `ContentType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ProjectConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT,
    "projectConfigId" TEXT NOT NULL,
    CONSTRAINT "ContentType_projectConfigId_fkey" FOREIGN KEY ("projectConfigId") REFERENCES "ProjectConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContentType" ("createdAt", "description", "handle", "id", "title", "updatedAt") SELECT "createdAt", "description", "handle", "id", "title", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_handle_key" ON "ContentType"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
