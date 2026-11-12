import { Endpoint } from "@libs/common";
import { CreateShop, ShopDetail, User, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param } from "@nestjs/common";

import { ShopPolicy } from "./shop.policy";
import { ShopService } from "./shop.service";

@Controller("shops")
export class ShopController {
  constructor(private readonly shop: ShopService) {}

  @Can(ShopPolicy, "create")
  @Endpoint("POST", { request: CreateShop, response: ShopDetail })
  async create(@Body({ schema: CreateShop }) body: CreateShop): Promise<ShopDetail> {
    return await this.shop.create(body);
  }

  @Can(ShopPolicy, "addMember")
  @Endpoint("POST", { path: "members/:userId", response: User })
  async addMember(@Param("userId", { schema: Uuid }) userId: Uuid): Promise<User> {
    return await this.shop.addMember(userId);
  }
}
