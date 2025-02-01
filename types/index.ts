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
          cook_id: "1",
          item_name: "Monday Special Thali",
          description: "Roti, Dal, Rice, 2 Sabzi, Salad, Pickle",
          price: 150,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 1,
          isAvailable: true,
        },
      ],
      2: [ // Tuesday
        {
          id: "t1",
          cook_id: "1",
          item_name: "Tuesday Special Thali",
          description: "Puri, Chole, Rice, Raita, Sweet",
          price: 160,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 2,
          isAvailable: true,
        },
      ],
      3: [ // Wednesday
        {
          id: "w1",
          cook_id: "1",
          item_name: "Wednesday Special Thali",
          description: "Paratha, Paneer, Rice, Dal, Dessert",
          price: 180,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 3,
          isAvailable: true,
        },
      ],
      4: [ // Thursday
        {
          id: "th1",
          cook_id: "1",
          item_name: "Thursday Special Thali",
          description: "South Indian Special",
          price: 170,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 4,
          isAvailable: true,
        },
      ],
      5: [ // Friday 
        {
          id: "f1",
          cook_id: "1",
          item_name: "Friday Special Thali",
          description: "Biryani Special",
          price: 200,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 5,
          isAvailable: true,
        },
      ],
      6: [ // Saturday
        {
          id: "s1",
          cook_id: "1",
          item_name: "Saturday Special Thali",
          description: "Party Special",
          price: 220,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 6,
          isAvailable: true,
        },
      ],
      7: [ // Sunday
        {
          id: "su1",
          cook_id: "1",
          item_name: "Sunday Special Thali",
          description: "Festival Special",
          price: 250,
          dietary_type: "veg",
          cuisine_type: "indian",
          meal_type: "lunch",
          day_of_week: 7,
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
  cook_id: string
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
  cook_id: string
  item_name: string
  description: string
  price: number
  dietary_type: string
  cuisine_type: string
  meal_type: string
  day_of_week: number
  isAvailable: boolean
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

