import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageProvider } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SignToText from "@/pages/sign-to-text";
import TextToSign from "@/pages/text-to-sign";
import VoiceToSign from "@/pages/voice-to-sign";
import Phrases from "@/pages/phrases";
import Conversation from "@/pages/conversation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-to-text" component={SignToText} />
      <Route path="/text-to-sign" component={TextToSign} />
      <Route path="/voice-to-sign" component={VoiceToSign} />
      <Route path="/phrases" component={Phrases} />
      <Route path="/conversation" component={Conversation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div className="flex items-center gap-1">
                      <LanguageToggle />
                      <ThemeToggle />
                    </div>
                  </header>
                  <main className="flex-1 overflow-hidden flex flex-col">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
