import { Endpoint, OffsetQuery, Uuid } from "@libs/common";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { CreateProduct, PaginatedProductResponse, ProductResponse } from "./product.schema";
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
}
