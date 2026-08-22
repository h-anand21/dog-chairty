/// <reference types="vite/client" />
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = (import.meta as any).env?.VITE_CONVEX_URL || "https://pawconnect-dev.convex.cloud";

export const convexClient = new ConvexReactClient(CONVEX_URL);

export const isConvexConfigured = () => {
  return Boolean((import.meta as any).env?.VITE_CONVEX_URL);
};
