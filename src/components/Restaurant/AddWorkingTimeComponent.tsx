import React from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { getUser } from "../../api/api";
import { AddWorkingTimes } from "../../types/dto/AddWorkingTimes";
import { ApiResponseType } from "../../types/dto/ApiResponseType";
import { NonWorkingDaysDescType } from "../../types/dto/NonWorkingDayDescType";
import { NonWorkingDayType } from "../../types/dto/NonWorkingDayType";
import { WorkingTime } from "../../types/dto/WorkingTime";
class DaysOfWeek {
    monday: WorkingTime;
    tuesday: WorkingTime;
    wednesday: WorkingTime;
    thursday: WorkingTime;
    friday: WorkingTime;
    saturday: WorkingTime;
    sunday: WorkingTime;
    constructor() {
        this.monday = new WorkingTime(1);
        this.tuesday = new WorkingTime(2);
        this.wednesday = new WorkingTime(3);
        this.thursday = new WorkingTime(4);
        this.friday = new WorkingTime(5);
        this.saturday = new WorkingTime(6);
        this.sunday = new WorkingTime(7);
    }
}
interface AddWorkingTimeState {
    restourantId: number;
    workingTimes: WorkingTime[];
    days: DaysOfWeek;
    workingTimeAdded: boolean;
    nonWorkingDaysAdded: boolean;
    hours: string[];
    minutes: string[];
    nonWorkingDays: NonWorkingDayType;
    descriptionForNonWorkingDay: NonWorkingDaysDescType[];
    isUserLoggedIn: boolean;
    errorMessageNonWorkingDays: string;
    errorMessageWorkingTime: string;
    validatedNonWorkinDays: boolean;
    validatedWorkingTime: boolean;
}

export class AddWorkingTimeComponent extends React.Component {

    state: AddWorkingTimeState;

    constructor(props: Readonly<{}>) {
        super(props);
        const hours = [];
        for (let i = 0; i < 24; i++) {
            let hour = i < 10 ? '0' + i : i.toString();
            hours.push(hour);
        }

        this.state = {
            restourantId: 0,
            workingTimes: [],
            days: new DaysOfWeek(),
            workingTimeAdded: false,
            nonWorkingDaysAdded: false,
            isUserLoggedIn: true,
            hours: hours,
            minutes: ['00', '30'],
            nonWorkingDays: new NonWorkingDayType(),
            descriptionForNonWorkingDay: [],
            errorMessageNonWorkingDays: "",
            errorMessageWorkingTime: "",
            validatedNonWorkinDays: false,
            validatedWorkingTime: false
        };
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return <Redirect to="/manager/login" />;
        }
        if (this.state.workingTimeAdded || this.state.nonWorkingDaysAdded) {
            return (
                <Redirect
                    to={"/restaurant/" + this.state.restourantId}
                ></Redirect>
            );
        }
        return (
            <Container>
                <Alert
                    variant="danger"
                    className={this.state.errorMessageWorkingTime ? "" : "d-none"}
                >
                    {this.state.errorMessageWorkingTime}
                </Alert>
                <h3>Dodavanje radnog vremena</h3>
                <Form
                    noValidate
                    validated={this.state.validatedWorkingTime}
                    onSubmit={this.handleWorkingTimeSubmit}
                >
                    <Form.Group>
                        <Form.Label>Ponedeljak</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="monday_openingTime_hours"
                            value={this.state.days.monday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="monday_openingTime_mins"
                            value={this.state.days.monday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="monday_closingTime_hours"
                            value={this.state.days.monday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="monday_closingTime_mins"
                            value={this.state.days.monday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Utorak</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="tuesday_openingTime_hours"
                            value={this.state.days.tuesday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="tuesday_openingTime_mins"
                            value={this.state.days.tuesday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="tuesday_closingTime_hours"
                            value={this.state.days.tuesday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="tuesday_closingTime_mins"
                            value={this.state.days.tuesday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Sreda</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="wednesday_openingTime_hours"
                            value={this.state.days.wednesday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="wednesday_openingTime_mins"
                            value={this.state.days.wednesday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="wednesday_closingTime_hours"
                            value={this.state.days.wednesday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="wednesday_closingTime_mins"
                            value={this.state.days.wednesday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Četvrtak</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="thursday_openingTime_hours"
                            value={this.state.days.thursday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="thursday_openingTime_mins"
                            value={this.state.days.thursday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="thursday_closingTime_hours"
                            value={this.state.days.thursday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="thursday_closingTime_mins"
                            value={this.state.days.thursday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Petak</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="friday_openingTime_hours"
                            value={this.state.days.friday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="friday_openingTime_mins"
                            value={this.state.days.friday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="friday_closingTime_hours"
                            value={this.state.days.friday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="friday_closingTime_mins"
                            value={this.state.days.friday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Subota</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="saturday_openingTime_hours"
                            value={this.state.days.saturday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="saturday_openingTime_mins"
                            value={this.state.days.saturday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="saturday_closingTime_hours"
                            value={this.state.days.saturday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="saturday_closingTime_mins"
                            value={this.state.days.saturday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Nedelja</Form.Label>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="sunday_openingTime_hours"
                            value={this.state.days.sunday.openingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="sunday_openingTime_mins"
                            value={this.state.days.sunday.openingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>

                        :
                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="sunday_closingTime_hours"
                            value={this.state.days.sunday.closingTime.split(":")[0] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">hh</option>
                            {this.state.hours.map(this.singleHourOption)}
                        </Form.Control>

                        <Form.Control
                            as="select"
                            className={"option-choosetime"}
                            custom
                            id="sunday_closingTime_mins"
                            value={this.state.days.sunday.closingTime.split(":")[1] || ""}
                            onChange={this.formInputChanged}
                            required
                        >
                            <option value="">mm</option>
                            {this.state.minutes.map(this.singleMinsOption)}
                        </Form.Control>

                    </Form.Group>


                    <Button variant="primary" type="submit">
                        Sačuvati
                    </Button>
                </Form>

                <h3>Dodavanje neradnih dana restorana</h3>
                <Alert
                    variant="danger"
                    className={this.state.errorMessageNonWorkingDays ? "" : "d-none"}
                >
                    {this.state.errorMessageNonWorkingDays}
                </Alert>
                <Form
                    noValidate
                    validated={this.state.validatedNonWorkinDays}
                    onSubmit={this.handleNonWorkingDaysSubmit}
                >
                    <Form.Group>
                        <Form.Label>Opis</Form.Label>
                        <Form.Control
                            as="select"
                            custom
                            id="descriptionId"
                            className={"option-choosetime"}
                            value={this.state.nonWorkingDays.descriptionId || ""}
                            onChange={this.formInputChangedNonWorkingTime}
                            required
                        >
                            <option value="">Izaberite opis</option>
                            {this.state.descriptionForNonWorkingDay
                                .map(desc => <option value={desc.id}>{desc.description}</option>)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Datum</Form.Label>
                        <Form.Control
                            type="date"
                            custom
                            id="date"
                            className={"option-choosetime"}
                            value={this.state.nonWorkingDays.date || ""}
                            onChange={this.formInputChangedNonWorkingTime}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Password cannot be empty.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sačuvati
                    </Button>
                </Form>
            </Container>
        );
    }

    componentWillMount() {
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
        api("utility/non-working-days-desc", "get").then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                console.log("greska");
                return;
            }
            if (res.status === "ok") {
                this.putNonWorkingDaysDescInState(res.data?.data);
            } else {
                console.log("greska");
            }
        });
    }
    private putNonWorkingDaysDescInState(descriptions: NonWorkingDaysDescType[]) {
        const newState = Object.assign(this.state, {
            descriptionForNonWorkingDay: descriptions
        });
        this.setState(newState);
    }

    handleWorkingTimeSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidateAddWorkingTime(true);
            return;
        }

        // punjenje niza radnog vremena za svaki dan; salje se na server
        const addWorkingTimes = new AddWorkingTimes();
        for (const day in this.state.days) {
            const workingTimeToAdd = (this.state.days as any)[day] as WorkingTime;
            workingTimeToAdd.restourantId = this.state.restourantId;
            workingTimeToAdd.isWorking = true;
            addWorkingTimes.workingTimes.push(workingTimeToAdd);
        }
        console.log(addWorkingTimes);
        api("restourant/working-time/add", "post", addWorkingTimes).then((res: ApiResponseType) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
            }

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessageWorkingTime(res.data.message);
                } else {
                    this.setWorkingTimesAddedState(true);
                }
            } else if (res.status === "error") {
                this.setErrorMessageWorkingTime("Server error");
            }

        });
    };

    handleNonWorkingDaysSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            this.setFormValidateNonWorkingTime(true);
            return;
        }

        const nonWorkingDaysToSend: NonWorkingDayType[] = [];
        const nonWorkingDayToSend = this.state.nonWorkingDays;
        nonWorkingDayToSend.restourantId = this.state.restourantId;
        nonWorkingDaysToSend.push(nonWorkingDayToSend);
        api("restourant/non-working-days/add", "post", { nonWorkingDays: nonWorkingDaysToSend }).then((res: ApiResponseType) => {
            console.log(res)
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
            }

            if (res.status === "ok") {
                if (res.data?.status === "error") {
                    this.setErrorMessageNonWorkingDays(res.data.message);
                } else {
                    this.setNonWorkingDaysAddedState(true);
                }
            } else if (res.status === "error") {
                this.setErrorMessageNonWorkingDays("Server error");
                console.log(this.state);
            }

        });
    };

    private formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selecedtIdArray = event.target.id.split("_");
        const day = selecedtIdArray[0]; // monday/tuesday/wednesday...
        const time = selecedtIdArray[1]; // openingTime/closingTime
        const hoursOrMins = selecedtIdArray[2]; // hours/mins
        const newValue = event.target.value;
        const newWorkTime = (this.state.days as any)[day];
        if (hoursOrMins === "hours") {
            newWorkTime[time] = newValue + ":" + newWorkTime[time].split(":")[1];
        }
        else {
            newWorkTime[time] = newWorkTime[time].split(":")[0] + ":" + newValue;
        }
        const newDays = Object.assign(this.state.days, {
            [day]: newWorkTime
        })
        const newState = Object.assign(this.state, {
            days: newDays
        });
        console.log(event.target.value)
        console.log(newState)
        this.setState(newState);
    };
    private formInputChangedNonWorkingTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWorkingDaysState = Object.assign(this.state.nonWorkingDays, {
            [event.target.id]: event.target.value,
        });
        const newState = Object.assign(this.state, {
            nonWorkingDays: newWorkingDaysState
        });
        this.setState(newState);
        console.log(newState)
    };

    private putRestourantIdInState(id: number) {
        const newState = Object.assign(this.state, {
            restourantId: id
        });
        this.setState(newState);
    }
    private setErrorMessageWorkingTime(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessageWorkingTime: errorMessage,
        });
        this.setState(newState);
    }
    private setErrorMessageNonWorkingDays(errorMessage: string) {
        const newState = Object.assign(this.state, {
            errorMessageNonWorkingDays: errorMessage,
        });
        this.setState(newState);
    }
    private setFormValidateAddWorkingTime(validated: boolean) {
        const newState = Object.assign(this.state, {
            validatedWorkingTime: validated,
        });
        this.setState(newState);
    }

    private setFormValidateNonWorkingTime(validated: boolean) {
        const newState = Object.assign(this.state, {
            validatedNonWorkinDays: validated,
        });
        this.setState(newState);
    }

    private setWorkingTimesAddedState(isAdded: boolean) {
        const newState = Object.assign(this.state, {
            workingTimeAdded: isAdded
        });
        this.setState(newState);
        console.log(newState)
    }
    private setNonWorkingDaysAddedState(isAdded: boolean) {
        const newState = Object.assign(this.state, {
            nonWorkingDaysAdded: isAdded
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

    private singleMinsOption(min: string) {
        return <option value={min}>{min}</option>;
    }
    private singleHourOption(hour: string) {
        return <option value={hour}>{hour}</option>;
    }
}