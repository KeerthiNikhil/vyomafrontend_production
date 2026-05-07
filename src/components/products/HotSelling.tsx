import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API = "http://localhost:8000";

const HotSelling = ({ products = [] }: any) => {
  if (!products.length) return null;

  return (
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-0">

        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          Hot Selling
        </h2>

        <div className="relative">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-5">
              {products.map((product: any) => (
                <CarouselItem
                  key={product._id}
                  className="
                    pl-5
                    basis-1/2
                    sm:basis-1/3
                    md:basis-1/4
                    lg:basis-1/5
                    xl:basis-1/6
                  "
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={Math.max(product.finalPrice || 0, 0)}
                    image={
                      product.images?.[0]
                        ? `${API}${product.images[0]}`
                        : "/placeholder.png"
                    }
                    weight={product.unit || "200 g"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-5" />
            <CarouselNext className="-right-5" />
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default HotSelling;