import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function Explanation({
  explanation,
  children,
}: {
  explanation: any;
  children: any;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="border-b-2 border-dashed cursor-pointer">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <span className="font-bold mb-2 block">{explanation.title}</span>
        <span className="max-h-[200px] overflow-auto">
          {explanation.content}
        </span>
      </PopoverContent>
    </Popover>
  );
}
