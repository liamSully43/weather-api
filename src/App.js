import React from 'react';
import './App.css';

import WeatherCard from "./Components/Weather-Card";
import Header from "./Components/Header";

class App extends React.Component {
  state = {
    data: [], //forecast data for next three days - saved as an array of objects and then the objects are passed down using props
    current: {}, //forecast for today
    pos: "", //position gathered from browser to manually inputted
    date: "",
    day: "",
    country: "",
    location: "",
    region: "",
    time: "",
    updated: Date(),
    degree: "cel",
    noLocation: null, //error message if no location in found
    geoAllowed: null, // does the user allow the app it's access
  }

  timer = {
    timer: null,
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.success, this.error, this.options); //get user's location
    this.time(); //start timer
    this.timer.timer = setInterval(() => { //loop timer
      this.time();
      this.success(this.state.pos);
    }, 900000); //15 minutes
  }

  componentWillUnmount() {
    clearInterval(this.timer.timer);
  }

  time = () => {
    let x = Date();
    const time = x.substring(16, x.length -34);
    this.setState({
      updated: time,
    })
  }

  changeDegrees = degree => { //swap between cel & fah - called from child component "changeDegrees"
    this.setState({
      degree: degree,
    })
  }

  success = pos => { //called when the location is valid
    let day = Date();
    day = day.substr(0, day.length - 52); //sun, mon, tue, wed, etc.
    this.setState({
      pos: pos,
      day: day,
      geoAllowed: true,
    },
    () => {
      let url = null;
      if(typeof this.state.pos === "object") { // if the location is provided by the browser using coordinates
        url = `https://api.weatherapi.com/v1/forecast.json?key=64e20cef002e4aed9f6164849200505&q=${this.state.pos.coords.latitude},${this.state.pos.coords.longitude}&days=10`;
      }
      if(typeof this.state.pos === "string") { // if the location is provided by the user using the input field
        url = `https://api.weatherapi.com/v1/forecast.json?key=64e20cef002e4aed9f6164849200505&q=${this.state.pos}&days=10`;
      }
      if(typeof url !== "undefined") { // stops the app from gathering data if the location is invalid
        fetch(url , {
          method: "GET",
        })
        .then(res => res.json())
        .then(
          data => {
            if(typeof data.location === "object") {
              this.setState({
                data: data.forecast.forecastday, //forecast for next three days
                current: data.current, //today's forecast
              });
              let x = data.location.localtime;
              const date = x.substring(0, x.length -6); //today's date
              const time = x.substring(11, x.length); // last time the API updated the data
              this.setState({
                date: date,
                country: data.location.country,
                location: data.location.name,
                region: data.location.region,
                time: time,
                noLocation: null,
              });
            }
            else {
              console.log(`Error ${data.error.code}: ${data.error.message}`); // invalid location searched
              this.setState({
                noLocation: data.error.message,
                data: "",
                current: "",
                geoAllowed: false,
              })
            }
          }
        )
        .catch = err => {
          console.log(err);
        }
      }
    });
    this.time(); // record when the last API call was made
  }
  
  error = err => { //called when there is an error with the getting the loctaion
    this.setState({geoAllowed: false})
    console.log(err.message);
  }

  render() {
    return (
      <div className="app">
          <Header
            country={this.state.country}
            location={this.state.location}
            region={this.state.region}
            time={this.state.time}
            updated={this.state.updated}
            noLocation={this.state.noLocation}
            geoAllowed={this.state.geoAllowed}
            submit={this.success}
          />
          <div className="container-breaks"></div>
          <WeatherCard
            position="current"
            current={this.state.current}
            data={this.state.data[0]}
            date={this.state.date}
            day={this.state.day}
            degree={this.state.degree}
            changeDegrees={this.changeDegrees}
            geoAllowed={this.state.geoAllowed}
          />
          <div className="section-break"></div>
          <WeatherCard
            position="tomorrow"
            data={this.state.data[1]}
            date={this.state.date}
            day={this.state.day}
            degree={this.state.degree}
            changeDegrees={this.changeDegrees}
            geoAllowed={this.state.geoAllowed}
          />
          <div className="container-breaks"></div>
          <WeatherCard
            position="future"
            data={this.state.data[2]}
            date={this.state.date}
            day={this.state.day}
            degree={this.state.degree}
            changeDegrees={this.changeDegrees}
            geoAllowed={this.state.geoAllowed}
          />
      </div>
    );
  }
}

export default App;
