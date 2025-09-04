import { Route, Switch } from "wouter";
import Landing from "./pages/Landing";
import Constellation from "./pages/Constellation";

export default function App() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/r/:" component={Constellation} />
        <Route>404 Not Found</Route>
      </Switch>
    </div>
  );
}