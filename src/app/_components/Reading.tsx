"use client";

import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/vendor/motion-primitives/image-comparison";

/**
 * One print, two readings: as it was printed, and as a machine reads it (a
 * dot screen with its rows slipped). The line between them follows the
 * pointer. Both sides show the same picture, so nothing is lost without it.
 */
export function Reading({ plate, read }: { plate: string; read: string }) {
  return (
    <ImageComparison
      className="size-full cursor-ew-resize"
      enableHover
      springOptions={{ bounce: 0, duration: 0.35 }}
    >
      <ImageComparisonImage src={plate} alt="" position="right" />
      <ImageComparisonImage src={read} alt="" position="left" />
      <ImageComparisonSlider className="w-0 border-leaf border-l-2 border-dashed">
        <span className="absolute top-0 -left-[5px] block h-0.5 w-2.5 bg-leaf" />
        <span className="absolute bottom-0 -left-[5px] block h-0.5 w-2.5 bg-leaf" />
      </ImageComparisonSlider>
    </ImageComparison>
  );
}
