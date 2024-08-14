import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Theme, useTheme } from "remix-themes";

export function ThemeToggle() {
    // const { setTheme, theme } = useTheme();
    const [theme, setTheme] = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                if(theme == null) return
                if(theme == Theme.DARK){
                    setTheme(Theme.LIGHT)
                }else{
                    setTheme(Theme.DARK)
                }
            }}
            className="h-9 w-9 rounded-md border"
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />

            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}