import { useState } from "react";
import { Button, DropdownMenu } from "@medusajs/ui";
import {
  EllipsisHorizontal,
  PencilSquare,
  ThumbnailBadge,
} from "@medusajs/icons";
import VariantsImagesModal from "./variants-images-modal";
import { AdminProduct } from "@medusajs/types";
import { CustomProductVariant } from "../types/custom";

const EmptyImage = ({ text = "No images..." }) => {
  return (
    <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative grid aspect-square size-full cursor-pointer items-center justify-center overflow-hidden rounded-[8px]">
      <span className="txt-compact-small font-sans">{text}</span>
    </div>
  );
};

const ProductVariantImagesList = ({
  product,
  variants,
  refetchData,
}: {
  product: AdminProduct;
  variants: CustomProductVariant[];
  refetchData: () => void;
}) => {
  const [openedVariant, setOpenedVariant] =
    useState<CustomProductVariant | null>(null);
  const [openedDialogType, setOpenedDialogType] = useState<
    "media" | "thumbnail" | null
  >(null);

  const handleClose = () => {
    setOpenedVariant(null);
    setOpenedDialogType(null);
    refetchData();
  };

  return (
    <div className="divide-y">
      {variants?.map((variant) => {
        return (
          <div key={variant.id} className="mt-3 w-full px-6 py-2">
            <div className="flex items-center">
              <div className="inter-base-semibold flex-1">{variant.title}</div>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="secondary"
                    size="small"
                    className="h-6 w-6 p-0"
                  >
                    <EllipsisHorizontal />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onClick={() => {
                      setOpenedVariant(variant);
                      setOpenedDialogType("thumbnail");
                    }}
                    className="gap-x-2"
                  >
                    <PencilSquare className="text-ui-fg-subtle" />
                    Edit Thumbnail
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => {
                      setOpenedVariant(variant);
                      setOpenedDialogType("media");
                    }}
                    className="gap-x-2"
                  >
                    <PencilSquare className="text-ui-fg-subtle" />
                    Edit Media
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 py-2">
              {variant?.variant_images?.thumbnail ? (
                <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]">
                  <ThumbnailBadge className="absolute left-2 top-2" />
                  <img
                    src={variant?.variant_images?.thumbnail}
                    alt="thumbnail"
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <EmptyImage text="No thumbnail" />
              )}
              {variant?.variant_images?.images?.length
                ? variant?.variant_images?.images.map(
                    (image: string, index: number) => (
                      <div
                        key={image}
                        className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                      >
                        <img
                          src={image}
                          alt={`image-${index}`}
                          className="size-full object-cover"
                        />
                      </div>
                    )
                  )
                : [1, 2, 3].map((_, index) => <EmptyImage key={index} />)}
            </div>
          </div>
        );
      })}
      {openedDialogType && openedVariant && (
        <VariantsImagesModal
          product={product}
          variant={openedVariant}
          open={!!openedVariant}
          onClose={handleClose}
          type={openedDialogType}
        />
      )}
    </div>
  );
};

export default ProductVariantImagesList;
