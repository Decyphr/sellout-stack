/*
  Warnings:

  - The primary key for the `FieldValue` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FieldValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "textValue" TEXT DEFAULT '',
    "fieldId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    CONSTRAINT "FieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FieldValue_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FieldValue" ("entryId", "fieldId", "id", "textValue") SELECT "entryId", "fieldId", "id", "textValue" FROM "FieldValue";
DROP TABLE "FieldValue";
ALTER TABLE "new_FieldValue" RENAME TO "FieldValue";
CREATE UNIQUE INDEX "FieldValue_fieldId_entryId_key" ON "FieldValue"("fieldId", "entryId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
