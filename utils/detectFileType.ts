import { MediaFile } from "@/types/types";

export const isImage = (file: MediaFile) => file.type.startsWith("image/");
export const isVideo = (file: MediaFile) => file.type.startsWith("video/");

// Usage:

// if (isImage(exampleImage)) {
//   console.log("Es una imagen:", exampleImage.name);
// }

// if (isVideo(exampleVideo)) {
//   console.log("Es un video:", exampleVideo.name);
// }