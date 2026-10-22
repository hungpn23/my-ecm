import { Endpoint } from "@libs/common";
import {
  CreateProduct,
  OffsetQuery,
  PaginatedProductResponse,
  ProductDetail,
  UpdateProduct,
  Uuid,
} from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param, Query } from "@nestjs/common";

import { ProductPolicy } from "./product.policy";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Can(ProductPolicy, "create")
  @Endpoint("POST", { request: CreateProduct, response: ProductDetail })
  async create(@Body({ schema: CreateProduct }) body: CreateProduct): Promise<ProductDetail> {
    return await this.product.create(body);
  }

  @Can(ProductPolicy, "view")
  @Endpoint("GET", { query: OffsetQuery, response: PaginatedProductResponse })
  async find(@Query({ schema: OffsetQuery }) query: OffsetQuery): Promise<PaginatedProductResponse> {
    return await this.product.find(query);
  }

  @Can(ProductPolicy, "viewDetail")
  @Endpoint("GET", { path: ":productId", response: ProductDetail })
  async findOne(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<ProductDetail> {
    return await this.product.findOne(productId);
  }

  @Can(ProductPolicy, "update")
  @Endpoint("PATCH", {
    path: ":productId",
    request: UpdateProduct,
    response: ProductDetail,
  })
  async update(
    @Param("productId", { schema: Uuid }) productId: Uuid,
    @Body({ schema: UpdateProduct }) body: UpdateProduct,
  ): Promise<ProductDetail> {
    return await this.product.update(productId, body);
  }

  @Can(ProductPolicy, "delete")
  @Endpoint("DELETE", { path: ":productId" })
  async delete(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<void> {
    await this.product.delete(productId);
  }
}
