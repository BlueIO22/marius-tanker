import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";

export default function SearchInput() {
  return (
    <Link
      role="presentation"
      className="hover:bg-white cursor-pointer rounded-full items-center flex w-[64px] h-[64px] justify-center hover:text-black underline text-3xl font-bold"
      to={"/search"}
    >
      <FontAwesomeIcon icon={faSearch} />
    </Link>
  );
}
