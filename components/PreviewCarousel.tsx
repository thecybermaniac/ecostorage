"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const PreviewCarousel = ({
  children: slides,
  setPreviewVisible,
  startIndex = 0,
}: {
  children: React.ReactNode[];
  setPreviewVisible: Dispatch<
    SetStateAction<{ visible: boolean; index: number;}>
  >;
  startIndex?: number;
}) => {
  const [curr, setCurr] = useState(startIndex);

  useEffect(() => {
    setCurr(startIndex); // Update the current slide when startIndex changes
  }, [startIndex]);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
      {/* Carousel Container */}
      <div className="relative w-screen h-screen overflow-hidden">
        <div
          className="flex h-full transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-screen h-full flex items-center justify-center"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
        <Button onClick={prev} className="chevron-btn">
          <Image src="/assets/icons/chevron-left.png" alt="previous" width={34} height={34} />
        </Button>
        <Button onClick={next} className="chevron-btn">
        <Image src="/assets/icons/chevron-right.png" alt="next" width={34} height={34} />
        </Button>
      </div>

      <div className="absolute top-1">
        <div className="px-4">
          <div
            onClick={() =>
              setPreviewVisible({ visible: false, index: 0})
            }
            className="cursor-pointer"
          >
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={34}
              height={34}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCarousel;
