'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DateTimePicker } from "./date-time-picker"
import { useRouter } from "next/navigation"
import { useEffect } from 'react';
import { getPlaceCoordinates } from '@/lib/google-maps';

const formSchema = z.object({
  departure: z.string().min(1, "出発地は必須です"),
  arrival: z.string().min(1, "到着地は必須です"),
  arrivalDateTime: z.date({
    required_error: "到着希望日時を選択してください",
  }),
})

export function RouteSearchForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure: "",
      arrival: "",
    },
  })

  useEffect(() => {
    // Google Maps JavaScript API をロード
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('[Search Request]', {
        departure: values.departure,
        arrival: values.arrival,
        datetime: values.arrivalDateTime
      });

      // 出発地と到着地の座標を取得
      const departureCoords = await getPlaceCoordinates(values.departure);
      const arrivalCoords = await getPlaceCoordinates(values.arrival);

      console.log('[Coordinates Result]', {
        departure: {
          place: values.departure,
          coordinates: departureCoords
        },
        arrival: {
          place: values.arrival,
          coordinates: arrivalCoords
        }
      });

      const params = new URLSearchParams({
        departure: values.departure,
        arrival: values.arrival,
        datetime: values.arrivalDateTime.toISOString(),
        ...(departureCoords && {
          departureLat: departureCoords.lat.toString(),
          departureLng: departureCoords.lng.toString(),
        }),
        ...(arrivalCoords && {
          arrivalLat: arrivalCoords.lat.toString(),
          arrivalLng: arrivalCoords.lng.toString(),
        }),
      });
      
      router.push(`/route?${params.toString()}`);
    } catch (error) {
      console.error('[Search Error]', error);
      // エラー処理を追加
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>出発地</FormLabel>
              <FormControl>
                <Input placeholder="東京駅" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="arrival"
          render={({ field }) => (
            <FormItem>
              <FormLabel>到着地</FormLabel>
              <FormControl>
                <Input placeholder="大阪駅" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arrivalDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>到着希望日時</FormLabel>
              <FormControl>
                <DateTimePicker 
                  date={field.value} 
                  setDate={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">経路検索</Button>
      </form>
    </Form>
  )
}
