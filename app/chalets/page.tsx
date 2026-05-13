import { fetchProperties } from '@/lib/data';
import ChaletsClientPage from '@/components/custom/ChaletsClientPage';
import { Property } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestros Chalets',
  description: 'Explorá nuestro catálogo de chalets y encontrá tu hospedaje ideal.',
};

interface ChaletsPageProps {
  searchParams: {
    startDate?: string;
    endDate?: string;
    guests?: string;
    amenities?: string;
    categoria?: string;
  };
}

const ChaletsPage = async ({ searchParams }: ChaletsPageProps) => {
  const { startDate, endDate, guests, amenities, categoria } = await searchParams;
  const initialProperties: Property[] = await fetchProperties({ startDate, endDate, guests, amenities, category: categoria });

  return <ChaletsClientPage initialProperties={initialProperties} />;
};

export default ChaletsPage;
