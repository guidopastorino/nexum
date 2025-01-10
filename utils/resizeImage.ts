export const resizeImage = (
  file: File,
  width: number,
  height: number,
  quality: number = 0.8, // Calidad entre 0.1 y 1
  format: string = 'image/webp' // .WebP para mejor compresión
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error('Error loading image file'));
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas context is not available'));
        }

        const imgAspectRatio = img.width / img.height;
        const canvasAspectRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspectRatio > canvasAspectRatio) {
          drawHeight = height;
          drawWidth = img.width * (height / img.height);
          offsetX = (width - drawWidth) / 2;
        } else {
          drawWidth = width;
          drawHeight = img.height * (width / img.width);
          offsetY = (height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
                type: format,
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Error resizing image'));
            }
          },
          format,
          quality
        );
      };

      img.src = event.target.result as string;
    };

    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
};