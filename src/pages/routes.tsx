import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AdminRoom } from "./AdminRoom";
import { Home } from "./Home";
import { NewRoom } from "./NewRoom";
import { NotFound } from "./NotFound";
import { Room } from "./Room";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin/rooms/:id" exact component={AdminRoom} />
        <Route path="/rooms/new" exact component={NewRoom} />
        <Route path="/rooms/:id" exact component={Room} />
        <Route path="/" exact component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
