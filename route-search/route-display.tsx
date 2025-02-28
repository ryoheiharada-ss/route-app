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
  // APIからのレスポンスがある場合はそれを使用し、ない場合はサンプルデータを使用
  const route = routeResult?.items[0] ?? require('./route.json').items[0]
  return <RouteTimeline route={route} routeData={routeData} />
}
