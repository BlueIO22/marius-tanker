import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PortableText } from "@portabletext/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

export default function TldrComponent({
  tldr,
}: {
  tldr: { title: string; content: [] } | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tldr) {
    return null;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="fixed hover:bg-primary text-secondary bg-primary border-2 rounded-lg shadow-xl cursor-pointer lg:right-5 2xl:right-20 right-2 bottom-2 lg:-bottom-auto lg:left-auto lg:bottom-5 lg:-translate-y-1/2 p-2 text-2xl"
        >
          TLDR; <span className="jump-up-infinite">🥱</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-5 lg:p-20 flex justify-center rounded-none">
        <DrawerClose>
          <FontAwesomeIcon
            className="cursor-pointer hover:bg-secondary hover:text-primary rounded-full p-2 absolute lg:top-10 lg:right-10 right-2 top-2"
            icon={faClose}
          />
        </DrawerClose>
        <DrawerHeader className="ml-0 pl-0 text-left">
          <DrawerTitle className="mb-5">{tldr.title}</DrawerTitle>
          <PortableText value={tldr.content} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
