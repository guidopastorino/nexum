import useModal from "@/hooks/useModal";
import { MediaFile } from "@/types/types";
import { isImage } from "@/utils/detectFileType";
import { useRef, useEffect, useState } from "react";

const MediaGallery = ({ media }: { media: MediaFile[] }) => {
  const { isModalOpen } = useModal('globalModal');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [isIntersecting, setIsIntersecting] = useState<boolean[]>(new Array(media.length).fill(false));

  const displayMedia = media.slice(0, 4);
  const extraCount = media.length - 4;

  useEffect(() => {
    const options = {
      root: null, // El root es el viewport (pantalla)
      rootMargin: "0px",
      threshold: 0.2, // Se considera visible si el 20% del video es visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Si el video es visible en el viewport, reproducirlo
          if (videoRefs.current[index] && !isModalOpen) {
            videoRefs.current[index]?.play();
          }
          setIsIntersecting((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        } else {
          // Si el video no está visible, pausarlo
          if (videoRefs.current[index]) {
            videoRefs.current[index]?.pause();
          }
          setIsIntersecting((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }
      });
    }, options);

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [media.length]);

  // Pausar todos los videos cuando se abra el modal
  useEffect(() => {
    if (isModalOpen) {
      videoRefs.current.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    }
  }, [isModalOpen]);

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
            ? <img loading="lazy" src={file.url} alt={file.name} className="w-full h-full object-cover rounded-md border borderColor" />
            : (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={file.url}
                controls
                className="w-full h-full max-h-[550px] object-contain rounded-md border borderColor bg-black"
                muted
              />
            )
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

export default MediaGallery;