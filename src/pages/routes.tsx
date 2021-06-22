import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { NewRoom } from "./NewRoom";
import {NotFound} from "./NotFound"

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/rooms/new" exact component={NewRoom} />
        <Route path="/" exact component={Home} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
