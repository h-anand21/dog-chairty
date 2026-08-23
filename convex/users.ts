import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
  },
});

export const upsertUser = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    avatar: v.string(),
    role: v.union(v.literal("adopter"), v.literal("owner"), v.literal("shelter"), v.literal("admin")),
    location: v.string(),
    isVerified: v.boolean(),
    joinedDate: v.string(),
    homeType: v.optional(v.string()),
    hasYard: v.optional(v.boolean()),
    otherPets: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("users", args);
  },
});
