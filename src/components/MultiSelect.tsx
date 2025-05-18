import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

type Option = {
    label: string;
    value: string | number;
};

interface MultiSelectProps {
    options: Option[];
    value: (string | number)[];
    onChange: (values: (string | number)[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (val: string | number) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    <div className="truncate text-left flex-1">
                        {value.length === 0
                            ? placeholder
                            : options
                                .filter((opt) => value.includes(opt.value))
                                .map((opt) => opt.label)
                                .join(", ")}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <ScrollArea className="h-64">
                        <CommandList>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="cursor-pointer"
                                    >
                                        <Checkbox
                                            checked={value.includes(option.value)}
                                            className="mr-2"
                                            onCheckedChange={() => handleSelect(option.value)}
                                        />
                                        {option.label}
                                        {value.includes(option.value) && (
                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
