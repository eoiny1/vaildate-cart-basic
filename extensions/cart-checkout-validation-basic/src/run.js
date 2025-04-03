// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * Determines if a product is limited to quantity 1
 * @param {Object} merchandise - The product merchandise object
 * @returns {boolean} - True if the product should be limited to quantity 1
 */
function isQuantityLimitedProduct(merchandise) {
  // Skip if not a product variant
  if (!merchandise || !merchandise.product) {
    return false;
  }
  
  // Check for the "limit-quantity-1" tag
  if (merchandise.product.hasAnyTag && 
      merchandise.product.hasAnyTag.valueOf()) {
    return true;
  }
  
  // Check for a metafield that indicates quantity limit
  const quantityLimitMetafield = merchandise.product.metafield;
  if (quantityLimitMetafield && 
      quantityLimitMetafield.value === "1") {
    return true;
  }
  
  // No quantity limitation found
  return false;
}

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const errors = input.cart.lines
    // Only filter lines where:
    // 1. Quantity exceeds 1
    // 2. The product is marked as quantity limited
    .filter(line => {
      return line.quantity > 1 && 
             isQuantityLimitedProduct(line.merchandise);
    })
    .map(line => ({
      localizedMessage: "This item is limited to 1 per order",
      target: "$.cart.lines",
    }));

  return {
    errors
  }
};