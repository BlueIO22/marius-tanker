import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function ToggleTheme() {
  const [hover, setHover] = useState(false);
  const [value, setValue, removeValue] = useLocalStorage(
    "marius-tanker-theme",
    false
  );

  return (
    <div
      className="flex items-center"
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="presentation"
      onClick={() => {
        setValue(!value);
      }}
    >
      <FontAwesomeIcon
        className={`text-secondary cursor-pointer stroke-primary stroke-6 rounded-full items-center w-[32px] h-[32px] justify-end underline text-3xl font-bold`}
        icon={faLightbulb}
        shake={hover}
      />
    </div>
  );
}
