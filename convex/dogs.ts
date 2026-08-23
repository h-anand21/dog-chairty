import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("dogs").collect();
  },
});

export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    breed: v.string(),
    age: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    size: v.union(v.literal("Small"), v.literal("Medium"), v.literal("Large"), v.literal("Extra Large")),
    energy: v.union(v.literal("Low (Couch Potato)"), v.literal("Moderate"), v.literal("High Energy"), v.literal("Zoomies Master")),
    location: v.string(),
    lat: v.number(),
    lng: v.number(),
    city: v.string(),
    coverPhoto: v.string(),
    photos: v.array(v.string()),
    bio: v.string(),
    reasonForAdoption: v.string(),
    adoptionType: v.union(v.literal("Free Adoption"), v.literal("Adoption Fee")),
    status: v.union(
      v.literal("available"),
      v.literal("pending"),
      v.literal("meet_scheduled"),
      v.literal("agreement_pending"),
      v.literal("handover_pending"),
      v.literal("adopted")
    ),
    currentOwnerId: v.string(),
    currentOwnerName: v.string(),
    currentOwnerAvatar: v.string(),
    currentOwnerPhone: v.optional(v.string()),
    isOwnerVerified: v.boolean(),
    vaccinated: v.boolean(),
    neutered: v.boolean(),
    microchipped: v.boolean(),
    medicalNotes: v.string(),
    favoriteThings: v.array(v.string()),
    personalityTraits: v.array(v.string()),
    interestedCount: v.number(),
    likesCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dogs", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("pending"),
      v.literal("meet_scheduled"),
      v.literal("agreement_pending"),
      v.literal("handover_pending"),
      v.literal("adopted")
    ),
    newOwnerName: v.optional(v.string()),
    adoptedDate: v.optional(v.string()),
    certificateId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dogs")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        ...(args.newOwnerName ? { newOwnerName: args.newOwnerName } : {}),
        ...(args.adoptedDate ? { adoptedDate: args.adoptedDate } : {}),
        ...(args.certificateId ? { certificateId: args.certificateId } : {}),
      });
    }
  },
});
