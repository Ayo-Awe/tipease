import { and, eq } from "drizzle-orm";
import { users } from "../db/schema";
import { BaseRespository } from "./base.repository";

class UserRepository extends BaseRespository {
  async getById(userId: number) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
  async create() {}
  async updateById() {}
  async deleteById() {}
}

export default new UserRepository();
