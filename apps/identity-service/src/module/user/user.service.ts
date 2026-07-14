import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  private readonly USERS = [
    {
      userId: 999,
      email: "user@example.com",
      hashedPassword: "$2b$10$...", // This would be a real hashed password
    },
  ];

  async findByEmail(email: string) {
    return this.USERS.find((user) => user.email === email);
  }
}
