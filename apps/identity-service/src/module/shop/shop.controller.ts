import { Endpoint } from "@libs/common";
import { CreateShop, CreateShopResponse } from "@libs/contract";
import { Body, Controller } from "@nestjs/common";
import { ShopService } from "./shop.service";

@Controller("shops")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Endpoint("POST", { request: CreateShop, response: CreateShopResponse })
  async create(@Body({ schema: CreateShop }) body: CreateShop): Promise<CreateShopResponse> {
    return await this.shopService.create(body);
  }
}
