import React from "react";
import { Link, HashRouter } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Navbar } from "react-bootstrap";

export enum ShowMenuItem {
  LoggedIn = "LoggedIn",
  NotLoggedIn = "NotLoggedIn",
  Always = "Always"
}

export class MenuItem {
  href: string;
  title: string;
  float: string;
  show: ShowMenuItem;

  constructor(title: string, href: string, show: ShowMenuItem, float = "left") {
    this.href = href;
    this.title = title;
    this.float = float;
    this.show = show;
  }
}

interface MainMenuProperties {
  userLoggedIn: boolean;
  items: MenuItem[];
}

interface MainMenuState {
  isUserLoggedIn: boolean;
  items: MenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
  state: MainMenuState;

  constructor(props: MainMenuProperties) {
    super(props);

    this.state = {
      isUserLoggedIn: props.userLoggedIn,
      items: props.items,
    };
  }

  private setLogginState(isLoggedIn: boolean) {
    const newState = Object.assign(this.state, {
      isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  componentDidUpdate(prevProps: MainMenuProperties) {
    console.log('menu updated ' + prevProps.userLoggedIn + this.props.userLoggedIn);
    if (prevProps.userLoggedIn !== this.props.userLoggedIn) {
      this.setLogginState(this.props.userLoggedIn);
    }
  }


  render() {
    return (
      <Navbar bg="secondary" expand="sm">
        <Navbar.Toggle aria-controls="navbar-rent-a-car" />
        <Navbar.Collapse id="navbar-rent-a-car">
          <Nav className="mr-auto">
            {this.state.items.filter(item =>
              (item.show === ShowMenuItem.Always ||
                (this.state.isUserLoggedIn ?
                  item.show === ShowMenuItem.LoggedIn
                  : item.show === ShowMenuItem.NotLoggedIn))
              && item.float === "left")
              .map(itemLeft => {
                return (
                  <HashRouter>
                    <Link
                      className={"nav-link float-left"}
                      to={itemLeft.href}
                      key={itemLeft.href}
                    >
                      {itemLeft.title}
                    </Link>
                  </HashRouter>
                );
              })}
          </Nav>
          <Nav className="mr-sm-2">
            {this.state.items.filter(item =>
              (item.show === ShowMenuItem.Always ||
                (this.state.isUserLoggedIn ?
                  item.show === ShowMenuItem.LoggedIn
                  : item.show === ShowMenuItem.NotLoggedIn))
              && item.float === "right")
              .map(itemRight => {
                return (
                  <HashRouter>
                    <Link
                      className={"nav-link float-right"}
                      to={itemRight.href}
                      key={itemRight.href}
                    >
                      {itemRight.title}
                    </Link>
                  </HashRouter>
                );
              })}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
