import React, { Component } from "react";
import {Container} from 'react-bootstrap';
import {MNavbar} from './Components/Navbar/MNavbar'
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Prediction from "./Pages/Prediction/Prediction";
import Results from "./Pages/Results/Results";
import Structure from "./Pages/Structure/structure";
import SStructure from "./Pages/Structure/sec-struct";
import Help from "./Pages/Help/Help";
import DownloadMINpred from "./Pages/Download/Download";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';
import { env } from "./env";



export class MINPRED extends Component {
    constructor(props){
        super(props);
        this.state = {
            baseUrlLen: env.BASE_URL.split("/").length
        }
    }
    render(){
        return(
            <Router>
                <Container fluid className='App px-4'>
                <MNavbar active={document.location.pathname.split('/')[this.state.baseUrlLen]}/>
                <Routes>
			   <Route path={`${env.BASE_URL}/`} element={<Home />} />
               <Route path={`${env.BASE_URL}/prediction`} element={<Prediction />} />
               <Route path={`${env.BASE_URL}/results`} element={<Results />} />
               <Route path={`${env.BASE_URL}/structure`} element={<Structure />} />
               <Route path={`${env.BASE_URL}/sstruct`} element={<SStructure />} />
               <Route path={`${env.BASE_URL}/help`} element={<Help />} />
               <Route path={`${env.BASE_URL}/download`} element={<DownloadMINpred />} />
               </Routes>
               <Footer />
                </Container>
            </Router>
        )
    }
}