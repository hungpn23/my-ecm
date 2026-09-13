import { Endpoint } from "@libs/common";
import { Body, Controller, NotImplementedException } from "@nestjs/common";
import { CreateProduct, ProductResponse } from "./product.schema";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Endpoint({
    method: "POST",
    request: CreateProduct,
    response: ProductResponse,
  })
  async create(@Body({ schema: CreateProduct }) _body: CreateProduct): Promise<ProductResponse> {
    throw new NotImplementedException();
  }
}
