import { ChevronRight } from "lucide-react";

interface AdCardProps {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  description: string;
  image?: string;
  backgroundColor?: string;
  badge?: string;
  ctaText?: string;
}

export default function AdCard({
  title,
  subtitle,
  price,
  description,
  image,
  backgroundColor = "bg-gradient-to-br from-blue-900 to-blue-700",
  badge = "Ad",
  ctaText = "Join Now",
}: AdCardProps) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${backgroundColor} p-6 text-white`}
    >
      {/* Ad Badge */}
      <div className="mb-4">
        <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-3 py-1 rounded">
          {badge}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Title and Subtitle */}
          <div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            {subtitle && (
              <p className="text-sm text-white text-opacity-80 mb-3">
                {subtitle}
              </p>
            )}

            {price && (
              <p className="text-3xl font-bold text-yellow-300 mb-3">{price}</p>
            )}

            {description && (
              <p className="text-sm text-white text-opacity-80">
                {description}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-4 flex items-center gap-2 bg-black bg-opacity-30 rounded px-4 py-3 w-fit hover:bg-opacity-50 transition-colors cursor-pointer">
            <span className="font-medium text-sm">{ctaText}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Image */}
        {image && (
          <div className="hidden sm:block w-40 h-40 flex-shrink-0">
            <img
              src={image}
              alt="ad"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
