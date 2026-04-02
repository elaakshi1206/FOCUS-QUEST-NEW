import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/store";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { BotpressChat } from "@/components/BotpressChat";
import NotFound from "@/pages/not-found";


import { IntroPage } from "@/pages/IntroPage";
import { Landing } from "@/pages/Landing";
import { LoginPage } from "@/pages/LoginPage";
import { Setup } from "@/pages/Setup";
import { TimetableBuilder } from "@/pages/TimetableBuilder";
import { Map } from "@/pages/Map";
import { QuestList } from "@/pages/QuestList";
import { QuestView } from "@/pages/QuestView";
import { Results } from "@/pages/Results";
import { Rewards } from "@/pages/Rewards";
import { Customize } from "@/pages/Customize";
import { Analytics } from "@/pages/Analytics";
import { TeamDashboard } from "@/pages/TeamDashboard";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { MatchmakingScreen } from "@/pages/MatchmakingScreen";
import { ChallengesScreen } from "@/pages/ChallengesScreen";
import { ActiveChallengeRoom } from "@/pages/ActiveChallengeRoom";
import { DailyChallengePage } from "@/pages/DailyChallengePage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={IntroPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/landing" component={Landing} />
      <Route path="/setup" component={Setup} />
      <Route path="/timetable" component={TimetableBuilder} />
      <Route path="/map" component={Map} />
      <Route path="/quests/:subjectId" component={QuestList} />
      <Route path="/quest/:subjectId/:questId" component={QuestView} />
      <Route path="/results" component={Results} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/customize" component={Customize} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/team" component={TeamDashboard} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/matchmaking" component={MatchmakingScreen} />
      <Route path="/challenges" component={ChallengesScreen} />
      <Route path="/challenge/:challengeId" component={ActiveChallengeRoom} />
      <Route path="/daily-challenge" component={DailyChallengePage} />
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
            <BotpressChat />
          </TooltipProvider>


        </ThemeWrapper>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
