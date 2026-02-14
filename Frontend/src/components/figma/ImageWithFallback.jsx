import { useState } from "react";

const FALLBACK_DATA_URI =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export function ImageWithFallback({
  src,
  alt,
  className = "",
  style,
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`inline-block bg-gray-100 text-center ${className}`} style={style}>
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={FALLBACK_DATA_URI}
            alt="Error loading image"
            data-original-url={src}
            {...props}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
