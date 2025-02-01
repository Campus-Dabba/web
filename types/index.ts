export type UserRole = "student" | "cook" | "delivery" | "admin"

export type UserStatus = "pending" | "active" | "suspended"

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface WeeklySchedule {
  cookId: string
  schedule: {
    [key in DayOfWeek]: MenuItem[]
  }
}


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
  quantity: number
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

