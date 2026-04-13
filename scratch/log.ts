import { ProductDetailsPage } from "apps/commerce/types.ts";

export default function consoleLogProduct(page: ProductDetailsPage | null) {
  if (page?.product) {
    console.log("=== CROSS SELLING DATA ===");
    console.log("isSimilarTo:", page.product.isSimilarTo?.length);
    console.log("isRelatedTo:", page.product.isRelatedTo?.length);
    console.log("isAccessoryOrSparePartFor:", page.product.isAccessoryOrSparePartFor?.length);
    
    // Check inside isVariantOf as well
    console.log("Variant isSimilarTo:", page.product.isVariantOf?.isSimilarTo?.length);
    console.log("Variant isRelatedTo:", page.product.isVariantOf?.isRelatedTo?.length);
    console.log("Variant isAccessoryOrSparePartFor:", page.product.isVariantOf?.isAccessoryOrSparePartFor?.length);
  }
}
