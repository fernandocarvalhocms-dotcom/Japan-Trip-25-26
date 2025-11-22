
export enum ActivityType {
  FLIGHT,
  ACCOMMODATION,
  TRANSPORT,
  SIGHTSEEING,
  FOOD,
  SHOPPING,
  ACTIVITY,
  CUSTOM,
}

export interface ItineraryEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  location: string;
  type: ActivityType;
  suggestion?: string;
  coordinates: { lat: number; lng: number };
}

export interface ItineraryDay {
  id: number;
  date: string;
  dayOfWeek: string;
  title: string;
  events: ItineraryEvent[];
}

export type Itinerary = ItineraryDay[];

export interface ChecklistItem {
  id: number | string;
  label: string;
}

export interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

export interface HotelReservation {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

// Map Types
export type MapNodeType = 'station' | 'spot' | 'shop' | 'food' | 'landmark' | 'activity';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface MapNode {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  type: MapNodeType;
  labelPos?: LabelPosition; // Default 'top'
  description?: string;
  tips?: string;
}

export interface MapEdge {
  from: string;
  to: string;
  label?: string; // e.g. "2' a pé"
  type?: 'walk' | 'train' | 'subway';
}

export interface MapArea {
  id: string;
  title: string;
  description: string;
  generalTips?: string[];
  nodes: MapNode[];
  edges: MapEdge[];
}
