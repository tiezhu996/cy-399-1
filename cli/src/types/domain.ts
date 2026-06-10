export type ShootType = 'portrait' | 'wedding' | 'id_photo' | 'commercial' | 'event';
export type TimeSlot = 'morning' | 'afternoon' | 'full_day';
export type OrderStatus = 'pending' | 'confirmed' | 'shooting' | 'completed' | 'cancelled';

export type ScheduleTemplate = {
  name: string;
  slot: TimeSlot;
  shootType: ShootType;
  price: number;
  city: string;
};

export type SchedulePayload = {
  dates: string[];
  slot: TimeSlot;
  shootType: ShootType;
  price: number;
  city: string;
};

export type ScheduleRecord = {
  date: string;
  slot: TimeSlot;
};

export type AppConfig = {
  apiBaseUrl: string;
  token?: string;
  user?: { id: number; username: string };
  scheduleTemplates?: ScheduleTemplate[];
};

export type Booking = { id: number; customerName: string; date: string; shootType: ShootType; note: string };
export type Order = { id: number; customerName: string; date: string; shootType: ShootType; status: OrderStatus; amount: number };
