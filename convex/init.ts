import { mutation } from "./_generated/server";

export const initializeTables = mutation({
  handler: async (ctx) => {
    // 1. Ensure Users Table has Dipu Anand with correct name and role
    const users = await ctx.db.query("users").collect();
    const existingDipu = users.find(u => u.phone.includes("8252990057"));
    
    if (existingDipu) {
      await ctx.db.patch(existingDipu._id, {
        name: "Dipu Anand",
        role: "owner",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        location: "Kolkata, Salt Lake",
        bio: "Loving dog parent looking for a warm, caring forever family for Pogo.",
        isVerified: true
      });
    } else {
      await ctx.db.insert("users", {
        id: "user_dipu_anand",
        name: "Dipu Anand",
        phone: "+91 8252990057",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        role: "owner",
        location: "Kolkata, Salt Lake",
        isVerified: true,
        joinedDate: "February 2025",
        homeType: "House",
        hasYard: true,
        otherPets: "None",
        experienceLevel: "Expert",
        bio: "Loving dog parent looking for a warm, caring forever family for Pogo.",
      });
    }

    return {
      success: true,
      message: "Convex cloud tables verified with Dipu Anand!"
    };
  },
});
