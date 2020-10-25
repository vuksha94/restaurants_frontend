import React from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import api from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { RestourantInfoType } from "../../types/dto/RestaurantInfoType";
import { HashRouter, Link, Redirect } from "react-router-dom";
import { CityType } from "../../types/dto/CityType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

interface SearchRestaurantsState {
    restaurants: RestourantInfoType[];
    loading: boolean;
    cityId: string;
    cities: CityType[];
}

export class SearchRestaurantComponent extends React.Component {
    state: SearchRestaurantsState;
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            restaurants: [],
            loading: false,
            cityId: "",
            cities: []
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Form.Group>
                        <Form.Control
                            as="select"
                            className="option-choosetime"
                            custom
                            id="cityId"
                            value={this.state.cityId || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">Svi gradovi</option>
                            {this.state.cities.map(this.singleCityOption)}

                        </Form.Control>
                    </Form.Group>

                </Row>

                <Row>
                    <Col>
                        <Table bordered hover>
                            <thead>
                                <tr key="heading">
                                    <th>Ime</th>
                                    <th>Adresa</th>
                                    <th>Radno vreme</th>
                                    <th>Detalji</th>
                                    <th>Rezervacija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.restaurants.map((r) => {
                                    return (
                                        <tr key={r.id}>
                                            <td>{r.name}</td>
                                            <td>{r.address + ", " + r.city}</td>
                                            <td>
                                                {
                                                    r.openingDetails ? (r.openingDetails.isOpened ?
                                                        <span>Zatvara se u {r.openingDetails.closingTime}</span> :
                                                        <span >Otvara se u {r.openingDetails.openingDay +
                                                            " od " + r.openingDetails.openingTime}</span>) :
                                                        <span>-</span>
                                                }
                                            </td>
                                            <td>
                                                <HashRouter>
                                                    <Link to={"/restaurant/" + r.id}>
                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                    </Link>
                                                </HashRouter>
                                            </td>
                                            <td>
                                                <HashRouter>
                                                    <Link to={"/restaurant/reservation/check-available-tables/" + r.id}>
                                                        <FontAwesomeIcon icon={faPlusCircle} />
                                                    </Link>
                                                </HashRouter>
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
        this.setLoadingState(true);

        api("utility/cities", "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putCitiesInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });

        let urlRestourants = "restourant/find";
        if (cityId) {
            urlRestourants += "?cityId=" + cityId;
        }

        api(urlRestourants, "get").then((res: ApiResponseType) => {
            this.setLoadingState(false);
            if (res.status === "error" || res.status === "login") {
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putRestourantsInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });


    }
    private setLoadingState(loading: boolean) {
        const newState = Object.assign(this.state, {
            loading: loading,
        });

        this.setState(newState);
    }

    private putCitiesInState(cities: CityType[]) {
        const newState = Object.assign(this.state, {
            cities: cities
        });
        this.setState(newState);
        console.log(newState)
    }
    private putRestourantsInState(restaurants: RestourantInfoType[]) {
        const newState = Object.assign(this.state, {
            restaurants: restaurants
        });
        this.setState(newState);
    }

    private singleCityOption(city: CityType) {
        return <option value={city.id}>{city.name}</option>;
    }
}