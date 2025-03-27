import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PRODUCT_VARIANT_IMAGES_TYPE } from "../type";
import ProductVariantImagesModuleService from "../../../../modules/product-variant-images/service";
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../modules/product-variant-images";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest<PRODUCT_VARIANT_IMAGES_TYPE>,
  res: MedusaResponse
): Promise<void> {
  try {
    const id = req?.params?.id;

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: product_variant_images } = await query.graph({
      entity: "variant_images",
      fields: ["*", "product_variant.*"],
      filters: {
        id: id,
      },
    });

    res.json({
      product_variant_images,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "internal server error",
    });
  }
}

export async function PUT(
  req: MedusaRequest<PRODUCT_VARIANT_IMAGES_TYPE>,
  res: MedusaResponse
): Promise<void> {
  try {
    const id = req?.params?.id;

    const productVariantImagesModuleService: ProductVariantImagesModuleService =
      req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

    const product_variant_images =
      await productVariantImagesModuleService.updateVariantImages({
        id,
        ...req?.body,
      });

    res.json({
      product_variant_images,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "internal server error",
    });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const id = req?.params?.id;

    const ProductVariantImagesModuleService: ProductVariantImagesModuleService =
      req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE);

    const my_custom =
      await ProductVariantImagesModuleService.deleteVariantImages(id);

    res.json({
      my_custom,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "internal server error",
    });
  }
}
