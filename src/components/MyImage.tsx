import Image, { ImageProps } from "next/image";
import React, { FC } from "react";

export interface Props extends ImageProps {
  enableDefaultPlaceholder?: boolean;
  defaultPlaceholderDataUrl?: string;
}

const MyImage: FC<Props> = ({
  enableDefaultPlaceholder = false,
  defaultPlaceholderDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+vx1PQAIqAM4jZDFJQAAAABJRU5ErkJggg==",
  ...props
}) => {
  return (
    <Image
      {...props}
      className={`${props.className} ${
        props.src ? "" : "dark:filter dark:brightness-75"
      }`}
      src={props.src || "/images/placeholder.png"}
    />
  );
};

export default MyImage;
