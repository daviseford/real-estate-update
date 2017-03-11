// @flow
import React, {Component} from "react";
// import {Link} from "react-router";
import styles from "./Home.css";
import RealEstate from "./RealEstate";

export default class Home extends Component {
  render() {
    return (
        <div className={styles.container}>
          <RealEstate />
        </div>
    );
  }
}
