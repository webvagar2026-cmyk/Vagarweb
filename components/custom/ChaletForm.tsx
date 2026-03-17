"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Property, Amenity } from "@/lib/types";

const mapNodeIds = [
  "_2_-_8-9", "_5_-_14-15", "_9_-_13-14", "_9_-_11", "_9_-_7", "_9_-_22", "_11_-_10", "_11_-_7", "_11_-_8", "_11_-_21", "_11_-_23-24", "_12_-_10", "_12_-_17", "_12_-_18", "_12_-_19", "_7_-_6-7", "_7_-_18-19", "_7_-_20", "_7_-_21", "_16_-_12-13", "_16_-_17", "_17_-_1", "_17_-_2", "_17_-_3", "_17_-_23", "_17_-_10", "_17_-_11-12", "_18_-_11-12", "_19_-_4-5", "_31_-_4", "_29_-_6-7", "_24_-_1-2", "_24_-_8-9", "_22_-_5", "_22_-_6", "_22_-_15-16", "_22_-_17", "_1_-_1-2", "_1_-_3-4", "_2_-_1-2-3", "_2_-_4-5", "_2_-_6-7", "_2_-_10-11", "_2_-_12-13", "_2_-_14-15", "_2_-_16", "_2_-_17", "_3_-_1", "_3_-_2-6", "_3_-_3-7", "_3_-_5", "_3_-_4", "_3_-_8", "_4_-_1", "_5_-_1", "_5_-_2", "_5_-_3", "_5_-_4", "_5_-_5", "_5_-_6", "_5_-_7", "_5_-_8", "_5_-_9", "_5_-_10", "_5_-_11", "_5_-_12", "_5_-_13", "_5_-_17", "_5_-_18", "_5_-_19-20", "_6_-_1", "_6_-_2", "_8_-_1", "_8_-_2-3", "_8_-_4", "_8_-_5", "_8_-_6-7", "_8_-_8", "_8_-_9-10", "_8_-_11", "_8_-_12", "_8_-_13", "_8_-_14", "_9_-_1", "_9_-_2", "_9_-_3", "_9_-_4", "_9_-_5-6", "_9_-_8", "_9_-_9", "_9_-_10", "_9_-_12", "_9_-_15-16", "_9_-_17", "_9_-_18", "_9_-_19", "_9_-_20-21", "_9_-_23", "_9_-_24", "_9_-_25", "_9_-_26", "_9_-_27", "_9_-_28", "_9_-_29", "_10_-_1", "_10_-_2", "_11_-_1", "_11_-_2", "_11_-_3-4", "_11_-_5", "_11_-_6", "_11_-_9", "_11_-_11", "_11_-_12", "_11_-_13-14", "_11_-_15", "_11_-_16", "_11_-_17-18", "_11_-_19", "_11_-_20", "_11_-_22", "_12_-_1-2", "_12_-_3", "_12_-_4", "_12_-_5", "_12_-_6-7", "_12_-_8-9", "_12_-_11", "_12_-_12", "_12_-_13", "_12_-_14", "_12_-_15", "_12_-_16", "_13_-_1-2-3", "_13_-_4-5", "_13_-_6-7", "_13_-_8", "_13_-_9", "_13_-_10", "_14_-_1", "_14_-_2", "_14_-_3", "_14_-_4", "_14_-_5-6", "_14_-_7", "_14_-_8", "_14_-_9", "_14_-_10", "_14_-_11", "_14_-_12", "_14_-_13", "_14_-_14", "_14_-_15", "_14_-_16", "_14_-_17", "_14_-_18", "_14_-_19", "_14_-_20", "_14_-_21", "_14_-_22", "_14_-_23", "_14_-_24", "_14_-_25", "_15_-_1", "_15_-_2", "_15_-_3", "_15_-_4", "_15_-_5", "_15_-_6", "_15_-_7", "_15_-_8", "_15_-_9", "_15_-_10", "_15_-_11", "_15_-_12", "_15_-_13", "_15_-_14", "_15_-_15", "_15_-_16", "_15_-_17", "_15_-_18", "_15_-_19", "_15_-_20", "_16_-_1", "_16_-_2", "_16_-_3-4-5", "_16_-_6-7-8", "_16_-_9", "_16_-_10-11", "_16_-_14", "_16_-_15", "_16_-_16", "_16_-_18", "_16_-_19", "_16_-_20", "_16_-_21-22", "_16_-_23-24", "_16_-_25-26", "_16_-_27", "_16_-_28", "_17_-_4", "_17_-_5", "_17_-_6", "_17_-_7", "_17_-_8", "_17_-_9", "_17_-_13", "_17_-_14", "_17_-_15", "_17_-_16", "_17_-_17", "_17_-_18", "_17_-_19", "_17_-_20", "_17_-_21", "_17_-_22", "_18_-_1", "_18_-_2", "_18_-_3", "_18_-_4", "_18_-_5", "_18_-_6", "_18_-_7", "_18_-_8", "_18_-_9", "_18_-_10", "_18_-_13", "_18_-_14-15", "_19_-_1", "_19_-_2-3", "_19_-_6", "_19_-_7-8", "_19_-_9-10", "_19_-_11", "_19_-_12", "_19_-_13", "_19_-_14-15", "_20_-_1-5", "_20_-_2", "_20_-_3-4", "_21_-_1", "_21_-_2-3-4", "_21_-_5", "_22_-_1-2", "_22_-_3", "_22_-_4", "_22_-_7-8", "_22_-_9", "_22_-_10", "_22_-_11", "_22_-_12", "_22_-_13-14", "_23_-_1", "_23_-_2", "_23_-_3", "_23_-_4-5", "_23_-_6-7", "_23_-_8", "_23_-_9-10", "_24_-_3-4", "_24_-_5", "_24_-_6-7", "_24_-_10", "_7_-_1-2", "_7_-_5", "_7_-_8", "_7_-_9", "_7_-_10", "_7_-_11-12", "_7_-_13", "_7_-_14-15", "_7_-_16", "_7_-_17", "_7_-_22", "_7_-_23", "_7_-_24", "_7_-_25", "_25_-_1", "_25_-_2-3", "_25_-_4-5", "_25_-_6-7", "_25_-_8", "_25_-_9", "_26_-_1-2", "_26_-_3", "_26_-_4", "_26_-_5-6", "_26_-_7", "_26_-_8", "_26_-_9", "_26_-_10", "_26_-_11", "_26_-_12", "_26_-_13", "_26_-_14", "_26_-_15-16", "_26_-_17", "_27_-_1", "_27_-_2-3", "_27_-_4", "_27_-_5", "_27_-_6-7", "_28_-_1-10", "_28_-_2", "_28_-_3-4", "_28_-_5-6", "_28_-_7-8-9", "_29_-_1-2-10", "_29_-_3", "_29_-_4", "_29_-_5", "_29_-_8-9", "_30_-_1-2", "_30_-_3", "_30_-_4", "_30_-_5-6", "_30_-_7-9", "_30_-_8", "_31_-_1", "_31_-_2", "_31_-_3", "_31_-_5-6"
];

const numericString = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  })
  .refine((val) => val === null || typeof val === "number", {
    message: "Debe ser un número válido",
  });

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  slug: z.string().optional(),
  description: z.string().optional(),
  optional_services: z.string().optional(),
  latitude: numericString.refine(val => val === null || (val >= -90 && val <= 90), { message: "Latitud fuera de rango" }),
  longitude: numericString.refine(val => val === null || (val >= -180 && val <= 180), { message: "Longitud fuera de rango" }),
  category: z.string().min(1, { message: "La categoría es obligatoria." }),
  guests: numericString.refine(val => val === null || (Number.isInteger(val) && val > 0), { message: "Debe ser un entero positivo" }),
  bedrooms: numericString.refine(val => val === null || (Number.isInteger(val) && val > 0), { message: "Debe ser un entero positivo" }),

  bathrooms: numericString.refine(val => val === null || (Number.isInteger(val) && val > 0), { message: "Debe ser un entero positivo" }),
  rating: numericString.refine(val => val === null || (val >= 0 && val <= 10), { message: "Debe estar entre 0 y 10" }),
  price_high: numericString.refine(val => val === null || (val > 0 && val < 100000000), { message: "El precio debe ser positivo y menor a 100,000,000" }),
  price_mid: numericString.refine(val => val === null || (val > 0 && val < 100000000), { message: "El precio debe ser positivo y menor a 100,000,000" }),
  price_low: numericString.refine(val => val === null || (val > 0 && val < 100000000), { message: "El precio debe ser positivo y menor a 100,000,000" }),
  map_node_id: z.string().optional(),
  video_url: z.string().url({ message: "Por favor, introduce una URL válida." }).or(z.literal("")).optional(),
  featured: z.boolean().default(false),
  gallery_images: z.array(z.string().url({ message: "Por favor, introduce una URL válida." })).optional(),
  blueprint_images: z.array(z.string().url({ message: "Por favor, introduce una URL válida." })).optional(),
  amenities: z.array(z.string()).optional(),
  rules: z.array(z.object({
    id: z.number().optional(),
    rule_text: z.string().min(1, { message: "La regla no puede estar vacía." })
  })).optional(),
});

type ChaletFormValues = z.infer<typeof formSchema>;

interface ChaletFormProps {
  defaultValues?: Property;
  usedMapNodeIds?: string[];
  allAmenities: Amenity[];
}

export function ChaletForm({ defaultValues, usedMapNodeIds = [], allAmenities }: ChaletFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!defaultValues;

  // Filter out used map node IDs, but always include the current one in edit mode
  const availableMapNodeIds = mapNodeIds.filter(
    (id) => !usedMapNodeIds.includes(id) || id === defaultValues?.map_node_id
  );

  const getInitialValues = (): ChaletFormValues => {
    const initialValues: ChaletFormValues = {
      name: "",
      slug: "",
      description: "",
      optional_services: "",
      latitude: null,
      longitude: null,
      category: "",
      guests: null,
      bedrooms: null,

      bathrooms: null,
      rating: null,
      price_high: null,
      price_mid: null,
      price_low: null,
      map_node_id: "",
      video_url: "",
      featured: false,
      gallery_images: [],
      blueprint_images: [],
      amenities: [],
      rules: [],
    };

    if (!isEditMode || !defaultValues) {
      return initialValues;
    }

    // Safely map Property to ChaletFormValues
    const mappedValues: ChaletFormValues = {
      ...initialValues,
      name: defaultValues.name,
      slug: defaultValues.slug || "",
      description: defaultValues.description || "",
      optional_services: defaultValues.optional_services || "",
      latitude: defaultValues.latitude ?? null,
      longitude: defaultValues.longitude ?? null,
      category: defaultValues.category || "",
      guests: defaultValues.guests ?? null,
      bedrooms: defaultValues.bedrooms ?? null,

      bathrooms: defaultValues.bathrooms ?? null,
      rating: defaultValues.rating ?? null,
      price_high: defaultValues.price_high ?? null,
      price_mid: defaultValues.price_mid ?? null,
      price_low: defaultValues.price_low ?? null,
      map_node_id: defaultValues.map_node_id || "",
      video_url: defaultValues.video_url || "",
      featured: defaultValues.featured || false,
      gallery_images: defaultValues.gallery_images?.map((img) => img.url) || [],
      blueprint_images: defaultValues.blueprint_images?.map((img) => img.url) || [],
      amenities: defaultValues.amenities?.map(amenity => amenity.slug) || [],
      rules: defaultValues.rules || [],
    };
    return mappedValues;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const { watch, setValue } = form;
  const chaletName = watch("name");
  const priceHigh = watch("price_high");

  useEffect(() => {
    if (chaletName) {
      setValue("slug", slugify(chaletName), { shouldValidate: true });
    }
  }, [chaletName, setValue]);

  useEffect(() => {
    const price = Number(priceHigh);
    if (!Number.isNaN(price) && price > 0) {
      const midPrice = price * 0.8;
      const lowPrice = price * 0.6;
      setValue("price_mid", Math.round(midPrice), { shouldValidate: true });
      setValue("price_low", Math.round(lowPrice), { shouldValidate: true });
    }
  }, [priceHigh, setValue]);

  const [newRule, setNewRule] = useState("");

  async function onSubmit(values: ChaletFormValues) {
    setIsSubmitting(true);
    try {
      const url = isEditMode ? `/api/chalets/${defaultValues.id}` : '/api/chalets';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el chalet`);
      }

      toast({
        title: "Éxito",
        description: `El chalet ha sido ${isEditMode ? 'actualizado' : 'guardado'} correctamente.`,
      });

      if (!isEditMode) {
        form.reset();
      }
    } catch {
      toast({
        title: "Error",
        description: `No se pudo ${isEditMode ? 'actualizar' : 'guardar'} el chalet. Inténtalo de nuevo.`,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Chalet</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Chalet del Bosque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Amigable (Slug)</FormLabel>
              <FormControl>
                <Input placeholder="Se generará automáticamente" {...field} disabled />
              </FormControl>
              <FormDescription>
                Este es el identificador que se usará en la URL. Se genera a partir del nombre.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe la propiedad..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="optional_services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicios Opcionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe los servicios opcionales que ofrece la propiedad..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Este texto aparecerá en la sección de servicios opcionales en la página del chalet.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Ej: -31.975"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Ej: -64.56"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Celeste">Celeste</SelectItem>
                    <SelectItem value="Verde">Verde</SelectItem>
                    <SelectItem value="Azul">Azul</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 4.5"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huéspedes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 4"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dormitorios</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 2"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baños</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 1"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="price_high"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Temp. Alta</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 200.00"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_mid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Temp. Media</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 150.00"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_low"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Temp. Baja</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 100.00"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="map_node_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Nodo del Mapa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un ID de nodo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableMapNodeIds.map(nodeId => (
                    <SelectItem key={nodeId} value={nodeId}>
                      {nodeId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                El ID único del polígono en el SVG del mapa interactivo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Video de YouTube</FormLabel>
              <FormControl>
                <Input placeholder="Ej: https://www.youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormDescription>
                Pega la URL completa del video de YouTube.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gallery_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes de la Galería</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                />
              </FormControl>
              <FormDescription>
                Sube las imágenes para la galería de la propiedad.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blueprint_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planos de la Propiedad</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                />
              </FormControl>
              <FormDescription>
                Sube las imágenes de los planos de la propiedad.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Normas del Chalet</FormLabel>
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="Ej: No se permiten mascotas"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newRule.trim()) {
                  appendRule({ rule_text: newRule.trim() });
                  setNewRule("");
                }
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {ruleFields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between rounded-md border p-2">
                <p className="text-sm">{form.getValues(`rules.${index}.rule_text`)}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
          <FormDescription className="mt-2">
            Añade las reglas que los huéspedes deben seguir.
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Amenities</FormLabel>
                <FormDescription>
                  Selecciona los servicios que ofrece el chalet.
                </FormDescription>
              </div>
              <div className="space-y-6">
                {Object.entries(
                  allAmenities.reduce((acc, amenity) => {
                    const category = amenity.category || "Otros";
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(amenity);
                    return acc;
                  }, {} as Record<string, typeof allAmenities>)
                ).map(([category, amenities]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-3">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {amenities.map((amenity) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.slug)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), amenity.slug])
                                        : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== amenity.slug
                                          )
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Propiedad Destacada
                </FormLabel>
                <FormDescription>
                  Marcar esta propiedad para que aparezca en la sección de destacadas en la home.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : (isEditMode ? "Actualizar Chalet" : "Guardar Chalet")}
        </Button>
      </form>
    </Form>
  );
}
