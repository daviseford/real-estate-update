//@flow
import React, {Component} from "react";
import Zillow from "./../api/get_zillow";

export default class ZillowTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      zipcode: '',
      propertyObj: {},
      zestimateObj: {},
      zestimate: ''
    };

    this.updateAddress = this.updateAddress.bind(this);
    this.updateZipcode = this.updateZipcode.bind(this);
    this.fetchProperty = this.fetchProperty.bind(this);
  }

  updateAddress(e) {
    this.setState({address: e.target.value.trim() || ''});
  }

  updateZipcode(e) {
    this.setState({zipcode: e.target.value.trim() || ''});
  }

  fetchProperty(e) {
    e.preventDefault();
    Zillow.getProperty(this.state.address, this.state.zipcode)
        .then(propertyObj => {
          const zpid = propertyObj.zpid[0];
          Zillow.getZestimate(zpid).then(zestimateObj => {
            this.setState({
              propertyObj: propertyObj,
              zestimateObj: zestimateObj,
              zestimate: zestimateObj.zestimate[0].amount[0]._
            });
          })
        })
  }

  componentWillMount() {
    // Eventually check if there's a pre-existing address and fnd it here
  }

  render() {
    return (
        <div>
          <div>
            <AddressForm updateAddress={this.updateAddress}
                         updateZipcode={this.updateZipcode}
                         fetchProperty={this.fetchProperty}/>

            <span>{this.state.zestimate || ''}</span>
          </div>
        </div>
    )
  }
}

class AddressForm extends Component {
  static propTypes = {
    fetchProperty: React.PropTypes.func.isRequired,
    updateAddress: React.PropTypes.func.isRequired,
    updateZipcode: React.PropTypes.func.isRequired,
  };


  render() {
    return (
        <form className="form-horizontal" onSubmit={this.props.fetchProperty}>

          <div className="form-group">
            <div className="col-xs-6">
              <div className="input-group">
                <span className="input-group-addon">Address</span>
                <input id="address" name="address" className="form-control"
                       placeholder="Your address" type="text"
                       onChange={this.props.updateAddress}/>
              </div>
            </div>
            <div className="col-xs-3">
              <div className="input-group">
                <span className="input-group-addon">ZIP</span>
                <input id="address" name="address" className="form-control"
                       placeholder="XXXXX" type="text"
                       onChange={this.props.updateZipcode}/>
              </div>
            </div>

            <div className="col-xs-2">
              <div className="input-group">
                <button className="btn btn-md btn-default" type="submit">Go</button>
              </div>
            </div>
          </div>


        </form>
    )
  }
}