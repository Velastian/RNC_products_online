import { Button } from "../ui/button";

import { 
  DropdownMenu, DropdownMenuTrigger, 
  DropdownMenuContent, DropdownMenuItem 
} from "../ui/dropdown-menu";

import { Sun, Moon, Brain } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between py-2.5 px-4 border-b">
      <HeaderTitle />
      <HeaderDarkMode />
    </header>
  )
};

function HeaderTitle() {
  return (
    <div className="flex gap-4">
      <Brain className="h-6 w-6 text-gray-800" />

      <h1 className="font-bold text-xl">
        IA - RNConvoulcional
      </h1>
    </div>
  )
};

function HeaderDarkMode() {
  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default Header;