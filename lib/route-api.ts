interface RouteSearchParams {
  start: {
    lat: number;
    lng: number;
  };
  goal: {
    lat: number;
    lng: number;
  };
  goalTime: string;
}

const API_CONFIG = {
  host: 'navitime-route-totalnavi.p.rapidapi.com',
  key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
  baseUrl: 'https://navitime-route-totalnavi.p.rapidapi.com/route_transit'
} as const;

export async function searchRoute(params: RouteSearchParams) {
  const searchParams = new URLSearchParams({
    start: `${params.start.lat},${params.start.lng}`,
    goal: `${params.goal.lat},${params.goal.lng}`,
    datum: 'wgs84',
    term: '1440',
    limit: '1',
    coord_unit: 'degree',
    goal_time: params.goalTime
  });

  const url = `${API_CONFIG.baseUrl}?${searchParams.toString()}`;

  // リクエストの詳細をログ出力
  console.log('[Route API Request]:', {
    url,
    params: Object.fromEntries(searchParams.entries()),
    headers: {
      'x-rapidapi-key': API_CONFIG.key ? '***' : 'missing',
      'x-rapidapi-host': API_CONFIG.host
    }
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.key || '',
        'x-rapidapi-host': API_CONFIG.host
      }
    });

    // エラーレスポンスの詳細を取得
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Route API Error Details]:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      throw new Error(`API request failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('[Route API Error]:', error);
    throw error;
  }
}
