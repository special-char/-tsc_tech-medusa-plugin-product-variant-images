import { AdminProduct, AdminProductVariant } from "@medusajs/framework/types"

export type CustomProductVariant = AdminProductVariant & {
  variant_images?: {
    thumbnail?: string
    images?: string[]
  }
}

export type CustomProduct = Omit<AdminProduct, "variants"> & {
  variants: CustomProductVariant[]
}
