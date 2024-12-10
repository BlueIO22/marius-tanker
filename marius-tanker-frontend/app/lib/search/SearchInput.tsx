import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import { useState } from "react";

export default function SearchInput() {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="presentation"
      className="hover:bg-primary cursor-pointer rounded-full items-center flex w-[64px] h-[64px] justify-center hover:text-secondary underline text-3xl font-bold"
      to={"/search"}
    >
      <FontAwesomeIcon icon={faSearch} bounce={isHovering} />
    </Link>
  );
}
