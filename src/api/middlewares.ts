import {
  defineMiddlewares,
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework";
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../modules/product-variant-images";
import { ProductVariantImagesSchema } from "./admin/product-variant-images/validators";

const productVariantImagesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: /^\/admin\/product-variant-images(\/product-variant\/.*)?$/,
    method: "POST",
    middlewares: [validateAndTransformBody(ProductVariantImagesSchema)],
  },
];

export default defineMiddlewares(productVariantImagesRoutesMiddlewares);
