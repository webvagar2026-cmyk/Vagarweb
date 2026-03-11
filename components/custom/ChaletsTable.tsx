"use client";

import { useState } from 'react';
import { Property } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2, Pause, Play } from 'lucide-react';

interface ChaletsTableProps {
  initialChalets: Property[];
}

export default function ChaletsTable({ initialChalets }: ChaletsTableProps) {
  const [chalets, setChalets] = useState<Property[]>(initialChalets);
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este chalet?')) {
      return;
    }

    try {
      const response = await fetch(`/api/chalets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el chalet');
      }

      toast({
        title: 'Éxito',
        description: 'Chalet eliminado correctamente.',
      });

      const updatedChalets = chalets.filter(chalet => chalet.id !== id);
      setChalets(updatedChalets);

    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el chalet.',
        variant: 'destructive',
      });
    }
  };

  const handlePauseToggle = async (id: number, currentStatus: boolean | undefined) => {
    const newStatus = !currentStatus;
    
    try {
      const response = await fetch(`/api/chalets/${id}/pause`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_paused: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del chalet');
      }

      toast({
        title: 'Éxito',
        description: `Chalet ${newStatus ? 'pausado' : 'reanudado'} correctamente.`,
      });

      setChalets(chalets.map(chalet => 
        chalet.id === id ? { ...chalet, is_paused: newStatus } : chalet
      ));

    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del chalet.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Huéspedes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Precio (Alta)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chalets.map((chalet) => (
            <TableRow key={chalet.id} >
              <TableCell>
                <Image
                  src={chalet.main_image_url || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop"}
                  alt={chalet.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{chalet.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{chalet.category}</Badge>
              </TableCell>
              <TableCell>{chalet.guests}</TableCell>
              <TableCell>
                <Badge variant={chalet.is_paused ? "secondary" : "default"}>
                  {chalet.is_paused ? "Pausado" : "Activo"}
                </Badge>
              </TableCell>
              <TableCell>${chalet.price_high}</TableCell>
              <TableCell className="text-right flex justify-end">
                <Button 
                  title={chalet.is_paused ? "Publicar" : "Pausar"}
                  variant="outline" 
                  size="icon" 
                  className="mr-2"
                  onClick={() => handlePauseToggle(chalet.id, chalet.is_paused)}
                >
                  {chalet.is_paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span className="sr-only">{chalet.is_paused ? "Publicar" : "Pausar"}</span>
                </Button>
                <Button asChild variant="outline" size="icon" className="mr-2">
                  <Link href={`/admin/chalets/${chalet.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Link>
                </Button>
                <Button
                  title="Eliminar"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(chalet.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
