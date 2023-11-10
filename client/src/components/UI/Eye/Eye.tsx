import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<SVGElement> {
  open: boolean;
}

const Eye: React.FC<Props> = ({ open = true , ...props}) => {
  return open ? (
    <svg
      viewBox="0 0 82 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect
        x="1"
        y="1"
        width="80"
        height="80"
        fill="url(#pattern0)"
      />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_529_10" transform="scale(0.01)" />
        </pattern>
        <image
          id="image0_529_10"
          width="100"
          height="100"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  ) : (
    <svg
      viewBox="0 0 82 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect
        x="1"
        y="1"
        width="80"
        height="80"
        fill="url(#pattern0)"
      />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_529_14" transform="scale(0.01)" />
        </pattern>
        <image
          id="image0_529_14"
          width="100"
          height="100"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default Eye;
