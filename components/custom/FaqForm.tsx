"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Faq } from "@/lib/types";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    question: z.string().min(5, { message: "La pregunta debe tener al menos 5 caracteres." }),
    answer: z.string().min(10, { message: "La respuesta debe tener al menos 10 caracteres." }),
    order: z.number().optional(),
});

type FaqFormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
    defaultValues?: Faq;
}

export function FaqForm({ defaultValues }: FaqFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const isEditMode = !!defaultValues;

    const form = useForm<FaqFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: defaultValues?.question || "",
            answer: defaultValues?.answer || "",
            // order is handled by the backend or preserved if editing, not exposed in form
        },
    });

    async function onSubmit(values: FaqFormValues) {
        setIsSubmitting(true);
        try {
            const url = isEditMode ? `/api/faq/${defaultValues.id}` : '/api/faq';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la pregunta frecuente');
            }

            toast({
                title: "Éxito",
                description: `La pregunta frecuente ha sido ${isEditMode ? 'actualizada' : 'creada'} correctamente.`,
            });

            router.push("/admin/faq");
            router.refresh();
        } catch {
            toast({
                title: "Error",
                description: "No se pudo guardar la pregunta frecuente.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pregunta</FormLabel>
                            <FormControl>
                                <Input placeholder="¿Cuál es el horario de check-in?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Respuesta</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="El check-in es a partir de las 14:00hs..."
                                    className="resize-none h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : (isEditMode ? "Actualizar" : "Crear")}
                </Button>
            </form>
        </Form>
    );
}
