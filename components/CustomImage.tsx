import Image from 'next/image';

const CustomImage = ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className: string; }) => {
  const imageLoader = ({ src }: { src: string }) => {
    return `${src}`;
  };

  return (
    <Image
      loader={imageLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CustomImage;