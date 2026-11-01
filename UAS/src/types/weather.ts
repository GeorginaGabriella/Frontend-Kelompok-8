export interface WeatherData {
  name: string;
  region: string;

  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };

  weather: {
    main: string;
    description: string;
    icon: string;
  }[];

  wind: {
    speed: number;
  };

  culinaryRecommendation: string;
  source: string;
}
