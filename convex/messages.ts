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

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    // Filter out auto-generated bot messages from results
    const all = await ctx.db.query("messages").collect();
    return all.filter(m => !m.id.startsWith("msg_auto_"));
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
    // Block saving of auto-generated bot messages
    if (args.id.startsWith("msg_auto_")) return null;
    // Check for duplicates before inserting
    const existing = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
    if (existing.some(m => m.id === args.id)) return null;
    return await ctx.db.insert("messages", args);
  },
});

export const cleanAndNormalizeMessages = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("messages").collect();
    let updated = 0;
    for (const msg of all) {
      // 1. Delete any leftover mock sarah messages
      if (msg.senderId === "user_sarah") {
        await ctx.db.delete(msg._id);
        updated++;
        continue;
      }
      // 2. Normalize 0057 sender name to Dipu Anand
      if (msg.senderName === "Pet Lover (0057)" || msg.senderId.includes("0057") || msg.senderId === "user_1788015759820") {
        await ctx.db.patch(msg._id, {
          senderName: "Dipu Anand",
          senderId: "user_dipu_anand",
          conversationId: msg.conversationId.replace("_user_sarah", "_user_1787070866447")
        });
        updated++;
      } else if (msg.conversationId.includes("_user_sarah")) {
        await ctx.db.patch(msg._id, {
          conversationId: msg.conversationId.replace("_user_sarah", "_user_1787070866447")
        });
        updated++;
      }
    }
    return { success: true, updated };
  },
});

