import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

import { banners } from "@/data/banners";



const HeroCarousel = () => {
  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  )

  return (
    <section className="max-w-7xl mx-auto mt-6 mb-2">
      
      <div className="rounded-2xl overflow-hidden shadow-lg">

        <Carousel
          opts={{ loop: true }}
          plugins={[autoplay.current]}
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.reset()}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>

                <div className="w-full h-[340px] md:h-[380px]">

                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                </div>

              </CarouselItem>
            ))}

          </CarouselContent>
        </Carousel>

      </div>

    </section>
  );
};

export default HeroCarousel;