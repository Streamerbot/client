/**
 * Prettify hover overlays
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Recursively makes all properties of an object writable.
 */
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

/**
 * Recursively makes all properties of an object readonly.
 */
export type DeepPartial<T> = T extends object
  ? {
      -readonly [P in keyof T]: DeepPartial<T[P]>;
    }
  : T;

/**
 * Matches a JSON object
 *
 * @link https://github.com/sindresorhus/type-fest?tab=readme-ov-file#json
 */
export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined;
};

/**
 * Matches a JSON array
 *
 * @link https://github.com/sindresorhus/type-fest?tab=readme-ov-file#json
 */
export type JsonArray = JsonValue[] | readonly JsonValue[];

/**
 * Matches a JSON primitive
 *
 * @link https://github.com/sindresorhus/type-fest?tab=readme-ov-file#json
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Matches any valid JSON value
 *
 * @link https://github.com/sindresorhus/type-fest?tab=readme-ov-file#json
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
