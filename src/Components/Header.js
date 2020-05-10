import React from 'react';

class Header extends React.Component {

    state = {
        value: "", // user's input
        location: "", // placeholder for the input
    }

    componentDidMount() {
        // picks a random location for the input placeholder every 30 seconds
        const locations = ["Bristol", "London", "Manchester", "Glasgow", "Cardiff", "Dublin", "Paris", "Berlin", "Rome", "Stockholm", "Sydney", "Chicago", "Los Angeles", "Madrid", "Berlin"];
        setInterval(() => {
            this.setState({
                location: `e.g. ${locations[Math.floor(Math.random() * locations.length)]}`,
            })
        }, 30000);
        this.setState({
            location: `e.g. ${locations[Math.floor(Math.random() * locations.length)]}`,
        })
    }

    resultsStyle = () => { // this is called by the results div
        if((this.props.geoAllowed && this.props.noLocation === null) || (this.props.geoAllowed && this.props.noLocation === false)) {
            return {display: 'inline-block'} // this will return if a valid location was entered or the user allowed their location
        }
        else {
            return {display: 'none'} // vice versa
        }
    }

    locationStyle = () => { // this is called by the invalid location div
        this.resultsStyle();
        if(this.props.noLocation === null){
            return {display: 'none'} // this hides the div if a valid location is found
        }
        else {
            return {display: 'block'} // vice versa
        }
    }

    handleChange = event => {
        this.setState({
            value: event.target.value, // updates the saved value when the user types in the input
        })
    }

    onSubmit = event => {
        event.preventDefault();
        this.props.submit(this.state.value); // sends the searched value to the app component for the API request
    }

    render() {
        return(
            <header>
                <div className="results" style={this.resultsStyle()}>
                    <h4>Country: <span className="title-results">{this.props.country}</span></h4>
                    <h4>Location: <span className="title-results">{this.props.location}</span></h4>
                    <h4>Region: <span className="title-results">{this.props.region}</span></h4>
                    <h4>Local Time: <span className="title-results">{this.props.time}</span></h4>
                    <h4>Last Updated: <span className="title-results">{this.props.updated} <span style={{fontSize: "14px"}}>(updated every 15 minutes)</span></span></h4>
                    <br/>
                </div>
                <div className="location" style={this.locationStyle()}>
                    <p className="noLocation">{this.props.noLocation}</p>
                    <br/>
                </div>
                <form onSubmit={this.onSubmit}>
                    <p>Enter a location below to update the results:</p>
                    <input type="text" placeholder={this.state.location} onChange={this.handleChange} value={this.state.value} />
                </form>
            </header>
        )
    }
}

export default Header;