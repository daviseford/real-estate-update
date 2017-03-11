import React, {Component} from "react";
import Redfin from "../api/get_redfin";
import Zillow from "../api/get_zillow";

export default class RealEstate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base_value: 395000,
      redfin_value: 0,
      zillow_value: 0
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
              zillow_value: parseInt(zestimateObj.zestimate[0].amount[0]._)
            });
          })
        })
  }


  render() {
    return (
        <div>

          <div className="row">
            <div className="col-md-12 text-center">
              <h1>2240 Sanibel Dr.</h1>
            </div>
            <div className="col-xs-12 text-center">
              <h1>{this.state.base_value.toLocaleString()}</h1>
              <h3>Base Value</h3>
            </div>
          </div>

          <div className="row">
            <Estimate dollars={this.state.zillow_value} txt={'Zillow Estimate'} base_value={this.state.base_value}/>
            <Estimate dollars={this.state.redfin_value} txt={'Redfin Estimate'} base_value={this.state.base_value}/>
          </div>

        </div>
    )
  }

}

class Estimate extends Component {
  static propTypes = {
    dollars: React.PropTypes.number.isRequired,
    txt: React.PropTypes.string.isRequired,
    base_value: React.PropTypes.number
  };

  render() {
    return (
        <div className="col-xs-6 text-center">
          <h1>{this.props.dollars.toLocaleString()}</h1>
          <h3>{this.props.txt}</h3>
          {
            this.props.dollars > 0
                ? <DifferenceIndicator base_value={this.props.base_value} curr_value={this.props.dollars}/>
                : null
          }
        </div>
    )
  }
}

class DifferenceIndicator extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    base_value: React.PropTypes.number.isRequired,
    curr_value: React.PropTypes.number.isRequired,
  };

  render() {
    const val = this.props.curr_value - this.props.base_value;
    const style = val > 0 ? 'text-success' : 'text-warning';
    const prefix = val > 0 ? '+' : '-';
    return (
        <span className={style}>{prefix}{val.toLocaleString()}</span>
    )
  }
}