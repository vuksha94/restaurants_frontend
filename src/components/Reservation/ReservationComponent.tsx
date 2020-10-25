import React from "react";
import { Alert, Button, Container, Table, Form, Row, Card, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getReservationData } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { AddReservationUserType } from "../../types/dto/AddReservationUserType";
import { TableType } from "../../types/dto/TableType";
import { AvailableTablesType } from "../../types/dto/AvailableTablesType";
import { ReservationData } from "../../types/ReservationData";
import { ReservationType } from "../../types/dto/ReservationType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

interface ReservationState {
    reservations: ReservationType[];
    successMessage: string;
    errorMessage: string;
    validated: boolean;
}
export class ReservationComponent extends React.Component {
    state: ReservationState;
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            reservations: [],
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
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Restoran</th>
                                    <th>Na ime</th>
                                    <th>Datum</th>
                                    <th>Vreme</th>
                                    <th>Status</th>
                                    <th>Prihvati</th>
                                    <th>Odbij</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reservations.map((r) => {
                                    return (
                                        <tr>
                                            <td>{r.table?.restourant?.name}</td>
                                            <td>{r.name + " " + r.lastName}</td>
                                            <td>{r.reservationDate}</td>
                                            <td>{r.fromTime + " - " + r.untillTime}</td>
                                            <td><span className={r.status?.code === 1 ? 'text-success' : (r.status?.code === 2 ? 'text-danger' : '')}>{r.status?.description}</span></td>
                                            <td>
                                                {r.status?.code === 0 && (
                                                    <Button variant="success" onClick={() => this.confirmReservation(r.id)}>
                                                        <FontAwesomeIcon icon={faCheckCircle} />
                                                    </Button>
                                                )}
                                            </td>
                                            <td>
                                                {r.status?.code === 0 && (
                                                    <Button variant="danger" onClick={() => this.rejectReservation(r.id)}>
                                                        <FontAwesomeIcon icon={faTimesCircle} />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }

    private confirmReservation = (id: number | undefined) => {
        api("/reservations/confirm/" + id, "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                console.log(res.data?.data);
                window.location.reload();
            } else {
                console.log("greska");
            }
        });
    }
    private rejectReservation = (id: number | undefined) => {
        api("/reservations/reject/" + id, "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                window.location.reload();
            } else {
                console.log("greska");
            }
        });
    }


    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value,
        });

        this.setState(newState);
        this.getAllData(event.target.value); // refresh table with only restaurants from city with given id
    };

    componentWillMount() {
        this.getAllData();
    }

    getAllData(cityId?: string) {

        api("reservations/find", "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putReservationsInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });
    }

    private putReservationsInState(reservations: ReservationType) {
        const newState = Object.assign(this.state, {
            reservations: reservations,
        });

        this.setState(newState);
    }



}