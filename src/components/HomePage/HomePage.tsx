import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HashRouter, Link } from "react-router-dom";
import { getUser } from "../../api/api";
import { UserType } from "../../types/UserType";


interface HomePageProperties {
  userLoggedIn: boolean;
}

interface HomePageState {
  isUserLoggedIn: boolean;
  user: UserType | null;
}

export class HomePage extends React.Component<HomePageProperties, HomePageState> {

  constructor(props: HomePageProperties) {
    super(props);

    this.state = {
      isUserLoggedIn: props.userLoggedIn,
      user: getUser()
    };
  }

  componentDidUpdate(prevProps: HomePageProperties) {
    if (prevProps.userLoggedIn !== this.props.userLoggedIn) {
      this.setLogginState(this.props.userLoggedIn);
      this.setUserState();
    }
  }

  private setLogginState(isLoggedIn: boolean) {
    const newState = Object.assign(this.state, {
      isUserLoggedIn: isLoggedIn,
    });

    this.setState(newState);
  }

  private setUserState() {
    const newState = Object.assign(this.state, {
      user: getUser(),
    });

    this.setState(newState);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            Aplikacija za rezervaciju restorana.
          </Col>
        </Row>
        {this.state.isUserLoggedIn && this.state.user?.restaurantId && (<Row>
          <Col>
            <HashRouter>
              <Link
                to={"/restaurant/" + this.state.user?.restaurantId}
                key="restaurant"
              >
                {" Moj restoran "}
              </Link>
              |
              <Link
                to={"/restaurant/add-tables"}
                key="restaurant_add_tables"
              >
                {" Dodaj stolove "}
              </Link>
              |
              <Link
                to={"/restaurant/add-working-time"}
                key="restaurant_add_working_times"
              >
                {" Dodaj radno vreme "}
              </Link>
            </HashRouter>
          </Col>
        </Row>)}
        {this.state.isUserLoggedIn && !this.state.user?.restaurantId && (<Row>
          <Col>
            <HashRouter>
              <Link
                to={"/restaurant/add"}
                key="restaurant_add"
              >
                Dodaj restoran
              </Link>
            </HashRouter>
          </Col>
        </Row>)}
        {!this.state.isUserLoggedIn && (<Row>
          <Col>
            <HashRouter>
              <Link
                to="/manager/login"
                key="login"
              >
                Prijava
              </Link>
            </HashRouter>
          </Col>
        </Row>)}
        {!this.state.isUserLoggedIn && (<Row>
          <Col>
            <HashRouter>
              <Link
                to="/manager/register"
                key="register"
              >
                Registracija
                </Link>
            </HashRouter>
          </Col>
        </Row>)}
      </Container>
    );
  }
}

