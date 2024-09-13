import { Button } from "@chakra-ui/react";

function OptionsList<T extends string | object>({
  options,
  onSelect,
  displayKey,
  isLoading,
}: {
  options?: T[] | undefined;
  onSelect: (option: T) => void;
  displayKey?: keyof T | ((option: T) => string); // Optional, only needed for objects
  isLoading?: boolean;
}) {
  if (!options) {
    return null;
  }
  return (
    <div className="invisible absolute top-full z-10 flex max-h-[10rem] w-full translate-y-2 scroll-m-10 flex-col gap-2 overflow-y-auto overflow-x-hidden bg-white opacity-0 transition-all duration-200 autofill:hidden peer-focus:visible peer-focus:opacity-100">
      {isLoading && (
        <Button variant="ghost" className="py-2" isLoading={true}></Button>
      )}

      {!isLoading &&
        options.map((option, i) => {
          // Determine the display text for each option
          const displayText =
            typeof option === "string"
              ? option // If the option is a string, display it directly
              : typeof displayKey === "function"
                ? displayKey(option)
                : displayKey
                  ? String(option[displayKey])
                  : "";

          return (
            <Button
              variant="ghost"
              key={i}
              onClick={() => onSelect(option)}
              className="py-2"
              bg="green.200"
              _hover={{ bg: "green.300" }}
            >
              <span className="w-full text-left">{displayText}</span>
            </Button>
          );
        })}
    </div>
  );
}

export default OptionsList;
