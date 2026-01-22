"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

interface GoogleMapsEmbedProps {
  latitude: number;
  longitude: number;
}

export function GoogleMapsEmbed({ latitude, longitude }: GoogleMapsEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-200 rounded-lg">
        <p className="text-slate-500">API Key de Google Maps</p>
      </div>
    );
  }

  const position = { lat: latitude, lng: longitude };

  // Styles to hide Points of Interest (POIs)
  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ visibility: "off" }],
    },
    // Opcional: Ocultar transporte público si se desea limpiar más
    // {
    //   featureType: "transit",
    //   stylers: [{ visibility: "off" }],
    // },
  ];

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-full w-full rounded-lg overflow-hidden">
        <Map
          defaultCenter={position}
          defaultZoom={15}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker, can be any string for basic usage or a real ID from Google Console
          styles={mapStyles}
          disableDefaultUI={false}
          gestureHandling={"cooperative"}
        >
          <AdvancedMarker position={position}>
            <Pin background={"#EA4335"} borderColor={"#B31412"} glyphColor={"#FFF"} />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
