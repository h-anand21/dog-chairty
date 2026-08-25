import { mutation } from "./_generated/server";

export const initializeTables = mutation({
  handler: async (ctx) => {
    // 1. Ensure Users Table has Dipu Anand
    const users = await ctx.db.query("users").collect();
    if (!users.some(u => u.phone === "+91 8252990057" || u.phone === "8252990057")) {
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

    // 2. Ensure Dogs Table has Pogo
    const dogs = await ctx.db.query("dogs").collect();
    if (!dogs.some(d => d.name === "Pogo")) {
      await ctx.db.insert("dogs", {
        id: "dog_pogo",
        name: "Pogo",
        breed: "Golden Retriever Mix",
        age: "2 Years",
        gender: "Male",
        size: "Large",
        energy: "High Energy",
        location: "Kolkata, Salt Lake",
        lat: 22.5867,
        lng: 88.4178,
        city: "Kolkata",
        coverPhoto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
        photos: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=800"],
        bio: "Super energetic, friendly, and affectionate pup! Loves outdoor park walks, playing fetch, and getting cuddles.",
        reasonForAdoption: "Seeking a warm forever family.",
        adoptionType: "Free Adoption",
        status: "available",
        currentOwnerId: "user_dipu_anand",
        currentOwnerName: "Dipu Anand",
        currentOwnerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        currentOwnerPhone: "+91 8252990057",
        isOwnerVerified: true,
        vaccinated: true,
        neutered: true,
        microchipped: true,
        medicalNotes: "Fully up to date on all vaccinations, clean health checkup.",
        favoriteThings: ["🎾 Tennis Balls", "🍗 Chicken Treats", "🛋️ Cuddles"],
        personalityTraits: ["Playful", "Gentle", "House-Trained"],
        interestedCount: 8,
        likesCount: 65,
      });
    }

    return {
      success: true,
      message: "All Convex cloud tables seeded with Dipu Anand & Pogo!"
    };
  },
});
