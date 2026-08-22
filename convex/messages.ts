import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByConversation = query({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const send = mutation({
  args: {
    id: v.string(),
    conversationId: v.string(),
    senderId: v.string(),
    senderName: v.string(),
    senderAvatar: v.string(),
    recipientId: v.string(),
    text: v.string(),
    image: v.optional(v.string()),
    isDogBark: v.optional(v.boolean()),
    timestamp: v.string(),
    read: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", args);
  },
});
