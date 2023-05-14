-- CreateTable
CREATE TABLE "SchemaVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "version" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SchemaVersion_version_key" ON "SchemaVersion"("version");
