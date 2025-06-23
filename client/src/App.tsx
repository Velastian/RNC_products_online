import { Inicio } from "@/layout";
import { ThemeProvider } from "@/context";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Inicio />
    </ThemeProvider>
  )
};

export default App;