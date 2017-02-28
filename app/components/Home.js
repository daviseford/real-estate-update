// @flow
import React, {Component} from "react";
// import {Link} from "react-router";
import styles from "./Home.css";
import ZillowTab from "./ZillowTab";


export default class Home extends Component {
  render() {

    return (
        <div>
          <div className={styles.container} data-tid="container">
            <ZillowTab/>
          </div>
        </div>
    );
  }
}
