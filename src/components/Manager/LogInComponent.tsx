import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { saveToken, saveUser } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { ManagerLoginType } from "../../types/ManagerLoginType";
import { UserType } from "../../types/UserType";

interface LoginComponentProps {
    isLoggedInFunc: (loggedIn: boolean) => void
}
interface LoginComponentState {
    login: ManagerLoginType;
    isLoggedIn: boolean;
    user?: UserType;
    errorMessage: string;
    validated: boolean;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {
    //state: LoginComponentState;

    constructor(props: LoginComponentProps) {
        super(props);
        this.state = {
            login: { email: "", password: "" },
            isLoggedIn: false,
            errorMessage: "",
            validated: false,
        };
        props.isLoggedInFunc(false); // odjavi korisnika
        console.log(this.state)
    }

    render() {
        if (this.state.isLoggedIn === true) {

            return <Redirect to="/"></Redirect>;
        }
        return (
            <Container>
                <Alert
                    variant="danger"
                    className={this.state.errorMessage ? "" : "d-none"}
                >
                    {this.state.errorMessage}
                </Alert>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.handleSubmit}
                >
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={this.state.login.email}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
            </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            id="password"
                            value={this.state.login.password}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Prijava
                    </Button>
                </Form>
            </Container>
        );
    }

    handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidate(true);
            return;
        }

        api("auth/manager/login", "post", {
            email: this.state.login.email,
            password: this.state.login.password,
        }).then((res: ApiResponseType) => {
            if (res.status === "serverError") {
                this.setErrorMessage("Greska na serveru!");
                return;
            }
            if (res.status === "error") {
                this.setErrorMessage("Greska na serveru!");
                return;
            }

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessage(res.data.message);
                } else {
                    console.log(res.data?.data);
                    saveToken(res.data?.data.token);
                    const user = new UserType(res.data?.data.id, res.data?.data.email, res.data?.data.restaurantId);
                    saveUser(user);
                    this.setUserInState(user);
                    console.log(user)
                    this.setLoggedInState(true);
                    this.props.isLoggedInFunc(true);
                }
            }
        });
    };

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        /* const newState = Object.assign(this.state, {
             login: { [event.target.id]: event.target.value },
         });*/
        const newState = Object.assign(this.state, {
            login: Object.assign(this.state.login, {
                [event.target.id]: event.target.value
            })
        });
        this.setState(newState);
    };

    private setLoggedInState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });
        this.setState(newState);
    }
    private setUserInState(user: UserType) {
        const newState = Object.assign(this.state, {
            user: user,
        });
        this.setState(newState);
    }

    private setErrorMessage(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessage: errorMessage,
        });
        this.setState(newState);
    }

    private setFormValidate(validated: boolean) {
        const newState = Object.assign(this.state, {
            validated: validated,
        });
        this.setState(newState);
    }


}
/*
LoginComponent.propTypes = {
    isLoggedInFunc: React.PropTypes.func
  };
  */