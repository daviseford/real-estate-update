import React, {Component} from "react";
import storage from "electron-json-storage";
import Redfin from "../api/get_redfin";
import Zillow from "../api/get_zillow";

export default class RealEstate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      last_sold_value: 0,
      last_sold_date: '',
      redfin_url: '', // TODO fetch this intelligently
      redfin_value: 0,
      zillow_value: 0,
      zip: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updateZipcode = this.updateZipcode.bind(this);
  }

  componentWillMount() {
    // TODO Get from storage
    storage.get('realestate', (err, data) => {
      if (err) return;
      this.setState({address: data.address, zip: data.zip});
      this.updateEstimates();
    });

  }

  componentDidMount() {
    // this.updateEstimates();
  }

  updateEstimates() {

    // TODO get rid of hardcoding
    Redfin.getEstimate('https://www.redfin.com/VA/Reston/2240-Sanibel-Dr-20191/home/9232493')
        .then(res => {
          this.setState({redfin_value: res});
        });

    Zillow.getProperty(this.state.address, this.state.zip)
        .then(propertyObj => {
          const zpid = propertyObj.zpid[0];
          const lastSoldPrice = parseInt(propertyObj.lastSoldPrice[0]._);
          const lastSoldDate = propertyObj.lastSoldDate[0];
          this.setState({last_sold_value: lastSoldPrice, last_sold_date: lastSoldDate});

          Zillow.getZestimate(zpid).then(zestimateObj => {
            const zestimate = parseInt(zestimateObj.zestimate[0].amount[0]._);
            this.setState({zillow_value: zestimate});
          })
        }).catch((err) => console.log(err))
  }

  /**
   * Update storage with address and zip, and start the estimate updates
   * @param e
   */
  handleSubmit(e) {
    e.preventDefault();
    storage.set('realestate', {address: this.state.address, zip: this.state.zip}, (err) => {
      if (err) console.log(err);
      this.updateEstimates();
    });
  }

  updateAddress(e) {
    this.setState({address: e.target.value.trim() || ''});
  }

  updateZipcode(e) {
    this.setState({zip: e.target.value.trim() || ''});
  }

  render() {
    return (
        <div>

          <div className="row">
            <div className="col-md-12 text-center">
              <h1>{this.state.address}</h1>
              <h3>{this.state.zip}</h3>
            </div>
            <div className="col-xs-12 text-center">
              <h1>{this.state.last_sold_value.toLocaleString()}</h1>
              <h3>Last Sold - {this.state.last_sold_date}</h3>
            </div>
          </div>

          <div className="row text-center">
            <AddressForm
                handleSubmit={this.handleSubmit}
                updateAddress={this.updateAddress}
                updateZipcode={this.updateZipcode}
            />
          </div>

          <div className="row">
            <Estimate dollars={this.state.zillow_value} txt={'Zillow Estimate'}
                      base_value={this.state.last_sold_value}/>
            <Estimate dollars={this.state.redfin_value} txt={'Redfin Estimate'}
                      base_value={this.state.last_sold_value}/>
          </div>

          <div className="row text-center">
            <button className="btn btn-default btn-md">
              <span className="glyphicon glyphicon-refresh" onClick={() => this.updateEstimates()}> </span>
            </button>
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

class AddressForm extends Component {
  static propTypes = {
    updateAddress: React.PropTypes.func.isRequired,
    updateZipcode: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
  };


  render() {
    return (
        <form className="form-horizontal" onSubmit={this.props.handleSubmit}>

          <div className="form-group">
            <div className="col-xs-2">
            </div>
            <div className="col-xs-4">
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
                <button className="btn btn-md btn-default" type="submit">
                  <span className="glyphicon glyphicon-search"> </span>
                </button>
              </div>
            </div>
          </div>


        </form>
    )
  }
}