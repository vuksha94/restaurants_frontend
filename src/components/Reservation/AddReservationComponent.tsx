import React from "react";
import { Alert, Button, Container, Form, Row, Card, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getReservationData } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { AddReservationUserType } from "../../types/dto/AddReservationUserType";
import { TableType } from "../../types/dto/TableType";
import { AvailableTablesType } from "../../types/dto/AvailableTablesType";
import { ReservationData } from "../../types/ReservationData";

interface AddReservationState {
    user: AddReservationUserType;
    maxHoursAvailable?: number;
    successMessage: string;
    errorMessage: string;
    //    reservationSaved: boolean;
    validated: boolean;
}
export class AddReservationComponent extends React.Component {
    state: AddReservationState;
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            user: {},
            successMessage: "",
            errorMessage: "",
            validated: false
        }

    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Alert
                            variant="success"
                            className={this.state.successMessage ? "" : "d-none"}
                        >
                            {this.state.successMessage}
                        </Alert>
                        <Alert
                            variant="danger"
                            className={this.state.errorMessage ? "" : "d-none"}
                        >
                            {this.state.errorMessage}
                        </Alert>
                        <h3>Rezervacija</h3>
                        <p>
                            {'Datum: ' + this.state.user.reservationDate + " od " + this.state.user.fromTime + " do " + this.state.user.untillTime + " časova."}
                        </p>
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
                                    value={this.state.user.name || ""}
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
                                    value={this.state.user.lastName || ""}
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
                                    value={this.state.user.email || ""}
                                    onChange={this.formInputChanged}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Polje ne sme biti prazno.
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Telefon</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Telefon"
                                    id="phone"
                                    value={this.state.user.phone || ""}
                                    onChange={this.formInputChanged}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Polje ne sme biti prazno.
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Poslati
                        </Button>


                        </Form>
                    </Col>
                </Row>
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
        console.log(this.state.user);

        api("reservations/add", "post", this.state.user).then((res: ApiResponseType) => {

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessage(res.data.message);
                } else {
                    console.log(res.data?.data);
                    this.setSuccessMessage("Rezervacija je prosledjena i čeka se odobrenje menadžera.");
                }
            } else if (res.status === "error") {
                this.setErrorMessage("Server error");
            }

        });
    };

    private setFormValidate(validated: boolean) {
        const newState = Object.assign(this.state, {
            validated: validated,
        });
        this.setState(newState);
    }
    private setErrorMessage(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessage: errorMessage,
        });
        this.setState(newState);
    }

    private setSuccessMessage(successMessage: string) {
        const newState = Object.assign(this.state, {
            successMessage: successMessage,
        });
        this.setState(newState);
    }


    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newUserState = Object.assign(this.state.user, {
            [event.target.id]: event.target.value,
        });
        const newState = Object.assign(this.state, {
            user: newUserState
        });
        this.setState(newState);
        console.log(newState)
    };


    componentWillMount() {
        this.getAllData();
    }

    getAllData() {
        const reservationData = getReservationData();
        this.putReservationDataInState(reservationData);
    }
    private putReservationDataInState(reservationData: ReservationData | null) {
        if (reservationData === null) {
            this.setErrorMessage("Nema podataka rezervacije.")
            return;
        };
        const newUserState = Object.assign(this.state.user, {
            tableId: reservationData.tableId,
            fromTime: reservationData.fromTime,
            reservationDate: reservationData.reservationDate,
            untillTime: reservationData.untillTime,
            maxHoursAvailable: reservationData.maxHoursAvailable
        });
        const newState = Object.assign(this.state, {
            user: newUserState
        });
        this.setState(newState);
        console.log(newState);
    }

}