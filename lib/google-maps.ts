declare global {
  interface Window {
    google: typeof google;
  }
}

let placesService: google.maps.places.PlacesService | null = null;

export const initPlacesService = () => {
  if (typeof window === 'undefined') return null;
  if (!placesService) {
    const element = document.createElement('div');
    placesService = new google.maps.places.PlacesService(element);
  }
  return placesService;
};

export const getPlaceCoordinates = async (placeName: string): Promise<{ lat: number; lng: number } | null> => {
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  return new Promise((resolve, reject) => {
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv, {
      center: { lat: 35.6812362, lng: 139.7671248 },
      zoom: 15,
    });

    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.TextSearchRequest = {
      query: placeName,
      // TextSearchRequest doesn't use fields parameter
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        const coordinates = {
          lat: location.lat(),
          lng: location.lng(),
        };
        
        // APIレスポンスのデバッグ出力
        console.log(`[Place API Result] ${placeName}:`, {
          status,
          coordinates,
          rawResults: results
        });
        
        resolve(coordinates);
      } else {
        console.error(`[Place API Error] ${placeName}:`, {
          status,
          results
        });
        resolve(null);
      }
    });
  });
};
