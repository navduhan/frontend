import React, { Component } from 'react';
import './Help.scss'; // Import the SCSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import home from './figures/home.png';
import pred1 from './figures/pred1.png';
import pred2 from './figures/pred2.png';
import pred3 from './figures/pred3.png';
import res1 from './figures/res1.png';
import res2 from './figures/res2.png';
import res3 from './figures/res3.png';
import res4 from './figures/res4.png';
import s1 from './figures/sstruct.png';
import s2 from './figures/tstruct.png'
export default class Help extends Component {
    render() {
        return (
            <div className="container my-5">
                {/* Top Buttons (previously sidebar) */}
                <div className="d-flex flex-wrap justify-content-center mb-4">
                    <a href="#intro_loading" className="btn  btn-primary mx-2 my-1">Introduction</a>
                    <a href="#data_loading" className="btn  btn-danger mx-2 my-1">Data Input</a>
                    <a href="#Phase_options" className="btn  btn-info mx-2 my-1">Prediction Phases</a>
                    <a href="#result_options" className="btn  btn-secondary mx-2 my-1">Output Example</a>
                    <a href="#browser_compatibility" className="btn  btn-warning mx-2 my-1">Browser Compatibility</a>
                </div>

                {/* Content Area */}
                <div className="content" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    <div className="card m-b-20 card-body" style={{ textAlign: 'justify' }}>
                        {/* Introduction Section */}
                        <div id="intro_loading" style={{ marginBottom: '10px' }}></div>
                        <h4><b className="text-muted2">Introduction</b></h4>
                        <p>Help section page of MINpred, here you will find a step by step guide to submit and display the result of an analysis, as well as the different options regarding prediction on MINpred and what each parameter means. If you have any questions that are not covered in this page please send an email to <a href="mailto:naveen.duhan@outlook.com">naveen.duhan@outlook.com</a> or <a href="mailto:rkaundal@usu.edu">rkaundal@usu.edu</a>. For this tutorial we will use the Demo data, so if you want to replicate the results obtained in this tutorial just click in the load Demo FASTA link.

                        </p>
                        <p>This website is free and open to all users and there is no login requirement.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={home} height={700} alt="Data Input" />
                        </div>

                        {/* Data Input Section */}
                        <div id="data_loading" style={{ marginBottom: '20px' }}></div>
                        <h4><b className="text-muted2">Data Input</b></h4>
                        <p>MINpred supports FASTA format. You can either upload a file or paste your sequences in the text area below or provide NCBI/UniProt accession in the text box below. You can upload amino acid sequences after selecting appropriate query sequence type below.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={pred1} width="700px" alt="Data Input" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={pred2} width="700px" alt="Data Input" />
                        </div>


                        {/* Prediction Phases */}
                        <div id="Phase_options" className="card" style={{ marginTop: '30px' }}></div>
                        <h4><b className="text-muted2">Prediction Phases</b></h4>
                        <p>MINpred runs three phases for mineralization-related enzyme prediction. Users can select any phase for prediction and theire preceeding phases will be automatically selected. Phase IV will run by default. There is an icon with general information about the tool and a brief explanation on how it works.</p>
                        <p>Phase I: This is first phase where a query sequence is being predicted as enzyme or non-enzyme</p>
                        <p>Phase II: This phase will run Phase1 first followed by Phase2 where a query sequence is first predicted as enzyme or non-enzyme followed by prediction of enzyme as nitrogen mineralization or non-nitrogen mineralization.</p>
                        <p>Phase III: This phase will execute Phase1 and Phase2 followed by classifying nitrogen mineralization-related enzymes in 10 classes.</p>
                        <p>Phase IV: This phase will execute Phase1, Phase2 and Phase3 followed by classifying EC number of class predicted in Phase3.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={pred3} style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>

                        {/* Output Example */}
                        <div id="result_options" className="card" style={{ marginTop: '30px' }}></div>
                        <h4><b className="text-muted2">Output Example</b></h4>
                        <p>The result table will change depending of the prediction phase and strategy used. On the top, you will have download results button, which download the comprehensive table result in tab-delimited format.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px', padding: '20px' }}>
                        <img src={res1}  style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={res2} style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={res3} style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={res4} style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={s1}  style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <img src={s2} style={{ maxWidth: '100%', maxHeight: '600px', height: 'auto', width: 'auto'  }}alt="Data Input" />
                        </div>

                        <div id="browser_compatibility" class="card" style={{ marginTop: '30px' }}></div>
                        <h4><b class="text-muted2">Browser Compatibility</b></h4>
                        <p>MINpred have been tested in the following setups.</p>

                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>OS</th>
                                    <th>Version</th>
                                    <th>Chrome</th>
                                    <th>Firefox</th>
                                    <th>Safari</th>
                                    <th>Edge</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Linux</td>
                                    <td>Ubuntu 22.04</td>
                                    <td>108.0.5359.71</td>
                                    <td>112.0.2</td>
                                    <td>n/a</td>
                                    <td>113.0.1774.35</td>
                                </tr>
                                <tr>
                                    <td>MacOS</td>
                                    <td>Ventura 13.3.1 (a)</td>
                                    <td>108.0.5359.71</td>
                                    <td>112.0.2</td>
                                    <td>16.4</td>
                                    <td>113.0.1774.35</td>
                                </tr>
                                <tr>
                                    <td>Windows</td>
                                    <td>10</td>
                                    <td>108.0.5359.71</td>
                                    <td>112.0.2</td>
                                    <td>not tested</td>
                                    <td>113.0.1774.35</td>
                                </tr>
                                </tbody>
                        </table>
                    </div>
                       
                    </div>
                </div>

         
        );
    }
}
