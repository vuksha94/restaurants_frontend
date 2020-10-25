import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.js";
import "popper.js/dist/popper.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import { MainMenu, MenuItem, ShowMenuItem } from "./components/MainMenu/MainMenu";
import { HashRouter, Switch, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage/HomePage";

import LogOut from "./components/LogOutComponent/LogOutComponent";
import { LoginComponent } from "./components/Manager/LogInComponent";
import { RegisterCompopnent } from "./components/Manager/RegisterComponent";
import { AddRestaurantComponent } from "./components/Restaurant/AddRestaurantComponent";
import { AddWorkingTimeComponent } from "./components/Restaurant/AddWorkingTimeComponent";
import { AddTablesComponent } from "./components/Restaurant/AddTablesComponent";
import { RestaurantInfoComponent } from "./components/Restaurant/RestaurantInfoComponent";
import { SearchRestaurantComponent } from "./components/Restaurant/SearchRestaurantComponent";
import { AddReservationComponent } from "./components/Reservation/AddReservationComponent";
import { CheckAvailableTablesComponent } from "./components/Restaurant/CheckAvailableTablesComponent";
import { ReservationComponent } from "./components/Reservation/ReservationComponent";
import { isLoggedIn } from "./api/api";

const menuLinks = [
  new MenuItem("Home", "/", ShowMenuItem.Always),
  //new MenuItem("Prijava", "/manager/login", ShowMenuItem.NotLoggedIn), // ShowMenuItem.NotLoggedIn
  //new MenuItem("Registracija", "/manager/register", ShowMenuItem.NotLoggedIn), // ShowMenuItem.NotLoggedIn
  //new MenuItem("Dodavanje restorana", "/restaurant/add", ShowMenuItem.LoggedIn), // ShowMenuItem.NotLoggedIn
  //new MenuItem("Dodaj radno vreme", "/restaurant/add-working-time", ShowMenuItem.LoggedIn), // ShowMenuItem.NotLoggedIn
  //new MenuItem("Dodaj stolove", "/restaurant/add-tables", ShowMenuItem.LoggedIn), // ShowMenuItem.NotLoggedIn
  new MenuItem("Restorani", "/restaurants", ShowMenuItem.NotLoggedIn), // ShowMenuItem.NotLoggedIn
  new MenuItem("Rezervacije", "/restaurant/reservations", ShowMenuItem.LoggedIn), // ShowMenuItem.NotLoggedIn
  new MenuItem("Odjava", "/logout", ShowMenuItem.LoggedIn, "right"), // ShowMenuItem.LoggedIn
];

interface AppState {
  userLoggedIn: boolean;
}

class App extends React.Component {

  state: AppState;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      userLoggedIn: isLoggedIn()
    };
    this.isLoogedIn = this.isLoogedIn.bind(this);
  }
  isLoogedIn(loggedIn: boolean) {
    console.log("is Logged In: " + loggedIn);
    this.setState({
      userLoggedIn: loggedIn
    });
  }
  render() {
    return (
      <React.StrictMode>
        <MainMenu userLoggedIn={this.state.userLoggedIn} items={menuLinks}></MainMenu>
        <HashRouter>
          <Switch>
            <Route
              exact path="/"
              render={() => (
                <HomePage userLoggedIn={this.state.userLoggedIn} />
              )}
            />

            <Route
              path="/manager/login"
              render={() => (
                <LoginComponent isLoggedInFunc={this.isLoogedIn} />
              )}
            />
            <Route path="/manager/login" component={LoginComponent}></Route>
            <Route path="/manager/register" component={RegisterCompopnent}></Route>
            <Route path="/restaurant/add" component={AddRestaurantComponent}></Route>
            <Route path="/restaurant/add-working-time" component={AddWorkingTimeComponent}></Route>
            <Route path="/restaurant/add-tables" component={AddTablesComponent}></Route>
            <Route path="/restaurant/reservation/check-available-tables/:id" component={CheckAvailableTablesComponent}></Route>
            <Route path="/restaurant/reservation" component={AddReservationComponent}></Route>
            <Route path="/restaurant/reservations" component={ReservationComponent}></Route>
            <Route path="/restaurant/:id" component={RestaurantInfoComponent}></Route>
            <Route path="/restaurants/" component={SearchRestaurantComponent}></Route>
            <Route path="/logout" component={LogOut}></Route>
          </Switch>
        </HashRouter>
      </React.StrictMode >
    )
  }
}
const app = <App />;
ReactDOM.render(app, document.getElementById("root"));

serviceWorker.unregister();
