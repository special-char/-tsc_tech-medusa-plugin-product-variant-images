import { createElement, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FocusModal, Heading, Label, Text, toast } from "@medusajs/ui";
import { AdminProduct } from "@medusajs/types";
import { CustomProductVariant } from "../types/custom";
import getInputElement from "./common/getInputElement";

type Props = {
  product: AdminProduct;
  variant: CustomProductVariant;
  open: boolean;
  onClose: () => void;
  type: "thumbnail" | "media";
};

type FormValues = {
  selectedImages: string[];
  uploads: File[] | [];
};

const VariantsImagesModal = ({
  variant,
  open,
  onClose,
  product,
  type,
}: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getDefaultSelectedImages = () => {
    return type === "thumbnail"
      ? [variant?.variant_images?.thumbnail]
      : variant?.variant_images?.images || [];
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      selectedImages: getDefaultSelectedImages(),
      uploads: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    let selectedImages = data?.selectedImages;
    try {
      setIsUpdating(true);
      if (data?.uploads && data?.uploads?.length > 0) {
        const formData = new FormData();
        data.uploads.forEach((file) => {
          console.log("file", file);

          formData.append("files", file);
        });

        const response = await fetch("/admin/uploads", {
          method: "POST",
          body: formData,
        });

        const imageRes = await response.json();
        console.log("imageRes", imageRes);

        if (imageRes.files && imageRes.files?.length > 0) {
          const images = [
            ...(product?.images?.map((img) => ({ url: img.url })) ?? []),
            ...imageRes.files.map((item: any) => ({ url: item?.url })),
          ];

          const res = await fetch(`/admin/products/${product.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(images),
          });

          const productResponse = await res.json();

          selectedImages = [
            ...(imageRes.files?.map((item: any) => item.url) ?? []),
            ...(data?.selectedImages ?? []),
          ];
        }
      }

      const rawData = {
        ...(type === "thumbnail" ? { thumbnail: selectedImages[0] ?? "" } : {}),
        ...(type === "media" ? { images: selectedImages } : {}),
      };

      const updateProductVariantRes = await fetch(
        `/admin/product-variant-images/product-variant/${variant.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(rawData),
        }
      );

      const variantres = await updateProductVariantRes.json();

      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // const selectedImages = watch("selectedImages");

  const images = useMemo(() => {
    const allImages = [
      ...(variant.variant_images?.images?.map((x) => ({ id: x, url: x })) ||
        []),
      ...(product?.images || []),
    ];
    // Filter to keep only unique URLs
    const uniqueImages = Array.from(
      new Map(allImages.map((item) => [item.url, item])).values()
    );
    return uniqueImages;
  }, [variant, product]);

  return (
    <FocusModal open={open} onOpenChange={onClose} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            Select {type} for {variant?.title}
          </FocusModal.Title>
          <Button
            variant="primary"
            type="submit"
            disabled={!isDirty}
            isLoading={isUpdating}
            form="variant-images-form"
          >
            Save and close
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="h-full overflow-y-scroll">
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="variant-images-form"
            className="relative grid md:h-full md:grid-cols-[1fr_40%]"
          >
            <div className="h-full overflow-y-scroll p-4 md:border-r">
              <div className="space-y-2 py-4">
                <Heading className="h2-core font-sans font-medium">
                  Uploads
                </Heading>
                <Text className="txt-compact-small whitespace-pre-line text-pretty font-sans font-normal">
                  Select an image to use as variant {type} - {variant?.title}.
                </Text>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
                {images?.map((image) => (
                  <div
                    key={image.id}
                    className="shadow-elevation-card-rest hover:shadow-elevation-card-hover 
                            transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                  >
                    <Controller
                      control={control}
                      name="selectedImages"
                      render={({ field }) => (
                        <Label className="relative cursor-pointer">
                          <input
                            type="checkbox"
                            className="absolute right-2 top-2"
                            value={image.url}
                            checked={field.value.includes(image.url)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              let updatedValues;
                              if (type === "thumbnail") {
                                // Only one image allowed for "thumbnail"
                                updatedValues = isChecked ? [image.url] : [];
                              } else {
                                // Multiple images allowed for "media"
                                updatedValues = isChecked
                                  ? [...field.value, image.url]
                                  : field.value.filter(
                                      (url) => url !== image.url
                                    );
                              }
                              field.onChange(updatedValues);
                            }}
                          />
                          <img
                            src={image?.url}
                            alt={`image-${image?.id}`}
                            className="size-full object-cover"
                          />
                        </Label>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="left-0 top-0 h-fit overflow-y-auto p-4 md:sticky">
              <div className="space-y-2 py-4">
                <Heading className="h2-core font-sans font-medium">
                  Media{" "}
                  <span className="txt-compact-small font-sans font-normal">
                    (optional)
                  </span>
                </Heading>
                <Text className="txt-compact-small whitespace-pre-line text-pretty font-sans font-normal">
                  Add images to your product media.
                </Text>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
                {watch("uploads").map((file, index) => (
                  <div
                    key={index}
                    className="shadow-elevation-card-rest hover:shadow-elevation-card-hover 
                            transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`image-${index}`}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Controller
                control={control}
                name="uploads"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="uploads">
                      {createElement(getInputElement("file-upload"), {
                        placeholder:
                          "1200 x 1600 (3:4) recommended, up to 10MB each",
                        filetypes: [
                          "image/gif",
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ],
                        preview: false,
                        multiple: type !== "thumbnail",
                        ...field,
                      })}
                    </Label>
                  </div>
                )}
              />
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default VariantsImagesModal;
