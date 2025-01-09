import { MediaFile } from "@/types/types";
import { isImage } from "@/utils/detectFileType";

const MediaGallery = ({ media }: { media: MediaFile[] }) => {
  const displayMedia = media.slice(0, 4); // Solo mostramos hasta las primeras 4 imágenes
  const extraCount = media.length - 4; // Cantidad de imágenes extra

  if (media.length === 0) return null;

  return (
    <div
      className={`grid gap-2 ${media.length === 1
        ? 'grid-cols-1'
        : media.length === 2
          ? 'grid-cols-2'
          : media.length === 3
            ? 'grid-cols-3 grid-rows-2'
            : 'grid-cols-2'
        }`}
    >
      {displayMedia.map((file: MediaFile, i: number) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-md ${media.length === 3
            ? i === 0
              ? 'col-span-2 row-span-2' // Primer archivo ocupa la mitad izquierda
              : 'col-span-1' // Los otros dos ocupan la mitad derecha
            : ''
            }`}
        >
          {isImage(file)
            ? <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-md border borderColor" />
            : <video src={file.url} controls className="w-full h-full max-h-[550px] object-contain rounded-md border borderColor bg-black"></video>
          }

          {/* Mostrar el overlay "+n" en la última imagen si hay más de 4 */}
          {i === 3 && extraCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
              +{extraCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGallery