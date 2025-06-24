import { Toaster } from "sonner";
import { Footer, Header, Main } from "@/components";
import { useTheme } from "@/hooks";

function Inicio() {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Main />
      <Footer />

      <Toaster 
        expand={true} 
        position="top-right"
        theme={theme === "dark" ? "light" : "dark"}
      />
    </div>
  )
}

export default Inicio;