export interface RouteData {
  items: [{
    summary: {
      no: string;
      start: {
        type: string;
        coord: { lat: number; lon: number };
        name: string;
      };
      goal: {
        type: string;
        coord: { lat: number; lon: number };
        name: string;
      };
      move: {
        transit_count: number;
        walk_distance: number;
        fare: {
          unit_0: number;
          unit_1?: number;
          unit_2?: number;
          unit_3?: number;
        };
        type: string;
        from_time: string;
        to_time: string;
        time: number;
        distance: number;
        move_type: string[];
      };
    };
    sections: Section[];
  }];
}

export interface Section {
  type: "point" | "move";
  name?: string;
  move?: string;
  line_name?: string;
  transport?: Transport;
  from_time?: string;
  to_time?: string;
  coord?: {
    lat: number;
    lon: number;
  };
  time?: number;
  distance?: number;
  next_transit?: boolean;
  gateway?: string;
  numbering?: Numbering;
  node_id?: string;
  node_types?: string[];
}

interface StationNumbering {
  symbol: string;
  number: string;
}

interface Numbering {
  arrival?: StationNumbering[];
  departure?: StationNumbering[];
}

export interface Transport {
  name: string;
  company: { name: string };
  type: string;
  color?: string;
  fare?: {
    unit_0: number;
    unit_1?: number;
    unit_2?: number;
    unit_3?: number;
  };
  fare_detail?: TransportFareDetail[];
}

export interface TransportFareDetail {
  id: string;
  fare: number;
  start: { name: string; node_id: string };
  goal: { name: string; node_id: string };
  default_extra_fare?: boolean;
}
