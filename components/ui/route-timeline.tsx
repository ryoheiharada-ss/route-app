import { useState } from "react"
import { Clock, MapPin, Navigation, Train, Wallet, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "./card"
import { cn } from "@/lib/utils"
import { RouteSection } from "./route-section"
import type { RouteData, Section } from "@/types/route"

interface RouteTimelineProps {
  route: RouteData['items'][0]  // 型を明示的に指定
  routeData: {
    departure: string
    arrival: string
    datetime: string
  }
}

interface TimelineItemProps {
  type: "point" | "move"
  index: number
  totalLength: number
  children: React.ReactNode
}

function TimelineItem({ type, index, totalLength, children }: TimelineItemProps) {
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-3">
        <div
          className={cn("w-3 h-3 rounded-full", {
            "bg-primary": index === 0,
            "bg-destructive": index === totalLength - 1,
            "bg-muted": index > 0 && index < totalLength - 1,
          })}
        />
        {index < totalLength - 1 && <div className="w-0.5 h-16 bg-border" />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function RouteTimeline({ route, routeData }: RouteTimelineProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}(${weekday}) ${hours}:${minutes}`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // 合計運賃を計算する関数を追加
  const calculateTotalFare = (sections: Section[]) => {
    let totalFare = 0;
    let hasSuperexpress = false;

    sections.forEach(section => {
      if (section.type === 'move' && section.transport?.fare) {
        if (section.move === 'superexpress_train') {
          // 新幹線の場合：乗車券料金(unit_0) + 指定席料金(unit_2)
          hasSuperexpress = true;
          totalFare += section.transport.fare.unit_0; // 乗車券
          if (section.transport.fare.unit_2) {
            totalFare += section.transport.fare.unit_2; // 指定席
          }
        } else {
          // その他の交通機関は基本運賃のみ
          totalFare += section.transport.fare.unit_0;
        }
      }
    });

    return { totalFare, hasSuperexpress };
  };

  const { totalFare, hasSuperexpress } = calculateTotalFare(route.sections);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>{routeData.departure}</span>
              <ArrowRight size={16} />
              <MapPin size={16} />
              <span>{routeData.arrival}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>出発: {formatDateTime(route.summary.move.from_time)}</div>
            <div>到着: {formatDateTime(route.summary.move.to_time)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="bg-muted/30 p-4 border-b">
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-muted-foreground" />
              <span>{formatTime(route.summary.move.time)}</span>
            </div>
            <div className="flex items-center">
              <Wallet size={16} className="mr-1 text-muted-foreground" />
              <span>¥{totalFare.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex space-x-2 text-xs text-muted-foreground">
            <div>乗換: {route.summary.move.transit_count}回</div>
            <div>歩行: {formatDistance(route.summary.move.walk_distance)}</div>
            {hasSuperexpress && <div className="text-primary">(乗車券・指定席特急券含む)</div>}
          </div>
        </div>

        <div className="divide-y">
          {route.sections.map((section, index) => (
            <RouteSection
              key={index}
              section={section}
              nextSection={route.sections[index + 1]}
              index={index}
              totalLength={route.sections.length}
              isExpanded={expandedSection === index}
              onToggle={() => setExpandedSection(expandedSection === index ? null : index)}
              routeData={routeData}
              formatters={{
                formatDateTime,
                formatTime,
                formatDistance
              }}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-muted/20">
        <div className="w-full text-xs text-muted-foreground">
          <div>総距離: {formatDistance(route.summary.move.distance)}</div>
          <div>
            総運賃: ¥{totalFare.toLocaleString()}
            {hasSuperexpress && <span className="ml-1 text-primary">(乗車券・指定席特急券含む)</span>}
          </div>
          <div>検索日時: {formatDateTime(new Date().toISOString())}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
