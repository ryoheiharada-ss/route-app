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

// 日本時間を処理する関数を修正
function formatJSTDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  
  // デバッグ用に入力時刻を出力
  console.log('[DateTime Debug] Input:', {
    originalString: dateTimeString,
    parsedDate: date.toLocaleString('ja-JP'),
    hours: date.getHours()
  });

  // ブラウザのローカル時間からJSTへの調整
  const jstTime = new Date(date.getTime());
  // JSTでの時刻をUTCとして扱う（時差の-9時間を補正）
  jstTime.setHours(date.getHours() + 9);

  // APIが期待する形式（YYYY-MM-DDThh:mm:ss）に変換
  const formatted = 
    `${jstTime.getFullYear()}-` +
    `${String(jstTime.getMonth() + 1).padStart(2, '0')}-` +
    `${String(jstTime.getDate()).padStart(2, '0')}T` +
    `${String(jstTime.getHours()).padStart(2, '0')}:` +
    `${String(jstTime.getMinutes()).padStart(2, '0')}:00`;

  // デバッグ用に変換結果を出力
  console.log('[DateTime Debug] Output:', {
    formattedString: formatted,
    adjustedHours: jstTime.getHours(),
    expectedArrivalJST: date.getHours()
  });

  return formatted;
}

export async function searchRoute(params: RouteSearchParams) {
  // APIリクエストのデバッグ出力を追加
  console.log('[Input DateTime]', {
    original: params.goalTime,
    formatted: formatJSTDateTime(params.goalTime)
  });

  const searchParams = new URLSearchParams({
    start: `${params.start.lat},${params.start.lng}`,
    goal: `${params.goal.lat},${params.goal.lng}`,
    datum: 'wgs84',
    term: '1440',
    limit: '1',
    coord_unit: 'degree',
    goal_time: formatJSTDateTime(params.goalTime)  // 日本時間として処理
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
