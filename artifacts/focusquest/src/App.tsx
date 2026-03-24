import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/store";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import NotFound from "@/pages/not-found";

import { Landing } from "@/pages/Landing";
import { Setup } from "@/pages/Setup";
import { Map } from "@/pages/Map";
import { QuestList } from "@/pages/QuestList";
import { QuestView } from "@/pages/QuestView";
import { Results } from "@/pages/Results";
import { Rewards } from "@/pages/Rewards";
import { Customize } from "@/pages/Customize";
import { Analytics } from "@/pages/Analytics";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/setup" component={Setup} />
      <Route path="/map" component={Map} />
      <Route path="/quests/:subjectId" component={QuestList} />
      <Route path="/quest/:subjectId/:questId" component={QuestView} />
      <Route path="/results" component={Results} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/customize" component={Customize} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <ThemeWrapper>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeWrapper>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
