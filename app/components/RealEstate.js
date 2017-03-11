import React, {Component} from "react";
import Redfin from "../api/get_redfin";
import Zillow from "../api/get_zillow";

export default class RealEstate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redfin_value: '',
      zillow_value: ''
    }
  }

  componentWillMount() {
    Redfin.getEstimate('https://www.redfin.com/VA/Reston/2240-Sanibel-Dr-20191/home/9232493')
        .then(res => this.setState({redfin_value: res}));

    Zillow.getProperty('2240 Sanibel Dr', '20191')
        .then(propertyObj => {
          const zpid = propertyObj.zpid[0];
          Zillow.getZestimate(zpid).then(zestimateObj => {
            this.setState({
              zillow_value: zestimateObj.zestimate[0].amount[0]._
            });
          })
        })
  }


  render() {
    return (
        <div>
          <div className="col-xs-6 text-center">
            <h1>{this.state.redfin_value}</h1>
            <h3>Redfin Estimate</h3>
          </div>

          <div className="col-xs-6 text-center">
            <h1>{this.state.zillow_value}</h1>
            <h3>Zillow Estimate</h3>
          </div>

        </div>
    )
  }

}