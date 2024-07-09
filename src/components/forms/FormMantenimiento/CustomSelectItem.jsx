import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const CustomSelectItem = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [inputValue, setInputValue] = React.useState(value || ""); // Initialize with existing value or empty string

  const handleChange = (event) => {
    setInputValue(event.target.value);
    onValueChange?.(event.target.value); // Call the original onValueChange if provided
  };

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          {inputValue ? <Check className="h-4 w-4" /> : null} {/* Show checkmark only if value exists */}
        </SelectPrimitive.ItemIndicator>
      </span>

      <input
        type="text"
        className="w-full pl-10"
        value={inputValue}
        onChange={handleChange}
      />
    </SelectPrimitive.Item>
  );
});

export default CustomSelectItem;
