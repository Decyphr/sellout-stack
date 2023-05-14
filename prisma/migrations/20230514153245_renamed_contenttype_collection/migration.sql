/*
  Warnings:

  - You are about to drop the `ContentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `contentTypeId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `contentTypeId` on the `Field` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionId` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ContentType_handle_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ContentType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT DEFAULT ''
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "Entry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "isRequired" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "collectionId" TEXT NOT NULL,
    CONSTRAINT "Field_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("createdAt", "description", "handle", "id", "isRequired", "sortOrder", "title", "type", "updatedAt") SELECT "createdAt", "description", "handle", "id", "isRequired", "sortOrder", "title", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE UNIQUE INDEX "Field_collectionId_handle_key" ON "Field"("collectionId", "handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_handle_key" ON "Collection"("handle");
