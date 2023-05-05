-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "contentTypeId" TEXT NOT NULL,
    CONSTRAINT "Field_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("contentTypeId", "createdAt", "handle", "id", "sortOrder", "title", "type", "updatedAt") SELECT "contentTypeId", "createdAt", "handle", "id", "sortOrder", "title", "type", "updatedAt" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE UNIQUE INDEX "Field_handle_key" ON "Field"("handle");
CREATE TABLE "new_FieldOptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "fieldId" TEXT NOT NULL,
    CONSTRAINT "FieldOptions_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FieldOptions" ("createdAt", "fieldId", "id", "updatedAt") SELECT "createdAt", "fieldId", "id", "updatedAt" FROM "FieldOptions";
DROP TABLE "FieldOptions";
ALTER TABLE "new_FieldOptions" RENAME TO "FieldOptions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
