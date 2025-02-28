export const routeResponse = {
  items: [
    {
      summary: {
        no: "1",
        start: {
          type: "point",
          coord: {
            lat: 35.656732,
            lon: 139.699681
          },
          name: "start"
        },
        goal: {
          type: "point",
          coord: {
            lat: 34.73347,
            lon: 135.49768
          },
          name: "goal"
        },
        move: {
          transit_count: 1,
          walk_distance: 956,
          fare: {
            unit_1: 4960.0,
            unit_2: 5810.0,
            unit_0: 8910.0,
            unit_3: 10680.0
          },
          type: "move",
          from_time: "2025-03-13T08:47:00+09:00",
          to_time: "2025-03-13T12:00:00+09:00",
          time: 193,
          distance: 553956,
          move_type: [
            "local_train",
            "superexpress_train",
            "walk"
          ]
        }
      },
      sections: [
        // ...existing sections from route.json...
      ]
    }
  ],
  unit: {
    datum: "wgs84",
    coord_unit: "degree",
    distance: "metre",
    time: "minute",
    currency: "JPY"
  }
} as const;
