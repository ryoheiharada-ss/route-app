import { Navigation, Train, ArrowRight } from "lucide-react"
import type { Section } from "@/types/route"

interface RouteSectionProps {
  section: Section
  nextSection?: Section
  index: number
  totalLength: number
  isExpanded: boolean
  onToggle: () => void
  routeData: {
    departure: string
    arrival: string
    datetime: string
  }
  formatters: {
    formatDateTime: (date: string) => string
    formatTime: (minutes: number) => string
    formatDistance: (meters: number) => string
  }
}

export function RouteSection({
  section,
  nextSection,
  index,
  totalLength,
  isExpanded,
  onToggle,
  routeData,
  formatters
}: RouteSectionProps) {
  const getMoveIcon = (moveType: string | undefined) => {
    switch (moveType) {
      case 'walk':
        return <Navigation className="text-gray-600" size={18} />
      case 'local_train':
        return <Train className="text-green-600" size={18} />
      case 'superexpress_train':
        return <Train className="text-blue-600" size={18} />
      default:
        return <ArrowRight className="text-gray-600" size={18} />
    }
  }

  // 最後の目的地の場合
  if (section.type === "point" && index === totalLength - 1) {
    return (
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {section.name === "goal" ? routeData.arrival : section.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {nextSection ? formatters.formatDateTime(nextSection.from_time || "") : 
                 section.to_time ? formatters.formatDateTime(section.to_time) : ""}
              </div>
            </div>
            {section.gateway && (
              <div className="text-xs text-muted-foreground">
                {section.gateway}{section.gateway.endsWith('到着') ? '' : '到着'}
              </div>
            )}
            {section.numbering?.arrival && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                駅番号:
                {section.numbering.arrival.map((n, i) => (
                  <span key={i} className="bg-muted px-1 py-0.5 rounded">
                    {n.symbol}{n.number}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section.type !== "point" || !nextSection) return null

  return (
    <div className="p-4 hover:bg-muted/20 cursor-pointer transition-colors" onClick={onToggle}>
      <div className="flex items-start">
        <div className="flex flex-col items-center mr-3">
          <div className={`w-3 h-3 rounded-full ${
            index === 0 ? "bg-primary" :
            index === totalLength - 1 ? "bg-destructive" :
            "bg-muted"
          }`} />
          {index < totalLength - 1 && <div className="w-0.5 h-16 bg-border" />}
        </div>
        
        <div className="flex-1">
          <div className="font-medium">
            {section.name === "start" ? routeData.departure :
             section.name === "goal" ? routeData.arrival :
             section.name}
          </div>
          {section.gateway && (
            <div className="text-xs text-muted-foreground">{section.gateway}</div>
          )}
          {nextSection.type === "move" && (
            <div className="mt-2 flex items-center">
              {getMoveIcon(nextSection.move)}
              <div className="ml-2 flex-1">
                <div className="font-medium">
                  {nextSection.line_name}
                  {nextSection.transport?.type && ` (${nextSection.transport.type})`}
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>
                      {nextSection.time && formatters.formatTime(nextSection.time)} ·{" "}
                      {nextSection.distance && formatters.formatDistance(nextSection.distance)}
                    </span>
                    {nextSection.from_time && nextSection.to_time && (
                      <span>
                        {formatters.formatDateTime(nextSection.from_time)} →{" "}
                        {formatters.formatDateTime(nextSection.to_time)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isExpanded && nextSection.transport && (
        <div className="mt-2 text-xs bg-muted/20 p-2 rounded">
          <div>運行: {nextSection.transport.company.name || '不明'}</div>
          {nextSection.transport.fare_detail?.map((fare, index) => (
            <div key={index} className="pl-2">
              {fare.id === "1" && "普通席: "}
              {fare.id === "2" && "指定席: "}
              {fare.id === "3" && "グリーン席: "}
              ¥{fare.fare.toLocaleString()}
              {fare.default_extra_fare && " (基本料金)"}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
