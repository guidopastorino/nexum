"use server";

import { utapi } from "@/server/uploadthing";

// Server Action: sube los archivos al servidor
export async function uploadFiles(formData: FormData) {
  // Obtener los archivos del formulario (asegúrate de que son archivos y no strings)
  const files = formData.getAll("files").filter(file => file instanceof File) as File[];

  // Usar la API de UploadThing para subir los archivos
  const response = await utapi.uploadFiles(files);

  // Devuelve la respuesta con los detalles de los archivos subidos
  return response;
}