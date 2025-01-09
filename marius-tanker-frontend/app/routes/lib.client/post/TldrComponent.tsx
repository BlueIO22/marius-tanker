import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function TldrComponent({
  tldr,
}: {
  tldr: { title: string; content: [] } | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tldr) {
    return null;
  }

  if (isOpen) {
    return (
      <div className="fly-up fixed shadow-xl border-2 z-[1000] text-secondary bottom-0 w-full lg:py-20 py-10 bg-primary ">
        <div>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            className="absolute top-2 bg-transparent shadow-none  text-secondary right-2"
          >
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>
        <div className="lg:w-[50%] p-5 lg:p-0 m-auto w-full flex flex-col gap-5">
          <h1 className="text-2xl font-bold">{tldr.title}</h1>
          <PortableText value={tldr.content} />
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        setIsOpen(true);
      }}
      className="fixed text-secondary bg-primary border-2 rounded-lg shadow-xl cursor-pointer lg:left-20 right-2 bottom-2 lg:-bottom-auto lg:right-auto  lg:top-1/2 lg:-translate-y-1/2 p-2 text-2xl"
    >
      TLDR; 🥱
    </Button>
  );
}
