import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalStorage } from "usehooks-ts";

export default function ToggleTheme() {
  const [value, setValue, removeValue] = useLocalStorage(
    "marius-tanker-theme",
    false
  );

  return (
    <div
      className="flex items-center"
      role="presentation"
      onClick={() => {
        setValue(!value);
      }}
    >
      <FontAwesomeIcon
        className={`
        text-secondary cursor-pointer rounded-full items-center w-[32px] h-[32px] justify-end underline text-3xl font-bold`}
        icon={faLightbulb}
      />
    </div>
  );
}
