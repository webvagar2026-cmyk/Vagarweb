"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getFilteredRowModel,
    Row,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import Link from "next/link"

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/components/ui/use-toast"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

// Extends TData to ensure it has an ID for DnD key
interface DataWithId {
    id: number;
    [key: string]: unknown;
}

const SortableRow = ({ row }: { row: Row<DataWithId> }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: row.original.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? 'relative' as const : undefined,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            className={isDragging ? "bg-muted" : ""}
        >
            {row.getVisibleCells().map((cell) => {
                // Check if it's the drag handle column
                if (cell.column.id === 'drag') {
                    return (
                        <TableCell key={cell.id} {...attributes} {...listeners} className="cursor-move">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    )
                }

                return (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                )
            })}
        </TableRow>
    );
};


export function DataTable<TData extends DataWithId, TValue>({
    columns,
    data: initialData,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = React.useState(initialData);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const { toast } = useToast()

    // Update local state when initialData changes (e.g. after fetch)
    React.useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // pagination removed or handled carefully with drag and drop
        // getPaginationRowModel: getPaginationRowModel(), 
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
        // We might want to disable pagination for DnD to be processed on full list or handle it per page
        // For simplicity, we can show all or handle usage with pagination.
        // If pagination is active, DnD only works on current page which is fine.
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setData((old) => {
                const oldIndex = old.findIndex((item) => item.id === active.id);
                const newIndex = old.findIndex((item) => item.id === over?.id);

                const newData = arrayMove(old, oldIndex, newIndex);

                // Trigger API update
                // Re-calculate orders based on new index
                // We assume order should be 0, 1, 2...
                const updates = newData.map((item, index) => ({
                    id: item.id,
                    order: index,
                }));

                // Optimistic update done in setData, now sync
                fetch('/api/faq/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: updates }),
                }).then(res => {
                    if (!res.ok) throw new Error('Failed to save order');
                    toast({ description: "Orden actualizado correctamente" });
                }).catch(() => {
                    toast({
                        variant: "destructive",
                        description: "Error al guardar el orden"
                    });
                    // Revert on error? 
                    setData(old);
                });

                return newData;
            });
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Buscar preguntas..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <Link href="/admin/faq/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nueva Pregunta
                    </Button>
                </Link>
            </div>
            <div className="rounded-md border">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            <SortableContext
                                items={data.map((item) => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <SortableRow key={row.original.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No se encontraron resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            {/* Pagination Controls - Keeping them just in case, but usually DnD works better with full list */}
            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </Button>
            </div> */}
        </div>
    )
}
