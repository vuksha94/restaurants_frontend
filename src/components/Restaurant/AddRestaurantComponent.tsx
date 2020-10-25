import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getUser, saveUser } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { AddRestaurantType } from "../../types/dto/AddRestaurantType";
import { CityType } from "../../types/dto/CityType";


interface AddRestaurantState {
    restaurant: AddRestaurantType;
    photo: any;
    cities: CityType[];
    restaurantAdded: boolean;
    restaurantAddedName: string;
    restaurantAddedId: number;
    //alreadyHasRestaurant: boolean;
    isUserLoggedIn: boolean;
    errorMessage: string;
    validated: boolean;
}
export class AddRestaurantComponent extends React.Component {
    state: AddRestaurantState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            restaurant: new AddRestaurantType(),
            photo: null,
            cities: [],
            restaurantAdded: false,
            restaurantAddedName: "",
            restaurantAddedId: 0,
            //alreadyHasRestaurant: false,
            isUserLoggedIn: true,
            errorMessage: "",
            validated: false,
        };
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return <Redirect to="/manager/login" />;
        }

        if (this.state.restaurantAdded) {
            return (
                <Redirect
                    to={"/"}
                ></Redirect>
            );
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
                    id="addForm"
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
                            value={this.state.restaurant.name}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Control
                            as="select"
                            custom
                            id="cityId"
                            value={this.state.restaurant.cityId || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">Izaberite grad</option>
                            {this.state.cities.map(this.singleCityOption)}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Morate izabrati grad.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Adresa"
                            id="address"
                            value={this.state.restaurant.address}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Opis restorana</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Lozinka"
                            id="description"
                            value={this.state.restaurant.description}
                            onChange={this.formInputChanged}
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje nije proslo proveru.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Slika</Form.Label>
                        <Form.File
                            id="photo"
                            onChange={this.onFileChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje nije proslo proveru.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Sačuvati
                    </Button>
                </Form>
            </Container>
        );
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData() {
        /* const userId = getUser()?.id;
         api("manager/restourant/" + userId, "get").then((res: ApiResponseType) => {
             if (res.status === "error" || res.status === "login") {
                 this.setLogginState(false);
                 console.log("greska");
                 return;
             }
             if (res.status === "ok") {
                 if (res.data?.data?.id !== null) {
                     this.putAlreadyHasRestaurantInState(true);
                 }
             } else {
                 console.log("greska");
             }
         });*/

        api("utility/cities", "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putCitiesInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });
    }

    putCitiesInState(cities: CityType[]) {
        const newState = Object.assign(this.state, {
            cities: cities,
        });
        this.setState(newState);
    }

    singleCityOption(city: CityType) {
        return <option value={city.id}>{city.name}</option>;
    }

    handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidate(true);
            return;
        }

        /*let myForm = document.getElementById('addForm');
        let formData = myForm !== null ? new FormData(myForm as HTMLFormElement) : null;*/
        let formData = new FormData();

        /*formData.append("name", this.state.restaurant.name);
        if (this.state.restaurant.hasOwnProperty('description')) {
            formData.append("description", this.state.restaurant.description!);
        }
        formData.append("address", this.state.restaurant.address);
        formData.append("cityId", this.state.restaurant.cityId.toString());
        if (this.state.photo) {
            formData.append("photo", this.state.photo, this.state.photo.name);
        }*/
        api("restourant/add", "post", this.state.restaurant).then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
            }

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessage(res.data.message);
                } else {
                    let user = getUser();
                    user!.restaurantId = res.data?.data.id;
                    saveUser(user!);
                    this.setRestaurantAddedState(true, res.data?.data.name, res.data?.data.id);
                }
            } else if (res.status === "error") {
                this.setErrorMessage("Server error");
            }

        });
    };

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = Object.assign(this.state, {
            restaurant: Object.assign(this.state.restaurant, {
                [event.target.id]: event.target.value
            })
        });
        console.log(event.target.value)
        console.log(newState)
        this.setState(newState);
    };

    private onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files !== null ? event.target.files[0] : null;
        const newState = Object.assign(this.state, {
            [event.target.id]: newFile
        });
        console.log(newFile)
        console.log(newState)
        this.setState(newState);
    };

    private setErrorMessage(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessage: errorMessage,
        });
        this.setState(newState);
    }

    private putAlreadyHasRestaurantInState(hasRestourant: boolean) {
        const newState = Object.assign(this.state, {
            alreadyHasRestaurant: hasRestourant,
        });
        this.setState(newState);
    }
    private setFormValidate(validated: boolean) {
        const newState = Object.assign(this.state, {
            validated: validated,
        });
        this.setState(newState);
    }

    private setRestaurantAddedState(isAdded: boolean, restaurantAddedName: string, id: number) {
        const newState = Object.assign(this.state, {
            restaurantAdded: isAdded,
            restaurantAddedName: restaurantAddedName,
            restaurantAddedId: id
        });
        this.setState(newState);
        console.log(newState)
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }
}