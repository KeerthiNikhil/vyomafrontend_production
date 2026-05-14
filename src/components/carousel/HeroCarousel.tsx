import * as React from "react";

import axios from "axios";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

const HeroCarousel = () => {

  const [banners, setBanners] = React.useState<any[]>([]);

  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  React.useEffect(() => {

    fetchBanners();

  }, []);

  const fetchBanners = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/v1/banners"
      );

      setBanners(res.data.data);

    } catch (error) {

      console.log(error);

    }

  };

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

              <CarouselItem key={banner._id}>

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