import type { Cook, MenuItem } from "@/types"

export const states = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export type State = (typeof states)[number]

export const cooksByState: Record<State, (Cook & { menuItems: MenuItem[] })[]> = {
  "All States": [], // Will be populated with all cooks
  Maharashtra: [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "1234567890",
      role: "cook",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: "Mumbai, Maharashtra",
      profilePicture: "https://source.unsplash.com/random/400x400?woman,cooking",
      certification: "Certified Home Chef",
      rating: 4.8,
      totalOrders: 156,
      totalEarnings: 25000,
      isAvailable: true,
      menuItems: [
        {
          id: "1",
          cookId: "1",
          name: "Vada Pav",
          description: "Mumbai's favorite street food",
          price: 30,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 1,
          isAvailable: true,
        },
        {
          id: "2",
          cookId: "1",
          name: "Misal Pav",
          description: "Spicy curry with bread",
          price: 60,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "breakfast",
          dayOfWeek: 1,
          isAvailable: true,
        },
        {
          id: "1",
          cookId: "1",
          name: "Friday Special Thali", 
          description: "Friday's special menu",
          price: 150,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 5, // Change this to match Friday
          isAvailable: true
        },
        
      ],
    },
  ],
  Delhi: [
    {
      id: "2",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "9876543210",
      role: "cook",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: "Lajpat Nagar, Delhi",
      profilePicture: "https://source.unsplash.com/random/400x400?man,cooking",
      certification: "Food Safety Certified",
      rating: 4.6,
      totalOrders: 98,
      totalEarnings: 18000,
      isAvailable: true,
      menuItems: [
        {
          id: "3",
          cookId: "2",
          name: "Butter Chicken",
          description: "Rich and creamy butter chicken",
          price: 250,
          dietaryType: "non-veg",
          cuisineType: "indian",
          mealType: "dinner",
          dayOfWeek: 1,
          isAvailable: true,
        },
        {
          id: "4",
          cookId: "2",
          name: "Dal Makhani",
          description: "Creamy black lentils",
          price: 180,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 1,
          isAvailable: true,
        },
      ],
    },
  ],
  Karnataka: [
    {
      id: "3",
      name: "Lakshmi Rao",
      email: "lakshmi@example.com",
      phone: "8765432109",
      role: "cook",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: "Indiranagar, Bangalore",
      profilePicture: "https://source.unsplash.com/random/400x400?woman,chef",
      certification: "Traditional Cook",
      rating: 4.9,
      totalOrders: 200,
      totalEarnings: 35000,
      isAvailable: true,
      menuItems: [
        {
          id: "5",
          cookId: "3",
          name: "Masala Dosa",
          description: "Crispy dosa with potato filling",
          price: 80,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "breakfast",
          dayOfWeek: 1,
          isAvailable: true,
        },
        {
          id: "6",
          cookId: "3",
          name: "Bisibele Bath",
          description: "Traditional Karnataka rice dish",
          price: 120,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 1,
          isAvailable: true,
        },
      ],
    },
  ],
  "Tamil Nadu": [
    {
      id: "4",
      name: "Meena Krishnan",
      email: "meena@example.com",
      phone: "7654321098",
      role: "cook",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: "T Nagar, Chennai",
      profilePicture: "https://source.unsplash.com/random/400x400?indian,cooking",
      certification: "Home Chef Certified",
      rating: 4.7,
      totalOrders: 180,
      totalEarnings: 28000,
      isAvailable: true,
      menuItems: [
        {
          id: "7",
          cookId: "4",
          name: "Chettinad Chicken",
          description: "Spicy traditional chicken curry",
          price: 220,
          dietaryType: "non-veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 1,
          isAvailable: true,
        },
      ],
    },
  ],
  Gujarat: [
    {
      id: "5",
      name: "Hetal Patel",
      email: "hetal@example.com",
      phone: "6543210987",
      role: "cook",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: "Satellite, Ahmedabad",
      profilePicture: "https://source.unsplash.com/random/400x400?cooking",
      certification: "Gujarati Cuisine Expert",
      rating: 4.8,
      totalOrders: 150,
      totalEarnings: 22000,
      isAvailable: true,
      menuItems: [
        {
          id: "8",
          cookId: "5",
          name: "Dhokla",
          description: "Steamed gram flour cake",
          price: 60,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "breakfast",
          dayOfWeek: 1,
          isAvailable: true,
        },
      ],
    },
  ],
  // Add more states with their respective cooks...
  Telangana: [],
  "West Bengal": [],
  "Uttar Pradesh": [],
  Rajasthan: [],
  Kerala: [],
}

// Populate All States with all cooks
cooksByState["All States"] = Object.values(cooksByState)
  .flat()
  .filter((cook): cook is Cook & { menuItems: MenuItem[] } => Boolean(cook))

