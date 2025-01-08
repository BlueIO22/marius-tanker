import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";

export default function PostContentImage({ value }: { value: any }) {
  const hasImageCrediting =
    value.imageCreditLine ||
    (value.image.creditLineFromUnsplash?.url &&
      value.image.creditLineFromUnsplash?.line);

  const isUnsplash = !value.imageCreditLine
    ? value.image.creditLineFromUnsplash?.line &&
      value.image.creditLineFromUnsplash?.url
    : false;

  const imageUrl = value.image.url + "";

  return (
    <div className="my-5">
      <img
        className="border-2 mb-2 max-h-[500px] w-full object-cover object-center"
        src={imageUrl}
        alt={value.imageTitle}
      />
      <div className="flex justify-between flex-col lg:flex-row gap-2 lg:gap-0">
        <p className="italic order-2 lg:order-1 lg:max-w-[60%] break-words">
          {value.imageTitle}
        </p>
        {hasImageCrediting && (
          <div className="flex flex-row order-1 lg:order-2 items-center">
            <FontAwesomeIcon icon={faCamera} className="mr-2 " />
            {isUnsplash ? (
              <Link
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                to={value.image.creditLineFromUnsplash?.url ?? ""}
              >
                {value.image.creditLineFromUnsplash?.line}
              </Link>
            ) : (
              <p>{value.imageCreditLine}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
