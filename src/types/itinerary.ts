export interface Activity {
  time: string;
  activity: string;
  location: string;
  cost: string;
}

export interface DayItinerary {
  day: number;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
}

export interface ParsedItinerary {
  days: DayItinerary[];
  extraRemarks?: string;
}

export interface ActivityItem {
  time: string;
  activity: string;
  location: string;
  cost: string;
}

export interface ParsedItinerary {
  days: Array<{
    day: number;
    morning: ActivityItem;
    afternoon: ActivityItem;
    evening: ActivityItem;
  }>;
  extraRemarks?: string;
}