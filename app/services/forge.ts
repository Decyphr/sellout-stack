import { prisma } from "~/services/db.server";

class ForgeClient {
  constructor() {}

  collection(section: string) {
    return prisma.collection.findUnique({
      where: { handle: section },
    });
  }
}

export const forge = new ForgeClient();
