import { eq } from "drizzle-orm";
import { getDatabase } from "@/app/db";
import { reflectionMessages } from "@/app/db/schema";

export const reflectionMessageRepository = {
  async findByKey(key: string) {
    const rows = await getDatabase()
      .select()
      .from(reflectionMessages)
      .where(eq(reflectionMessages.key, key))
      .limit(1);

    return rows[0];
  },
};
