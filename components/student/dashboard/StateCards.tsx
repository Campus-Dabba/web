import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useImageHandler } from '@/components/ui/use-image-handler';

// Add interface for state images
interface StateImageMap {
  [key: string]: string;
}



export function StateCards({
  states,
  selectedState,
  onStateSelect,
}: {
  states: readonly string[];
  selectedState: string;
  onStateSelect: (state: string) => void;
}) {
  const router = useRouter();
  const { getImageUrl } = useImageHandler();
  const [stateImages, setStateImages] = useState<StateImageMap>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameId = useRef<number>();
  const defaultImageUrl = 'https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//default.avif'
  const startAnimation = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const scroll = () => {
      if (isPaused || !scrollRef.current || !containerRef.current) {
        return;
      }

      scrollPosition.current += 0.5;

      const firstCard = scrollRef.current.children[0] as HTMLElement;
      const cardWidth = firstCard.offsetWidth + 16; // width + gap

      if (scrollPosition.current >= cardWidth) {
        // Move first element to end
        scrollRef.current.appendChild(firstCard);
        scrollPosition.current = 0;
        scrollRef.current.style.transform = `translateX(0)`;
      } else {
        scrollRef.current.style.transform = `translateX(-${scrollPosition.current}px)`;
      }
      animationFrameId.current = requestAnimationFrame(scroll);
    };

    animationFrameId.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    startAnimation();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startAnimation();
  };

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: StateImageMap = {};
      
      for (const state of states) {
        const imageUrl = await getImageUrl(state, 'states');
        if (imageUrl) {
          loadedImages[state] = imageUrl;
        }
      }
      
      setStateImages(loadedImages);
    };
    
    loadImages();
  }, [states]);

  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-300 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent border-b-2 border-orange-300 dark:border-blue-300 pb-2">
        Suggestions for you
      </h2>
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 px-6"
          style={{ width: "fit-content" }}
        >
          {[...states, ...states].map((state, index) => (
            <div
              key={`${state}-${index}`}
              onClick={() => onStateSelect(state)}
              className={`
                flex-shrink-0 relative w-48 h-40 rounded-lg overflow-hidden cursor-pointer
                transition-transform hover:scale-105
                ${selectedState === state ? "ring-2 ring-primary" : ""}
              `}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${stateImages[state] ?? defaultImageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative h-full flex flex-col items-center justify-between p-4 z-10">
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-lg font-medium text-white text-center">
                    {state}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Store state info in localStorage
                    localStorage.setItem("selectedState", state);
                    localStorage.setItem(
                      "stateUrl",
                      state.toLowerCase().replace(" ", "-")
                    );
                    // Navigate to state page
                    router.push(
                      `/states`
                    );
                  }}
                  className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-medium
            hover:bg-white transition-colors duration-200 mt-2"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
