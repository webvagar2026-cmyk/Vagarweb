import { fetchProperties } from '@/lib/data';
import MapContainer from '@/components/custom/MapContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa de Chalets',
  description: 'Ubicá nuestros chalets en el mapa interactivo de Chumamaya Country Club.',
  openGraph: {
    images: [{ url: "/mapa.png", width: 1200, height: 630 }],
  },
};

interface MapPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const MapPage = async ({ searchParams }: MapPageProps) => {
  const properties = await fetchProperties();
  const resolvedSearchParams = await searchParams;
  const chaletId = typeof resolvedSearchParams.chaletId === 'string' ? resolvedSearchParams.chaletId : null;

  let initialNodeId = null;
  if (chaletId) {
    const selectedProperty = properties.find((p) => p.id.toString() === chaletId);
    if (selectedProperty) {
      initialNodeId = selectedProperty.map_node_ids?.[0] || null;
    }
  }

  return <MapContainer properties={properties} initialSelectedNodeId={initialNodeId} />;
};

export default MapPage;
