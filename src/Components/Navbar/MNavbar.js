import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { env } from "../../env";
import './MNavbar.scss';
import '../../scss/style.scss';
import lablogo from './lab_logo_red.png';
import usulogo from './usulogo2.png';
import dblogo from './minpred.png';

class MNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active
    };
    this.activeLink = this.activeLink.bind(this);
  }

  activeLink(link) {
    
    
    if (link === this.props.active) {
      return true;
    }

    return false;
  }

    render() {
        let className = 'mx-1'
        let active = 'mx-1 current'
        console.log(env.BASE_URL)
return(
  <div className="container contain">
  <div className="row flex-lg-row align-items-center g-2 mt-2">

    <div className="col-md-2 imglab">
      <img className="imglab" src={lablogo} height={50} alt=''></img>
    </div>
    <div className="col-md-2">
    <img src={dblogo} height={60} alt=''></img>

    </div>
    <div className=" col-md-6 mt-2 nav-wrapper mx-auto">
        <Navbar className="justify-content-center">
          
          <Nav className="">
            <Nav.Link href= {`${env.BASE_URL}/`} className={'/' === this.props.active ? active : className}>
              About
            </Nav.Link>
            <Nav.Link href={`${env.BASE_URL}/prediction`} className={'prediction' === this.props.active ? active : className}>
              Prediction
            </Nav.Link>
            <Nav.Link href={`${env.BASE_URL}/download`} className={'download' === this.props.active ? active : className}>
              Download
            </Nav.Link>
            <Nav.Link href={`${env.BASE_URL}/help`} className={'help' === this.props.active ? active : className}>
              Help
            </Nav.Link>
          </Nav>

        </Navbar>
      </div>
      <div className="col-md-2">
      <img src={usulogo} height={50} alt=''></img>
    </div>
    </div>
    
      </div>

)

    }
}
export {MNavbar};