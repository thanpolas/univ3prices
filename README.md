# UniV3Prices

> A Node.js library to calculate [Uniswap V3][univ3] ratios (prices) from token pairs.

## Install

Install the module using NPM:

```
npm install @thanpolas/univ3prices --save
```

## Quick Start

```js
const univ3prices = require('@thanpolas/univ3prices');

const price = univ3prices(
    USDC.decimals,
    USDT.decimals,
    sqrtRatioX96,
).toSignificant(5);

console.log(prices);
// "1.01"
```

## univ3prices(decimals0, decimals1, sqrtRatioX96, optReverse)

> The default function exposed is used to calculate [Uniswap V3][univ3] Liquidity Pool (LP) Token Pairs.

-   `decimals0` **{number}** The decimals of token 0.
-   `decimals1` **{number}** The decimals of token 1.
-   `sqrtRatioX96` **{string}** The Square Root ratio value of the LP.
-   `optReverse` **{boolean=}** Optionally, set to true, to get the reversed price (i.e. token1 / token0).

The `univ3prices()` returns an object that contains three functions depending on the output type you wish to have:

-   [`toSignificant()` To get the defined last significant decimals][significant].
-   [`toFixed()` To get a fixed number of decimals][fixed].
-   [`toScalar` To get the raw Big Int values of the token pair.][scalar].

### toSignificant(digits, optFormat, optRounding)

> Returns string the "digits" last significant decimals.

-   `digits` **{number=}** How many significant digits to return, default `5`.
-   `optFormat` **{Object=}** Formatting instructions for the [toFormat][toformat] library, default is no formatting.
-   `optRounding` **{Rounding=}** The rounding function to use. Rounding is an enumeration available at `univ3Prices.Rounding`, default value is `ROUND_HALF_UP`.
-   **Returns** **{string}** String representation of the result.

#### Rounding Values

-   `univ3prices.Rounding.ROUND_DOWN` Rounds towards zero. I.e. truncate, no rounding.
-   `univ3prices.Rounding.ROUND_HALF_UP`: Rounds towards nearest neighbour. If equidistant, rounds away from zero.
-   `univ3prices.Rounding.ROUND_UP`: Rounds away from zero.

#### toSignificant Examples - Defaults

```js
// prepare a sqrtRatioX96 value, by emulating a 10 / 7 division.
const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

univ3Price(18, 18, sqrtRatioX96).toSignificant();
// '1.4286'

univ3Price(18, 18, sqrtRatioX96).toSignificant(3);
// '1.43'

univ3Price(18, 18, sqrtRatioX96).toSignificant(2);
// '1.4'
```

#### toSignificant Examples - Format and Round

```js
// prepare a sqrtRatioX96 value, by emulating a 10 / 7 division.
const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);
// and a sqrtRatioX96 value emulating 20000000 / 1 division.
const sqrtRatioX96_20m = encodeSqrtRatioX96(10e18, 7e18);

// Default Formatting
const formatDef = { groupSeparator: '' };
// Use `,` as group separator
const formatComma = { groupSeparator: ',' };

univ3Price(18, 18, sqrtRatioX96).toSignificant(5, formatDef, ROUND_DOWN);
// '1.4285'
univ3Price(18, 18, sqrtRatioX96).toSignificant(3, formatDef, ROUND_DOWN);
// '1.42'

//  Formatting
univ3Price(18, 18, sqrtRatioX96_20m).toSignificant(5, formatComma);
// '20,000,000'
```

### toFixed(digits, optFormat, optRounding)

> Returns string, fixed decimals as defined in digits.

-   `digits` **{number=}** How many significant digits to return, default `5`.
-   `optFormat` **{Object=}** Formatting instructions for the [toFormat][toformat] library, default is no formatting.
-   `optRounding` **{Rounding=}** The rounding function to use. Rounding is an enumeration available at `univ3Prices.Rounding`, default value is `ROUND_HALF_UP`.
-   **Returns** **{string}** String representation of the result.

Formatting and Rounding are exactly the same as for [the `toSignificant()` method][tosignificant]

#### toFixed Examples

```js
// prepare a sqrtRatioX96 value, by emulating a 10 / 7 division.
const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);
// and a sqrtRatioX96 value emulating 20000000 / 1 division.
const sqrtRatioX96_20m = encodeSqrtRatioX96(10e18, 7e18);

univ3Price(18, 18, sqrtRatioX96).toFixed();
// '1.42857'

univ3Price(18, 18, sqrtRatioX96).toFixed(3);
// '1.429'

univ3Price(18, 18, sqrtRatioX96).toFixed(2);
// '1.43'

// This time use the 20m ratio
univ3Price(18, 18, sqrtRatioX96_20m).toFixed(2);
// '20000000.00'
```

### toScalar()

> Returns the raw scalar containing numerator and denominator in [BigInt type][jsbi] of the token pairs.

#### toScalar Examples

```js
const JSBI = require('jsbi');
// prepare a sqrtRatioX96 value, by emulating a 10 / 7 division.
const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

const scalar = univ3Price(18, 18, sqrtRatioX96).toScalar();
// {
//     numerator: '...'
//     denominator: '...'
// }

scalar.numerator instanceOf JSBI; // true
scalar.denominator instanceOf JSBI; // true
```

---

## How to get the sqrtRatioX96 Value From Uniswap

In regards to the `sqrtRatioX96` value. there are two primary ways to get it:

### Using the Liquidity Pool Contract

Query the Liquidity Pool contract of interest and [use the `slot0()` method][slot0].

This method will return a collection of properties, the one you care about is
`sqrtPriceX96`.

### Using the Subgraph

Use the [Uniswap V3 Subgraph][univ3graph] that is publicly available and fetch
the `sqrtPrice` property from the `Pool` schema.

## Utility Functions and Constants

The univ3prices package offers a few utility functions and constants:

-   `univ3prices.encodeSqrtRatioX96(amount1, amount0)` Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0.
-   `univ3prices.sqrt(value)` Computes floor(sqrt(value:JSBI)).
-   `univ3prices.Rounding` The [Rounding enumeration as mentioned above][rounding].
-   `univ3prices.Q96` Q96 number constant.
-   `univ3prices.Q192` Q192 number constant.

# Acknowledgements & Credits

This library has been a study and break down, to understand how Uniswap V3 works. It acts both as a library for you to use and a way for you to understand, in simpler terms, how price is calculated.

In particular, the [Uniswap V3 SDK's Pool Class][uni-pool] and the [Uniswap SDK Core's Price][uni-price] and [Fraction][uni-fraction] classes were reverse engineered and rewritten in a functional manner. Most of the tests where also ported directly from the excellently tested SDK and Core packages.

I want to thank "Jorropo.eth" who has accompanied and helped me in the weeks long journey of discovering how to calculate Uniswap's V3 Liquidity Pool ratios, on Uniswap's Discord. He also gave the following excellent explanation as to why the Token Pair reserves are square rooted:

> This is so the difference gets exponentially written.
>
> Let's assume ticks were just 100$ in size, so you have one from 0-100, 100-200, ...
> A token that is price at 250$ would need to do +20% in price to cross a tick.
> But a token priced 25050$ it's bearly +0.2%.
>
> Having them SQRT makes the ratio constant.
> So in any cases it's just let's say any 1% of price change, cross a tick.
>
> This spreads them each 1% appart (so fewer and fewer ticks), instead of each 100$ appart.

# Maintenance & Development

## Update Node Version

When a new node version should be supported, updated the following:

-   `/package.json`
-   `/.nvmrc`
-   `/.circleci/config.yml`

## Releasing

1. Update the changelog bellow ("Release History").
1. Ensure you are on master and your repository is clean.
1. Type: `npm run release` for patch version jump.
    - `npm run release:minor` for minor version jump.
    - `npm run release:major` for major major jump.

## Release History

-   **v1.0.0**, _19 Jul 2021_
    -   Big Bang

## License

Copyright © [Thanos Polychronakis][thanpolas] and Authors, [Licensed under ISC](/LICENSE).

[univ3]: https://docs.uniswap.org/sdk/introduction
[univ3graph]: https://thegraph.com/legacy-explorer/subgraph/uniswap/uniswap-v3
[slot0]: https://github.com/Uniswap/uniswap-v3-core/blob/b2c5555d696428c40c4b236069b3528b2317f3c1/contracts/interfaces/pool/IUniswapV3PoolState.sol#L21-L32
[toformat]: https://github.com/MikeMcl/toFormat#further-examples
[tosignificant]: #tosignificant_digits_optFormat_optRounding
[jsbi]: https://github.com/GoogleChromeLabs/jsbi#readme
[rounding]: #rounding_values
[uni-pool]: https://github1s.com/Uniswap/uniswap-v3-sdk/blob/aeb1b09/src/entities/pool.ts#L96-L122
[uni-price]: https://github1s.com/Uniswap/uniswap-sdk-core/blob/HEAD/src/entities/fractions/price.ts
[uni-fraction]: https://github1s.com/Uniswap/uniswap-sdk-core/blob/HEAD/src/entities/fractions/fraction.ts
