import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getUser } from "../../api/api";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { TableDescType } from "../../types/dto/TableDescType";
import { TableType } from "../../types/dto/TableType";

interface AddWorkingTimeState {
    table: TableType;
    tablesDescription: TableDescType[];
    restourantId: number;
    tablesAdded: boolean;
    isUserLoggedIn: boolean;
    successMessage: string;
    errorMessage: string;
    validated: boolean;
}
export class AddTablesComponent extends React.Component {
    state: AddWorkingTimeState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            table: {}, // napraviti jedan sto
            tablesDescription: [],
            restourantId: 0,
            tablesAdded: false,
            isUserLoggedIn: true,
            successMessage: "",
            errorMessage: "",
            validated: false,
        };
        console.log(this.state)
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return <Redirect to="/manager/login" />;
        }
        /*if (this.state.tablesAdded) {
            return (
                <Redirect
                    to={"/"}
                ></Redirect>
            );
        }*/
        return (
            <Container>
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
                <h3>Dodavanje stolova</h3>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.handleSubmit}
                >
                    <Form.Group>
                        <Form.Label>Broj stola</Form.Label>
                        <Form.Control
                            type="number"
                            className={"option-choosetime"}
                            placeholder="Broj stola"
                            id="tableNumber"
                            value={this.state.table.tableNumber || ""}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Broj osoba</Form.Label>
                        <Form.Control
                            type="number"
                            className={"option-choosetime"}
                            placeholder="Kapacitet"
                            id="capacity"
                            value={this.state.table.capacity || ""}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Maksimalno sati rezervacije</Form.Label>
                        <Form.Control
                            type="number"
                            className={"option-choosetime"}
                            placeholder="Max sati"
                            id="maxHoursAvailable"
                            value={this.state.table.maxHoursAvailable || ""}
                            onChange={this.formInputChanged}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Opis</Form.Label>
                        <Form.Control
                            as="select"
                            className="option-choosetime"
                            custom
                            id="descriptionId"
                            value={this.state.table.descriptionId || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">Opis</option>
                            {this.state.tablesDescription.map(this.singleDescOption)}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Polje ne sme biti prazno.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sačuvaj
                    </Button>
                </Form>
            </Container>
        );
    }

    private singleDescOption(desc: TableDescType) {
        return <option value={desc.id}>{desc.description}</option>;
    }

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTableState = Object.assign(this.state.table, {
            [event.target.id]: event.target.value,
        });
        const newState = Object.assign(this.state, {
            table: newTableState
        });
        this.setState(newState);
        console.log(newState)
    };

    handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidate(true);
            return;
        }
        this.resetMessages();

        const objToSend: TableType[] = [];
        const tableToSend = this.state.table;
        tableToSend.restourantId = this.state.restourantId;
        objToSend.push(tableToSend);

        api("restourant/tables/add", "post", { tables: objToSend }).then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
            }

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessage(res.data.message);
                } else {
                    this.setSuccessMessage("Sto je dodat.");
                    this.setAddedTablesState(true);
                }
            } else if (res.status === "error") {
                this.setErrorMessage("Server error");
            }
        });
    };

    componentDidMount() {
        this.getAllData();
    }

    getAllData() {
        console.log(getUser())
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

        // get non working days descriptions
        api("utility/table-desc", "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putTableDescInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private putTableDescInState(tablesDescription: TableDescType[]) {
        const newState = Object.assign(this.state, {
            tablesDescription: tablesDescription
        });
        this.setState(newState);
    }
    private putRestourantIdInState(id: number) {
        const newState = Object.assign(this.state, {
            restourantId: id
        });
        this.setState(newState);
    }

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
    private resetMessages() {
        const newState = Object.assign(this.state, {
            successMessage: "",
            errorMessage: ""
        });
        this.setState(newState);
    }

    private setAddedTablesState(isAdded: boolean) {
        const newState = Object.assign(this.state, {
            tablesAdded: isAdded
        });
        this.setState(newState);
        console.log(newState)
    }
}