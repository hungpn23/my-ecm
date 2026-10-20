import { Endpoint } from "@libs/common";
import { PaginatedProductResponse, ProductCatalogQuery, ProductDetail, Uuid } from "@libs/contract";
import { Controller, Param, Query } from "@nestjs/common";
import { ProductCatalogService } from "./product-catalog.service";

@Controller("catalog/products")
export class ProductCatalogController {
  constructor(private readonly productCatalog: ProductCatalogService) {}

  @Endpoint("GET", {
    public: true,
    query: ProductCatalogQuery,
    response: PaginatedProductResponse,
  })
  async find(
    @Query({ schema: ProductCatalogQuery }) query: ProductCatalogQuery,
  ): Promise<PaginatedProductResponse> {
    return await this.productCatalog.find(query);
  }

  @Endpoint("GET", {
    path: ":productId",
    public: true,
    response: ProductDetail,
  })
  async findOne(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<ProductDetail> {
    return await this.productCatalog.findOne(productId);
  }
}
