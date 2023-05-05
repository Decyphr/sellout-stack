import type { ContentType } from "@prisma/client";
import { prisma } from "~/db.server";

export type { ContentType } from "@prisma/client";

export async function getAllContentTypes() {
  return prisma.contentType.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, handle: true },
  });
}

export async function getContentTypeByHandle(handle: ContentType["handle"]) {
  return prisma.contentType.findUnique({ where: { handle } });
}
