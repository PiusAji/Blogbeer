import { cache } from "react";
import { getPayload } from "payload";
import config from "../payload.config";

export const getCachedPayload = cache(async () => {
  return getPayload({
    config,
  });
});
