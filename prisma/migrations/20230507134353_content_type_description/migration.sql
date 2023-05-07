-- AlterTable
ALTER TABLE "ContentType" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "contentTypeId" TEXT NOT NULL,
    CONSTRAINT "Field_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("contentTypeId", "createdAt", "handle", "id", "sortOrder", "title", "type", "updatedAt") SELECT "contentTypeId", "createdAt", "handle", "id", "sortOrder", "title", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE INDEX "Field_contentTypeId_sortOrder_idx" ON "Field"("contentTypeId", "sortOrder");
CREATE UNIQUE INDEX "Field_contentTypeId_handle_key" ON "Field"("contentTypeId", "handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "ContentType_title_handle_idx" ON "ContentType"("title", "handle");
