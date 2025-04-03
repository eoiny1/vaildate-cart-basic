import { describe, it, expect } from 'vitest';
import { run } from './run';

/**
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

describe('cart checkout validation function', () => {
  it('returns an error when quantity exceeds one for limited products', () => {
    const result = run({
      cart: {
        lines: [
          {
            quantity: 3,
            merchandise: {
              product: {
                id: 'gid://shopify/Product/123',
                hasAnyTag: true, // Product has the "limit-quantity-1" tag
                metafield: null
              }
            }
          }
        ]
      }
    });
    const expected = /** @type {FunctionRunResult} */ ({ errors: [
      {
        localizedMessage: "This item is limited to 1 per order",
        target: "$.cart.lines"
      }
    ] });

    expect(result).toEqual(expected);
  });

  it('returns no errors when quantity exceeds one for non-limited products', () => {
    const result = run({
      cart: {
        lines: [
          {
            quantity: 3,
            merchandise: {
              product: {
                id: 'gid://shopify/Product/456',
                hasAnyTag: false, // Product doesn't have the tag
                metafield: null
              }
            }
          }
        ]
      }
    });
    const expected = /** @type {FunctionRunResult} */ ({ errors: [] });

    expect(result).toEqual(expected);
  });

  it('returns no errors when quantity is one for limited products', () => {
    const result = run({
      cart: {
        lines: [
          {
            quantity: 1,
            merchandise: {
              product: {
                id: 'gid://shopify/Product/123',
                hasAnyTag: true, // Product has the tag
                metafield: null
              }
            }
          }
        ]
      }
    });
    const expected = /** @type {FunctionRunResult} */ ({ errors: [] });

    expect(result).toEqual(expected);
  });

  it('returns an error when quantity exceeds one for products with quantity limit metafield', () => {
    const result = run({
      cart: {
        lines: [
          {
            quantity: 2,
            merchandise: {
              product: {
                id: 'gid://shopify/Product/789',
                hasAnyTag: false,
                metafield: {
                  value: "1" // Product has a metafield indicating quantity limit of 1
                }
              }
            }
          }
        ]
      }
    });
    const expected = /** @type {FunctionRunResult} */ ({ errors: [
      {
        localizedMessage: "This item is limited to 1 per order",
        target: "$.cart.lines"
      }
    ] });

    expect(result).toEqual(expected);
  });
});