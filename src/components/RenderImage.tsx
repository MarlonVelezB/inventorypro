import React, { useCallback } from "react";
import type { Product } from "../types/business.types";
import { Image } from "antd";

const RenderImage: React.FC<{ images?: Product["images"] }> = ({ images }) => {
  const renderContent = useCallback(() => {
    if (!images?.length) {
      return (
        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      );
    }

    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    return (
      <Image.PreviewGroup
        items={images.map((img) => ({
          src: img.url,
          alt: img.alt || "Product Image",
        }))}
      >
        <Image
          width={80}
          src={primaryImage.url}
          alt={primaryImage.alt || "Product"}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      </Image.PreviewGroup>
    );
  }, [images]);

  return renderContent();
};

export default RenderImage;
