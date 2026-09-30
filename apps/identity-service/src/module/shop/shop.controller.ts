import { Endpoint } from "@libs/common";
import { AuthenticatedUser, User } from "@libs/core";
import { Body, Controller } from "@nestjs/common";
import { CreateShop, CreateShopResponse } from "./shop.schema";
import { ShopService } from "./shop.service";

@Controller("shops")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Endpoint("POST", { request: CreateShop, response: CreateShopResponse })
  async create(
    @User() user: AuthenticatedUser,
    @Body({ schema: CreateShop }) body: CreateShop,
  ): Promise<CreateShopResponse> {
    return await this.shopService.create(user, body);
  }
}
