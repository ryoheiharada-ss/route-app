'use client'

import { RouteTimeline } from "@/components/ui/route-timeline"
import type { RouteData } from "@/types/route"

interface RouteDisplayProps {
  routeData: {
    departure: string
    arrival: string
    datetime: string
  }
  routeResult: {
    items: RouteData['items']
  } | null
}

export function RouteDisplay({ routeData, routeResult }: RouteDisplayProps) {
  // サンプルデータを使用する場合は1つの経路を3回複製
  const routes = routeResult?.items ?? [require('./route.json').items[0]].concat(
    Array(2).fill(require('./route.json').items[0])
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex gap-6 px-4 min-w-fit">
        {routes.map((route, index) => (
          <div key={index} className="relative w-[360px]">
            <div className="absolute -top-6 left-2 text-sm font-medium text-muted-foreground">
              経路{index + 1}
            </div>
            <RouteTimeline 
              route={route} 
              routeData={routeData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
