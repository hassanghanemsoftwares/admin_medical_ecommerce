"use client"; // Corrected directive

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Assuming DropdownMenu components exist
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

const locales = ["en", "ar"];

export default function LocaleSwitcher() {
    const { i18n } = useTranslation();

    const queryClient = useQueryClient();
    // Handle language change
    function onSelectChange(lang: string) {
        i18n.changeLanguage(lang); // It updates the cookie automatically
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        queryClient.invalidateQueries();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Change language"
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Globe className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
                {locales.map((localeOption) => ( // Renamed loop variable to localeOption
                    <DropdownMenuItem
                        key={localeOption}
                        onClick={() => onSelectChange(localeOption)}
                        className={`text-sm ${localeOption === i18n.language
                            ? "font-bold bg-gray-100 dark:bg-gray-700"
                            : "font-normal"
                            }`}
                    >
                        {localeOption.toUpperCase()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}