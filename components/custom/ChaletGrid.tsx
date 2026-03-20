'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/lib/types';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './PropertyCardSkeleton';
import { H2 } from '@/components/ui/typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChaletGridProps {
  initialProperties: Property[];
  totalCount: number;
}

const SKELETON_COUNT = 12;

const ChaletGrid = ({ initialProperties, totalCount }: ChaletGridProps) => {
  const [sortOrder, setSortOrder] = useState('rating-desc');
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  // Ordena y muestra todas las propiedades. El skeleton solo aparece
  // en el render inicial y cuando el usuario cambia el orden.
  // No hay paginación falsa: toda la data ya está en memoria.
  useEffect(() => {
    setIsLoading(true);

    const sorted = [...initialProperties].sort((a, b) => {
      switch (sortOrder) {
        case 'rating-desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'rating-asc':
          return (a.rating ?? 0) - (b.rating ?? 0);
        case 'price-desc':
          return (b.price_low ?? 0) - (a.price_low ?? 0);
        case 'price-asc':
          return (a.price_low ?? 0) - (b.price_low ?? 0);
        default:
          return 0;
      }
    });

    // Timeout breve para mostrar el skeleton al re-ordenar (UX feedback)
    const timer = setTimeout(() => {
      setProperties(sorted);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [sortOrder, initialProperties]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <H2 className='text-lg'>{`${totalCount} Chalet${totalCount !== 1 ? 's' : ''}`}</H2>
        <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
          <SelectTrigger className="text-xs w-[180px]">
            <SelectValue placeholder="Ordenar por:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="rating-desc">Mayor Calificacion</SelectItem>
            <SelectItem className="text-xs" value="rating-asc">Menor Calificacion</SelectItem>
            <SelectItem className="text-xs" value="price-desc">Mayor Precio</SelectItem>
            <SelectItem className="text-xs" value="price-asc">Menor Precio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-5">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))
          : properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
      </div>
    </div>
  );
};

export default ChaletGrid;
