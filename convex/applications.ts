import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("applications").collect();
  },
});

export const create = mutation({
  args: {
    id: v.string(),
    dogId: v.string(),
    dogName: v.string(),
    dogPhoto: v.string(),
    dogBreed: v.string(),
    applicantId: v.string(),
    applicantName: v.string(),
    applicantAvatar: v.string(),
    applicantLocation: v.string(),
    applicantPhone: v.string(),
    applicantEmail: v.string(),
    reason: v.string(),
    homeType: v.string(),
    hasYard: v.boolean(),
    otherPets: v.string(),
    experienceWithDogs: v.string(),
    vetCareAgreement: v.boolean(),
    workSchedule: v.string(),
    preferredMeetDate: v.string(),
    status: v.union(v.literal("submitted"), v.literal("accepted"), v.literal("declined"), v.literal("completed")),
    submittedAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.string(),
    status: v.union(v.literal("submitted"), v.literal("accepted"), v.literal("declined"), v.literal("completed")),
    reviewedAt: v.optional(v.string()),
    declineReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        ...(args.reviewedAt ? { reviewedAt: args.reviewedAt } : {}),
        ...(args.declineReason ? { declineReason: args.declineReason } : {}),
      });
    }
  },
});
