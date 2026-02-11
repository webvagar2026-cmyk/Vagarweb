"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Faq } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, GripVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const FaqActions = ({ faq }: { faq: Faq }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta pregunta frecuente?")) return;

        try {
            const response = await fetch(`/api/faq/${faq.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            toast({
                title: "Eliminado",
                description: "La pregunta frecuente ha sido eliminada.",
            });
            router.refresh();
        } catch {
            toast({
                title: "Error",
                description: "No se pudo eliminar.",
                variant: 'destructive',
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/faq/${faq.id}`} className="flex items-center">
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Faq>[] = [
    {
        id: "drag",
        cell: () => {
            return (
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-move drag-handle">
                    <GripVertical className="h-4 w-4" />
                </Button>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "question",
        header: "Pregunta",
    },
    {
        accessorKey: "answer",
        header: "Respuesta",
        cell: ({ row }) => {
            const answer = row.getValue("answer") as string;
            return <div className="max-w-[500px] truncate">{answer}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <FaqActions faq={row.original} />,
    },
];
