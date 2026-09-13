import { Endpoint, OffsetQuery, Uuid } from "@libs/common";
import { Body, Controller, Param, Query } from "@nestjs/common";
import {
  CreateProduct,
  PaginatedProductResponse,
  ProductResponse,
  UpdateProduct,
} from "./product.schema";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Endpoint("POST", { request: CreateProduct, response: ProductResponse })
  async create(@Body({ schema: CreateProduct }) body: CreateProduct): Promise<ProductResponse> {
    return await this.productService.create(body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedProductResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedProductResponse> {
    return await this.productService.find(query);
  }

  @Endpoint("GET", { path: ":productId", response: ProductResponse })
  async findOne(@Param("productId", { schema: Uuid }) id: string): Promise<ProductResponse> {
    return await this.productService.findOne(id);
  }

  @Endpoint("PATCH", {
    path: ":productId",
    request: UpdateProduct,
    response: ProductResponse,
  })
  async update(
    @Param("productId", { schema: Uuid }) productId: string,
    @Body({ schema: UpdateProduct }) body: UpdateProduct,
  ): Promise<ProductResponse> {
    return await this.productService.update(productId, body);
  }

  @Endpoint("DELETE", { path: ":productId" })
  async delete(@Param("productId", { schema: Uuid }) productId: string): Promise<void> {
    await this.productService.delete(productId);
  }
}
