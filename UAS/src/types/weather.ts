export interface WeatherData {
  name: string;
  region: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  culinaryRecommendation: string;
  source: "openweathermap" | "nusantara-fallback";
}
