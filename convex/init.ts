import { mutation } from "./_generated/server";

export const initializeTables = mutation({
  handler: async (ctx) => {
    const DIPU_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"; // Smiling Male Avatar
    const ADOPTER_7123_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"; // Distinct Male Profile Photo

    // 1. Update Users Table: Dipu Anand (Owner)
    const users = await ctx.db.query("users").collect();
    const existingDipu = users.find(u => u.phone.includes("8252990057"));
    
    if (existingDipu) {
      await ctx.db.patch(existingDipu._id, {
        name: "Dipu Anand",
        role: "owner",
        avatar: DIPU_AVATAR,
        location: "Kolkata, Salt Lake",
        bio: "Loving dog parent looking for a warm, caring forever family for Pogo.",
        isVerified: true
      });
    } else {
      await ctx.db.insert("users", {
        id: "user_dipu_anand",
        name: "Dipu Anand",
        phone: "+91 8252990057",
        avatar: DIPU_AVATAR,
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

    // 2. Update Users Table: Pet Lover 7123 (Adopter)
    const existing7123 = users.find(u => u.phone.includes("8252627123"));
    if (existing7123) {
      await ctx.db.patch(existing7123._id, {
        avatar: ADOPTER_7123_AVATAR,
        role: "adopter",
        bio: "Verified dog lover looking to adopt and care for a loving companion.",
      });
    }

    // 3. Update Dogs Table: Pogo's Owner Avatar to match Dipu Anand
    const dogs = await ctx.db.query("dogs").collect();
    for (const dog of dogs) {
      if (dog.currentOwnerPhone?.includes("8252990057") || dog.currentOwnerName.toLowerCase().includes("dipu")) {
        await ctx.db.patch(dog._id, {
          currentOwnerName: "Dipu Anand",
          currentOwnerAvatar: DIPU_AVATAR,
        });
      }
    }

    // 4. Update Messages: Set correct distinct avatar for each sender
    const messages = await ctx.db.query("messages").collect();
    for (const msg of messages) {
      if (msg.senderName.toLowerCase().includes("dipu") || msg.senderId.includes("0057") || msg.senderId === "user_dipu_anand") {
        await ctx.db.patch(msg._id, {
          senderName: "Dipu Anand",
          senderAvatar: DIPU_AVATAR
        });
      } else if (msg.senderName.includes("7123") || msg.senderId.includes("7123")) {
        await ctx.db.patch(msg._id, {
          senderAvatar: ADOPTER_7123_AVATAR
        });
      }
    }

    return {
      success: true,
      message: "Convex cloud tables verified with distinct unique profile photos!"
    };
  },
});
