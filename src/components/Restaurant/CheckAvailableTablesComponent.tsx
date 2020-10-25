import React from "react";
import { Alert, Button, Container, Form, Row, Card, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getUser } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { AddReservationUserType } from "../../types/dto/AddReservationUserType";
import { TableType } from "../../types/dto/TableType";
import { AvailableTablesType } from "../../types/dto/AvailableTablesType";
import { ReservationData } from "../../types/ReservationData";

interface Props {
    match: {
        params: {
            id: number;
        };
    };
}
interface CheckAvailableTablesState {
    restaurantId: number;
    user: AddReservationUserType;
    availableTables?: AvailableTablesType;
    fromTimeMins: string;
    fromTimeHrs: string;
    loading: boolean;
    hours: string[];
    mins: string[];
    successMessage: string;
    errorMessage: string;
    reservationClicked: boolean;
    validated: boolean;
}

export class CheckAvailableTablesComponent extends React.Component {
    state: CheckAvailableTablesState;
    constructor(props: Props) {
        super(props);

        const hours = [];
        for (let i = 10; i < 23; i++) {
            let hour = i < 10 ? '0' + i : i.toString();
            hours.push(hour);
        }

        this.state = {
            restaurantId: props.match.params.id, // from route param :id
            loading: false,
            user: {},
            fromTimeMins: "",
            fromTimeHrs: "",
            hours: hours,
            mins: ['00', '30'],
            successMessage: "",
            errorMessage: "",
            reservationClicked: false,
            validated: false
        }
    }

    render() {
        if (this.state.reservationClicked) {
            return <Redirect to="/restaurant/reservation" />;
        }
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
                        <Form
                            noValidate
                            validated={this.state.validated}
                            onSubmit={this.handleSubmit}
                        >

                            <Form.Group>
                                <Form.Label>Datum</Form.Label>
                                <Form.Control
                                    type="date"
                                    className="option-choosetime"
                                    id="reservationDate"
                                    value={this.state.user.reservationDate || ""}
                                    onChange={this.formInputChanged}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Polje ne sme biti prazno.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Vreme</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="option-choosetime"
                                    custom
                                    id="fromTimeHrs"
                                    value={this.state.fromTimeHrs || ""}
                                    onChange={this.timeInputChanged}
                                    required
                                >
                                    <option value="">hh</option>
                                    {this.state.hours.map(this.singleHourOption)}
                                </Form.Control>
                                <Form.Control
                                    as="select"
                                    className={"option-choosetime"}
                                    custom
                                    id="fromTimeMins"
                                    value={this.state.fromTimeMins || ""}
                                    onChange={this.timeInputChanged}
                                    required
                                >
                                    <option value="">mm</option>
                                    {this.state.mins.map(this.singleMinsOption)}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Proveri slobodne stolove
                            </Button>
                        </Form>
                    </Col>
                </Row>
                {this.state.availableTables ?
                    (<Row>
                        {this.state.availableTables.isOpened ?
                            (this.state.availableTables.tables?.length ?
                                this.state.availableTables.tables.map(this.singleTableCard) :
                                'Nema slobodnih stolova u željenom terminu.')
                            : 'Restoran ne radi u željenom terminu.'}
                    </Row>) : ''
                }

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

        const objToSend = {
            restourantId: this.state.restaurantId,
            reservationDate: this.state.user.reservationDate,
            fromTime: this.state.fromTimeHrs + ":" + this.state.fromTimeMins
        };

        api("restourant/available-tables", "post", objToSend).then((res: ApiResponseType) => {
            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessage(res.data.message);
                } else {
                    console.log(res.data?.data);
                    this.putAvailableTablesInState(res.data?.data);
                }
            } else if (res.status === "error") {
                this.setErrorMessage("Server error");
            }

        });
    };


    /*componentWillMount() {
        this.getAllData();
    }

    getAllData() {
        const userId = getUser()?.id;
        api("manager/restourant/" + userId, "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putRestourantIdInState(res.data?.data.id);
            } else {
                console.log("greska");
            }
        });
    }*/

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

    private timeInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value
        });
        this.setState(newState);
        console.log(newState)
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

    private putAvailableTablesInState(availableTables: AvailableTablesType) {
        const newState = Object.assign(this.state, {
            availableTables: availableTables,
        });
        this.setState(newState);
    }

    private singleTableCard = (table: TableType) => {
        return (
            <Col>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{table.description?.description}</Card.Title>
                        <Card.Text>
                            {'Kapacitet stola: ' + table.capacity +
                                '. Maksimalno trajanje rezervacije: ' + table.maxHoursAvailable + '.'}
                        </Card.Text>
                        <Button variant="primary" onClick={() => this.saveData(table)}>Rezerviši</Button>
                    </Card.Body>
                </Card>
            </Col>
        );

    }

    private saveData = (table: TableType) => {
        const untillTimeInMins = parseInt(this.state.fromTimeHrs) * 60 + parseInt(this.state.fromTimeMins) + (table.maxHoursAvailable !== undefined ? table.maxHoursAvailable * 60 : 0);
        const untillTimeHrs = Math.floor(untillTimeInMins / 60) % 24;
        const untillTimeMins = untillTimeInMins % 60;
        const untillTimeHrsString = untillTimeHrs.toString().length === 1 ? '0' + untillTimeHrs : untillTimeHrs.toString();
        const untillTimeMinsString = untillTimeMins.toString().length === 1 ? '0' + untillTimeMins : untillTimeMins.toString();
        console.log('untillTime: ' + untillTimeHrsString + ' ' + untillTimeMinsString)
        const reservationData: ReservationData = {
            restourantId: this.state.restaurantId,
            tableId: table.id,
            fromTime: this.state.fromTimeHrs + ":" + this.state.fromTimeMins,
            maxHoursAvailable: table.maxHoursAvailable,
            reservationDate: this.state.user.reservationDate,
            untillTime: untillTimeHrsString + ':' + untillTimeMinsString
        };
        localStorage.setItem("RESERVATION_DATA", JSON.stringify(reservationData));
        this.setReservationClicked(true);
        return;
    }

    private setReservationClicked(isClicked: boolean) {
        const newState = Object.assign(this.state, {
            reservationClicked: isClicked,
        });
        this.setState(newState);
    }
    private singleMinsOption(min: string) {
        return <option value={min}>{min}</option>;
    }
    private singleHourOption(hour: string) {
        return <option value={hour}>{hour}</option>;
    }
}