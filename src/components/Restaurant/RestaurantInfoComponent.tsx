import React from "react";
import { Container, Table } from "react-bootstrap";
import api, { getUser } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { RestourantInfoType } from "../../types/dto/RestaurantInfoType";

interface RestaurantInfoProps {
    match: {
        params: {
            id: number;
        };
    };
}
interface RestaurantInfoState {
    isUserLoggedIn: boolean;
    id: number;
    restaurantInfo?: RestourantInfoType;
    isManagerViewing?: boolean;
    loading: boolean;
}
export class RestaurantInfoComponent extends React.Component {
    state: RestaurantInfoState;
    constructor(props: RestaurantInfoProps) {
        super(props);
        this.state = {
            id: props.match.params.id, // from route param :id
            isUserLoggedIn: true,
            loading: false,
            isManagerViewing: getUser()?.id === props.match.params.id
        }
    }


    render() {
        return !this.state.loading && (
            <Container >
                <h3>{this.state.restaurantInfo?.name}</h3>
                <p>{this.state.restaurantInfo?.address + ", " + this.state.restaurantInfo?.city}</p>
                <p>{
                    this.state.restaurantInfo?.openingDetails?.isOpened ?
                        <span style={{ color: "green", fontWeight: "bold" }}>Otvoren</span> :
                        <span style={{ color: "red", fontWeight: "bold" }}>Zatvoren</span>

                }</p>
                <p>{
                    this.state.restaurantInfo?.openingDetails?.isOpened ?
                        <span>Zatvara se u {this.state.restaurantInfo?.openingDetails?.closingTime}</span> :
                        <span >Otvara se u {this.state.restaurantInfo?.openingDetails?.openingDay +
                            " od " + this.state.restaurantInfo?.openingDetails?.openingTime}</span>

                }</p>
                <h5>Radno vreme</h5>
                <Table bordered hover>
                    <thead>
                        <tr><th>Redni dan u nedelji</th><th>Otvara</th><th>Zatvara</th></tr>
                    </thead>
                    <tbody>
                        {this.state.restaurantInfo?.workingTimes?.map(wt => {
                            return <tr>
                                <td>{wt.dayOfWeekId}.</td>
                                <td>{wt.openingTime.substring(0, 5)}</td>
                                <td>{wt.closingTime.substring(0, 5)}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>


                <h5>Neradni dani u godini</h5>
                <Table bordered hover>
                    <thead>
                        <tr><th>Datum</th></tr>
                    </thead>
                    <tbody>
                        {this.state.restaurantInfo?.nonWorkingDays?.map(nwd => {
                            return <tr>
                                <td>{nwd.date}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>

                <h5>Stolovi</h5>

                <div>
                    <Table bordered hover>
                        <thead>
                            <tr><th>Broj stola</th><th>Broj osoba</th><th>Duzina rezervacije (u satima)</th><th>Opis</th></tr>
                        </thead>
                        <tbody>
                            {this.state.restaurantInfo?.tables?.map(t => {
                                return <tr><td>{t.tableNumber}</td><td>{t.capacity}</td><td>{t.maxHoursAvailable}</td><td></td></tr>
                            })}
                        </tbody>
                    </Table>
                </div>
            </Container>
        );
    }


    componentWillMount() {
        this.getAllData();
    }

    getAllData() {
        this.setLoadingState(true);
        api("restourant/" + this.state.id, "get").then((res: ApiResponseType) => {
            this.setLoadingState(false);
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putRestourantInfoInState(res.data?.data);
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

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private putRestourantInfoInState(restaurantInfo: RestourantInfoType[]) {
        console.log(restaurantInfo)
        const newState = Object.assign(this.state, {
            restaurantInfo: restaurantInfo[0]
        });
        this.setState(newState);
        console.log(newState)
    }
}