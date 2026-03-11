import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import supabase from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    // path could be /api/chalets/[id]/pause, so we want the [id] part which is the second to last
    const pathParts = url.pathname.split('/');
    const propertyId = pathParts[pathParts.length - 2];
    
    if (!propertyId || isNaN(Number(propertyId))) {
      return NextResponse.json({ error: "ID de chalet inválido o no encontrado en la URL" }, { status: 400 });
    }

    const body = await request.json();
    const { is_paused } = body;

    if (typeof is_paused !== 'boolean') {
      return NextResponse.json({ error: "is_paused debe ser un valor booleano" }, { status: 400 });
    }

    // Actualizar el estado de pausa
    const { error: updateError } = await supabase
      .from("properties")
      .update({ is_paused })
      .eq("id", propertyId);

    if (updateError) {
      console.error("Error toggling pause status:", updateError);
      return NextResponse.json({ error: "Error al actualizar el estado del chalet.", details: updateError.message }, { status: 500 });
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/chalets");
    // Also revalidate the specific chalet page if we had a way to get the slug easily, but we'll revalidate the layout just in case.
    revalidatePath(`/chalets/[slug]`, 'page');
    revalidatePath("/admin/chalets");

    return NextResponse.json({ message: "Estado de publicación actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("An unexpected error occurred during PATCH for pause:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
