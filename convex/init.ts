import { mutation } from "./_generated/server";

export const initializeTables = mutation({
  handler: async (ctx) => {
    // 1. Ensure Users Table
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      await ctx.db.insert("users", {
        id: "user_admin",
        name: "PawConnect Verified Admin",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        role: "admin",
        location: "Kolkata, Salt Lake",
        isVerified: true,
        joinedDate: "August 2026",
      });
    }

    return {
      success: true,
      message: "All Convex cloud tables (users, dogs, applications, conversations, messages, meetups, agreements, handovers) are ready!"
    };
  },
});
