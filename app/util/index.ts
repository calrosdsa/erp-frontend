import _ from "lodash";

type ZeroValue = "" | 0 | false | null | undefined;

export const isZeroValue = <T>(value: T): T extends ZeroValue ? undefined : T => {
  // Check if the value is one of the "zero values"
  if (
    value === "" ||
    value === 0 ||
    value === false ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && value !== null && Object.keys(value).length === 0)
  ) {
    return undefined as T extends ZeroValue ? undefined : T;
  }

  // Return the value if it's not a "zero value"
  return value as T extends ZeroValue ? undefined : T;
};