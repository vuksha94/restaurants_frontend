import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { saveToken } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { ManagerRegisterType } from "../../types/ManagerRegisterType";

interface RegisterComponentState {
    register: ManagerRegisterType;
    isRegistered: boolean;
    errorMessage: string;
    validated: boolean;
}

export class RegisterCompopnent extends React.Component {
    state: RegisterComponentState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            register: new ManagerRegisterType(),
            isRegistered: false,
            errorMessage: "",
            validated: false,
        };
    }

    render() {
        if (this.state.isRegistered === true) {
            return <Redirect to="/manager/login"></Redirect>;
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
                        <Form.Label>Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ime"
                            id="name"
                            value={this.state.register.name}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Prezime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Prezime"
                            id="lastName"
                            value={this.state.register.lastName}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={this.state.register.email}
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
                            placeholder="Lozinka"
                            id="password"
                            value={this.state.register.password}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Potvrda lozinke</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Potvrda lozinke"
                            id="confirmPassword"
                            value={this.state.register.confirmPassword}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Registruj se
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

        api("auth/manager/register", "post", {
            name: this.state.register.name,
            lastName: this.state.register.lastName,
            email: this.state.register.email,
            password: this.state.register.password,
            confirmPassword: this.state.register.confirmPassword
        }).then((res: ApiResponseType) => {
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
                    this.setRegisteredState(true);
                }
            }
        });
    };

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = Object.assign(this.state, {
            register: Object.assign(this.state.register, {
                [event.target.id]: event.target.value
            })
        });
        this.setState(newState);
    };

    private setRegisteredState(isRegistered: boolean) {
        const newState = Object.assign(this.state, {
            isRegistered: isRegistered,
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