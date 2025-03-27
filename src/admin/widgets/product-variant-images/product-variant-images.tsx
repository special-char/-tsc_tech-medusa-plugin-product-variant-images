import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text } from "@medusajs/ui";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { sdk } from "../../utils/sdk";
import { useQuery } from "@tanstack/react-query";
import ProductVariantImagesList from "../../components/product-variant-images-list";

// The widget
const ProductVariantImagesWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const {
    data: variantsData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () =>
      sdk.client.fetch(`/admin/products/${data.id}/variants`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        query: {
          fields:
            "*inventory_items.inventory.location_levels,+inventory_quantity,*variant_images",
        },
      }),
    queryKey: ["variants"],
    refetchOnMount: "always",
  });

  if (isPending) {
    return (
      <Container className="divide-y px-6 py-10">
        <Text className="text-center">Loading...</Text>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="divide-y px-6 py-10">
        <Text className="text-center text-rose-500">{error.message}</Text>
      </Container>
    );
  }

  if (!(variantsData as any)?.variants?.length) {
    return (
      <Container className="divide-y px-6 py-10">
        <Text className="text-center text-rose-500">
          No any variants found for product id {data?.id}
        </Text>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Variant Images - {data?.title}
      </Heading>

      {data && (variantsData as any)?.variants ? (
        <ProductVariantImagesList
          product={data}
          variants={(variantsData as any)?.variants}
          refetchData={refetch}
        />
      ) : (
        <Text className="flex h-[200px] items-center justify-center px-6 py-4">
          No variants found for product id {data?.id}
        </Text>
      )}
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductVariantImagesWidget;
