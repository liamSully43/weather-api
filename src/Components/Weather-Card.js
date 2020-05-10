import React from 'react';

class WeatherCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "More Details", //more details button test
            display: "none", // display for the more details div
            detailsButtonDisplay: "none", //display for the more details button
            current: "",
            average: "",
            feel: "",
            high: "",
            low: "",
            wind: "",
            prec: "",
            cel: "#212121", //colours of the cel vs fah buttons
            fah: "grey",
        }
    }

    cel = () => { //updates the app to metric
        const data = this.props.data;
        this.setState({
            current: this.props.current.temp_c,
            average: data.day.avgtemp_c,
            feel: this.props.current.feelslike_c,
            high: data.day.maxtemp_c,
            low: data.day.mintemp_c,
            wind: data.day.maxwind_mph + " mph",
            prec: data.day.totalprecip_mm + " mm",
        })
    }

    fah = () => { //updates the app to imperial
        const data = this.props.data;
        this.setState({
            current: this.props.current.temp_f,
            average: data.day.avgtemp_f,
            feel: this.props.current.feelslike_f,
            high: data.day.maxtemp_f,
            low: data.day.mintemp_f,
            wind: data.day.maxwind_kph + " kph",
            prec: data.day.totalprecip_in + " in",
        })
    }

    componentDidUpdate(oldProps) {
        if(oldProps !== this.props) { // checks if the props have changed, states can only be updated in this if statement to avoid an infinite loop as this is called when a state is changed/updated
            if(this.props.degree === "cel") {// change the units to metric
                this.cel();
                this.setState({
                    cel: "#212121",
                    fah: "grey",
                })
            }
            else { // change the units to imperial
                this.fah();
                this.setState({
                    cel: "grey",
                    fah: "#212121",
                })
            }
            if(this.props.geoAllowed === false || this.props.geoAllowed === null) { //hides the more details button and details div if no location is found
                this.setState({
                    detailsButtonDisplay: "none",
                    display: "none",
                    title: "More Details",
                })
            }
            else {
                this.setState({
                    detailsButtonDisplay: "block",
                    display: "none",
                    title: "More Details",
                })
            }
        }
    }

    current = () => { //returns the jsx depending on if a location is found & what card it is beingr ran on
        if(typeof this.props.current === "object") { // if the card is the current forecast
            if(typeof this.props.current.condition === "object") {// if results have be found
                return (
                    <React.Fragment>
                        <div className="forecast">
                            <img src={this.props.current.condition.icon} height="60" width="auto" alt={this.props.current.condition.text} title={this.props.current.condition.text} />
                            <p className="temp">{this.state.current}</p>
                            <button className="temp-buttons cel" style={{color: this.state.cel}} onClick={() => this.props.changeDegrees("cel")}>&#176;C</button>
                            <button className="temp-buttons fah" style={{color: this.state.fah}} onClick={() => this.props.changeDegrees("fah")}>&#176;F</button>
                            <p className="forecast-text">{this.props.data.day.condition.text}</p>
                        </div>
                        <p>Feels like: {this.state.feel}<span>&#176;</span></p>
                    </React.Fragment>
                )
            }
            else { // this runs when the browser is asking for the user's location
                return (
                    <React.Fragment>
                        <div className="forecast">
                            <p className="temp">{this.state.current}</p>
                        </div>
                        <p>Feels like: {this.state.feel}<span>&#176;</span></p>
                    </React.Fragment>
                )
            }
        }
        else { // this runs/loads for the future weather cards and for the current weather card if no location is found
            return (
                <React.Fragment>
                    <div className="forecast">
                        <img src={this.props.data.day.condition.icon} height="60" width="auto" alt={this.props.data.day.condition.text} title={this.props.data.day.condition.text} />
                        <br className="forecast-breaks" />
                        <br className="forecast-breaks" />
                        <p className="forecast-text">{this.props.data.day.condition.text}</p>
                    </div>
                    <p>Average: {this.state.average}<span>&#176;</span></p>
                </React.Fragment>
            )
        }
    }

    date = () => {
        let date = this.props.date.substring(8, this.props.date.length);
        date = Number(date);
        let day = this.props.data.date.substring(8, this.props.data.date.length);
        day = Number(day);
        const tom = date + 1;
        const tri = date + 2;
        if(date === day) {// this returns for the current forecast card
            return "Today";
        }
        else if(tom === day) {// this returns for the following day's forecast card
            return "Tomorrow";
        }
        else if(tri === day) { // this returns for the last day's forecast card
            switch(this.props.day) {
                case "Mon": 
                    return "Wednesday";
                case "Tue":
                    return "Thursday";
                case "Wed":
                    return "Friday";
                case "Thu":
                    return "Saturday";
                case "Fri":
                    return "Sunday";
                case "Sat":
                    return "Monday";
                case "Sun":
                    return "Tuesday";
                default:
                    return this.props.data.date;
            }
        }
        else {// this returns for all cards when the searched for location's date is not the same as the user's date due to time zones - e.g. Australia, New Zealand, etc.
            return this.props.data.date;
        }
    }

    toggleDetails = () => { // this is called when clicking on the 'more details' button to toggle the additional information
        if(this.state.display === "none") {
            this.setState({
                title: "Hide Details",
                display: "block",
            })
        }
        else {
            this.setState({
                title: "More Details",
                display: "none",
            })
        }
    }



    render(){
        const day = this.props.data.day;
        return(
            <div className='weather-card' id={this.props.position}>
                <h3>{this.date()}</h3>
                <div>{this.current()}</div>
                <p>High: {this.state.high}<span>&#176;</span></p>
                <p>Low: {this.state.low}<span>&#176;</span></p>
                <br/>
                <button className="details-button" style={{display: this.state.detailsButtonDisplay}} onClick={this.toggleDetails}>{this.state.title}</button>
                <div className="extra-details" style={{display: this.state.display}}>
                    <p>
                        <i className="fas fa-tint"></i>
                         Humidity: {day.avghumidity}
                        <span style={{fontSize: "10px"}}>%</span>
                    </p>
                    <p>
                        <i className="fas fa-cloud-rain"></i>
                         Chance of rain: {day.daily_chance_of_rain}
                        <span style={{fontSize: "10px"}}>%</span>
                        </p>
                    <p>
                        <i className="fas fa-snowflake"></i>
                         Chance of snow: {day.daily_chance_of_snow}
                        <span style={{fontSize: "10px"}}>%</span>
                    </p>
                    <p>
                        <i className="fas fa-wind"></i>
                         Wind speed: {this.state.wind}
                        <span style={{fontSize: "10px"}}></span>
                    </p>
                    <p>
                        <i className="fas fa-water"></i>
                        Precipitation: {this.state.prec}
                        <span style={{fontSize: "10px"}}></span>
                    </p>
                    <p>
                        <i className="fas fa-sun"></i>
                        UV: {day.uv}
                    </p>
                    <p>
                        <i className="fas fa-coffee"></i>
                        Sunrise: {this.props.data.astro.sunrise}
                    </p>
                    <p>
                        <i className="fas fa-moon"></i>
                        Sunset: {this.props.data.astro.sunset}
                    </p>
                </div>
            </div>
        )
    }
}

WeatherCard.defaultProps = {
    data: {
        date: "",
        day: {
            avghumidity: "",
            avgtemp_c: "",
            avgtemp_f: "",
            maxtemp_c: "",
            maxtemp_f: "",
            mintemp_c: "",
            mintemp_f: "",
            avgvis_miles: "",
            avgvis_km: "",
            condition: {
                icon: "",
                text: "",
            },
            daily_chance_of_rain: "",
            daily_chance_of_snow: "",
            maxwind_mph: "",
            maxwind_kph: "",
            totalprecip_mm: "",
            totalprecip_in: "",
            uv: "",
        },
        astro: {
            sunrise: "",
            sunset: "",
        }
    },
    current: "",
}

export default WeatherCard;