export type UserRole = "student" | "cook" | "delivery" | "admin"

export type UserStatus = "pending" | "active" | "suspended"

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface WeeklySchedule {
  cookId: string
  schedule: {
    [key in DayOfWeek]: MenuItem[]
  }
}

export const cookSchedules: WeeklySchedule[] = [
  {
    cookId: "1", // Priya Sharma
    schedule: {
      1: [ // Monday
        {
          id: "m1",
          cookId: "1",
          name: "Monday Special Thali",
          description: "Roti, Dal, Rice, 2 Sabzi, Salad, Pickle",
          price: 150,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 1,
          isAvailable: true,
        },
      ],
      2: [ // Tuesday
        {
          id: "t1",
          cookId: "1",
          name: "Tuesday Special Thali",
          description: "Puri, Chole, Rice, Raita, Sweet",
          price: 160,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 2,
          isAvailable: true,
        },
      ],
      3: [ // Wednesday
        {
          id: "w1",
          cookId: "1",
          name: "Wednesday Special Thali",
          description: "Paratha, Paneer, Rice, Dal, Dessert",
          price: 180,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 3,
          isAvailable: true,
        },
      ],
      4: [ // Thursday
        {
          id: "th1",
          cookId: "1",
          name: "Thursday Special Thali",
          description: "South Indian Special",
          price: 170,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 4,
          isAvailable: true,
        },
      ],
      5: [ // Friday 
        {
          id: "f1",
          cookId: "1",
          name: "Friday Special Thali",
          description: "Biryani Special",
          price: 200,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 5,
          isAvailable: true,
        },
      ],
      6: [ // Saturday
        {
          id: "s1",
          cookId: "1",
          name: "Saturday Special Thali",
          description: "Party Special",
          price: 220,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 6,
          isAvailable: true,
        },
      ],
      7: [ // Sunday
        {
          id: "su1",
          cookId: "1",
          name: "Sunday Special Thali",
          description: "Festival Special",
          price: 250,
          dietaryType: "veg",
          cuisineType: "indian",
          mealType: "lunch",
          dayOfWeek: 7,
          isAvailable: true,
        },
      ],
    }
  },
  // Add more cook schedules following the same pattern
]

export const dayMapping: Record<DayOfWeek, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday"
}




export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

export type MealType = "breakfast" | "lunch" | "dinner"

export type CuisineType = "indian" | "chinese" | "continental" | "other"

export type DietaryType = "veg" | "non-veg" | "vegan"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface Cook extends User {
  userrole: "cook"
  description: string
  address: string
  profilePicture?: string
  certification?: string
  rating: number
  totalOrders: number
  totalEarnings: number
  isAvailable: boolean
  weeklySchedule?: WeeklySchedule
}

export interface MenuItem {
  id: string
  cookId: string
  name: string
  description: string
  price: number
  dietaryType: DietaryType
  cuisineType: CuisineType
  mealType: MealType
  dayOfWeek: number
  isAvailable: boolean
  image?: string
}

export interface Order {
  id: string
  studentId: string
  cookId: string
  deliveryId?: string
  items: MenuItem[]
  status: OrderStatus
  totalAmount: number
  specialInstructions?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends MenuItem {
  quantity: number;
  menuItems?: MenuItem[];
}


export interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    getCartTotal: () => number;
    clearCart: () => void;
  }

