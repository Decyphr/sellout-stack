/*
  Warnings:

  - A unique constraint covering the columns `[contentTypeId,handle]` on the table `Field` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Field_handle_key";

-- CreateIndex
CREATE UNIQUE INDEX "Field_contentTypeId_handle_key" ON "Field"("contentTypeId", "handle");
