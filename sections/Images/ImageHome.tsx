import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface DecoCXProps {
  desktopImage: ImageWidget;
  mobileImage: ImageWidget;
  Link: string;
}

export default function ImageHome({ desktopImage, mobileImage, Link }: DecoCXProps) {
  return (
    <section className="w-full flex justify-center">
      <div className="hidden md:flex justify-center pb-10 lg:pt-4">
        <a href={Link}>
        <Image
          src={desktopImage}
          width={1130}
          height={350}
          className="md:hidden lg:flex max-w-ft-1130 h-[350px] object-cover"
        />
        </a>
      </div>

      <div className="flex lg:hidden justify-center w-full">
        <a class="w-full" href={Link}>
        <Image
          src={mobileImage}
          width={351}
          height={350}
          className="lg:max-w-ft-351 w-full md:px-12 lg:px-3 px-3"
        />
        </a>
      </div>
    </section>
  );
}
