'use client'

import { useSearchParams } from 'next/navigation'
import { RouteDisplay } from '@/route-search/route-display'
import { searchRoute } from '@/lib/route-api'
import { useEffect, useState } from 'react'

function formatGoalTime(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().replace(/\.\d{3}Z$/, '');  // ミリ秒を除去
}

export default function RoutePage() {
  const searchParams = useSearchParams()
  const [routeResult, setRouteResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const routeData = {
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
    datetime: searchParams.get('datetime') || '',
  }

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const departureLat = searchParams.get('departureLat')
        const departureLng = searchParams.get('departureLng')
        const arrivalLat = searchParams.get('arrivalLat')
        const arrivalLng = searchParams.get('arrivalLng')
        const datetime = searchParams.get('datetime')

        if (!departureLat || !departureLng || !arrivalLat || !arrivalLng || !datetime) {
          throw new Error('Missing required parameters')
        }

        const result = await searchRoute({
          start: {
            lat: parseFloat(departureLat),
            lng: parseFloat(departureLng)
          },
          goal: {
            lat: parseFloat(arrivalLat),
            lng: parseFloat(arrivalLng)
          },
          goalTime: formatGoalTime(datetime)
        })

        setRouteResult(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '経路検索に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchRoute()
  }, [searchParams])

  if (loading) return <div className="min-h-screen p-4">Loading...</div>
  if (error) return <div className="min-h-screen p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen p-4 pt-8">
      <RouteDisplay 
        routeData={routeData} 
        routeResult={routeResult} 
      />
    </div>
  )
}
