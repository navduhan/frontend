import React from "react";
import "./Prediction.scss"
import { Divider, Radio, Button, Checkbox } from 'antd';
import { Form, Row, Col } from "react-bootstrap";
import FileInput from "../../Components/FileInput/FileInput";
import '../../scss/components/buttons.scss';
import '../../scss/components/forms.scss';
import '../../scss/style.scss'
import test from './test.gif'
import { fetchResults } from "./fetchResults"
import { demoSequences } from "./geneSamples";


export default class Prediction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            seqtype: 'fasta',
            accession: '',
            acctype: 'ncbi',
            selectedPhases: ['Phase1', 'Phase2', 'Phase3', 'Phase4'],
            lastClickedPhase: 'Phase4',
            p4value: 'Amidohydrolases',
            seqtxt: '',
            filetxt: ''

        };

        this.SeqMethodradioHandler = this.SeqMethodradioHandler.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.handleSeqChange = this.handleSeqChange.bind(this);
        this.setGeneHint = this.setGeneHint.bind(this);
        this.AccessionHandler = this.AccessionHandler.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handlep4Change = this.handlep4Change.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.openModel = this.openModel.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.runPrediction = this.runPrediction.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }



    openModel = () => this.setState({ isOpen: true });
    closeModel = () => this.setState({ isOpen: false });

    setGeneHint(hint) {
        this.setState({ geneHintOn: hint });
    }

    fileSelected(fileText) {
        this.setState({
            filetxt: fileText,
        });
    }

    handleSeqChange(e) {
        this.setState({
            seqtxt: e.target.value
        });
    }

    SeqMethodradioHandler(e) {
        this.setState({
            seqtype: e.target.value,
        });
    }

    AccessionHandler(e) {

        this.setState({
            acctype: e.target.value,
        });
    }

    handleSearch(e) {
        this.setState({
            accession: e.target.value,
        })
    }

    handlep4Change = (e) => {
        this.setState({ p4value: e.target.value});

        if (this.state.seqtxt !== ''){
            this.setState({seqtxt:demoSequences[e.target.value]})
        }

    };



    handleCheckboxChange = (phaseValue, e) => {
        const { checked } = e.target; // Access checked directly from e.target
        const phaseValues = ['Phase1', 'Phase2', 'Phase3', 'Phase4'];
        const phaseIndex = phaseValues.indexOf(phaseValue);

        let newSelectedPhases;

        if (checked) {
            // If the phase is checked, ensure all phases up to and including this phase are checked
            newSelectedPhases = phaseValues.filter((_, index) => index <= phaseIndex);
        } else {
            // If the phase is unchecked, ensure only phases after it are unchecked
            newSelectedPhases = phaseValues.filter((_, index) => index < phaseIndex + 1);
        }

        this.setState({
            selectedPhases: newSelectedPhases,
            lastClickedPhase: phaseValue, // Update the last clicked phase
        });
    };


    runPrediction() {

        // Check if multiple inputs (seqtxt, accession, and file) are provided
        if (this.state.seqtxt.trim() && this.state.accession.trim() && this.state.filetxt.trim()) {
            alert("Please provide either a FASTA sequence, an accession, or upload a file, not all.");
            return; // Stop the function execution if all are provided
        }

          // Check if the required input for the selected seqtype is provided
          if (this.state.seqtype === 'fasta' && this.state.seqtxt.trim() && this.state.filetxt.trim()) {
            alert("Please upload a file or paste a FASTA sequence.");
            return; // Stop the function if neither a file nor a FASTA sequence is provided
        }

        // Check if the required input for the selected seqtype is provided
        if (this.state.seqtype === 'fasta' && !this.state.seqtxt.trim() && !this.state.filetxt.trim()) {
            alert("Please upload a file or paste a FASTA sequence.");
            return; // Stop the function if neither a file nor a FASTA sequence is provided
        } else if (this.state.seqtype === 'accession' && !this.state.accession.trim()) {
            alert("Please provide an accession.");
            return; // Stop the function if no accession is provided
        }

        this.openModel();
        let data = new FormData();

        if (this.state.seqtype === 'accession') {
            data.append('phase', this.state.lastClickedPhase)
            data.append('accession', this.state.accession)
            data.append('acctype', this.state.acctype)
            data.append('ecnumber', this.state.p4value.toLowerCase())
        }
        else {

            data.append('phase', this.state.lastClickedPhase)
            if (this.state.seqtxt.trim()) {
                data.append('seqtxt', this.state.seqtxt)
            }
            else if (this.state.filetxt.trim()) {
                data.append('seqtxt', this.state.filetxt)
            }

            data.append('ecnumber', this.state.p4value.toLowerCase())
        }



        fetchResults(data)
            .then(res => {
                console.log(res['namer'])
                this.closeModel();

                window.location.assign(`/minpred/results?namer=${res['namer']}&phase=${this.state.lastClickedPhase}&ecnumber=${this.state.p4value.toLowerCase()}`);
            })
    }

    render() {
        // console.log(this.state.lastClickedPhase)
        // console.log(this.state.selectedPhases)
        console.log(this.state.p4value)
        const phases = [
            { label: 'Phase 1 - Enzyme vs Non-enzyme', value: 'Phase1' },
            { label: 'Phase 2 - Mineralization vs Non-mineralization', value: 'Phase2' },
            { label: 'Phase 3 - Mineralization Classification', value: 'Phase3' },
            { label: 'Phase 4 - EC Number Classification', value: 'Phase4' },
        ];

        const options = [
            "Amidohydrolases",
            "Aminopeptidases",
            "Aspartic endopeptidases",
            "Cysteine endopeptidases",
            "Dipeptidases",
            "Dipeptidyl peptidases",
            "Metalloendopeptidases",
            "Metallopeptidases",
            "Omega peptidases",
            "Serine endopeptidases"
        ];

        let genePlaceholder
        let geneSample = demoSequences[this.state.p4value]
        return (
            <div className="container main">
                <Divider />
                <h3>MINpred Prediction</h3>
                <Divider />
                <div className="row justify-content-center">
                    <Radio.Group name="radiogroup" defaultValue={"fasta"}>
                        <h5>Select Input Type</h5>
                        <Radio value="fasta" onClick={this.SeqMethodradioHandler}>
                            Fasta Sequence
                        </Radio>
                        <Radio value="accession" onClick={this.SeqMethodradioHandler}>
                            Accession ID
                        </Radio>

                    </Radio.Group>
                </div>

                <Divider />
                {this.state.seqtype === 'fasta' && (
                    <>
                        <div className="row flex-lg-row justify-content-center">

                            <div className="col-md-5">
                                <h5>Enter protein FASTA sequence here</h5>
                                <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handleSeqChange}
                                    value={this.state.seqtxt} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />
                                <Button className="kbl-btn-1 mx-3" onClick={e => {
                                    this.setState({ seqtxt: geneSample });
                                }}>Sample Data</Button>
                                <Button className="kbl-btn-3" onClick={e => {
                                    this.setState({ seqtxt: "" })
                                }}>Clear Data</Button>
                            </div>
                            <div className="col-md-1 mt-5"><b>OR</b></div>
                            <div className="col-md-3 mb-5">
                                <h5 className="mt-5 pl-2"> Upload Protein FASTA file</h5>

                                <FileInput handler={this.fileSelected} />
                            </div>
                            <Divider />
                        </div>
                    </>
                )}
                {this.state.seqtype === 'accession' && (
                    <>
                        <div className="row flex-lg-row justify-content-center">
                            <div className="col-md-6 mb-4">
                                <Radio.Group name="radiogroup" defaultValue={"ncbi"}>
                                    <h5>Select Accession Type</h5>
                                    <Radio value="ncbi" onClick={this.AccessionHandler}>
                                        NCBI
                                    </Radio>
                                    <Radio value="uniprot" onClick={this.AccessionHandler}>
                                        Uniprot
                                    </Radio>
                                </Radio.Group>
                            </div>
                            <div className="col-md-6 mb-4">
                                <h5>Enter Accession Here:</h5>
                                <input type="text" value={this.state.accession} placeholder="P00734" className="form-control kbl-form" onChange={this.handleSearch}></input>
                            </div>



                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-2">
                                <Button className="kbl-btn-3" onClick={e => {
                                    this.setState({ genes: "" })
                                }}>Clear Accession</Button>
                            </div>

                        </div>
                        <Divider />
                    </>

                )

                }
                <div className="row flex-lg-row justify-content-center">
                    <h5>Select a Phase To Run</h5>
                    <Row gutter={16}>
                        {phases.map((phase) => (
                            <Col span={24} key={phase.value}>
                                <Checkbox
                                    checked={this.state.selectedPhases.includes(phase.value)}
                                    onChange={(e) => this.handleCheckboxChange(phase.value, e)}
                                >
                                    {phase.label}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>

                </div>
                <Divider />

                {this.state.lastClickedPhase === 'Phase4' && (
                    <div className="row flex-lg-row justify-content-center">
                        <div className="col-md-6">
                            <h5>Select a Category to Predict EC number in Phase4</h5>
                            <select
                                className="form-control kbl-form"
                                value={this.state.p4value}
                                onChange={this.handlep4Change}
                            >
                                <option value="" disabled></option>
                                {options.map((option) => {
                                    const value = option.split(' ')[0]; // Get the first word before the space
                                    return (
                                        <option key={value} value={value}>
                                            {option}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                )}
                <Divider />

                <div className="row flex-lg-row justify-content-center g-2 my-5">
                    {this.state.isOpen && (
                        <div className="col-md-8">
                            <h5 className="mb-3">Please wait your query is processing</h5>
                            <img
                                src={test}
                                className="loading"
                                height="50px"
                                alt=""
                            ></img>
                        </div>
                    )}
                    {this.state.isOpen === false && (
                        <div className="col-md-2">
                            <Button
                                className="kbl-btn-1  mx-3"
                                size="lg"
                                onClick={this.runPrediction}
                            >Run Analysis{" "}
                            </Button>
                        </div>
                    )}
                </div>
                <Divider />
            </div>

        )
    }
}