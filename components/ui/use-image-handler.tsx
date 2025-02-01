const IMAGE_EXTENSIONS = ['jpg', 'png', 'webp', 'avif','jfif']; // Prioritized order
const BASE_URL = 'https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images';
const imageCache = new Map<string, string>();

export const useImageHandler = () => {
  const checkImageWithTimeout = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD'
      });
      return response.ok ? url : null;
    } catch {
      return null;
    }
  };

  const getImageUrl = async (path: string, category: string) => {
    const formattedPath = path;
    const cacheKey = `${category}/${formattedPath}`;
    
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }

    for (const ext of IMAGE_EXTENSIONS) {
      const url = `${BASE_URL}/${category}/${formattedPath}.${ext}`;
      const validUrl = await checkImageWithTimeout(url);
      
      if (validUrl) {
        imageCache.set(cacheKey, validUrl);
        return validUrl;
      }
    }

    return null;
  };

  return {
    getImageUrl
  };
};