import React from 'react';
import axios from 'axios';
import "./Results.scss";
import { env } from '../../env';
import PhaseTable from './rtable';
import { Divider } from 'antd';
import { Button } from 'react-bootstrap'; 
import { fetchResults } from "./nextFetchResults";
import test from './test.gif';
import * as XLSX from 'xlsx';  // Import xlsx for Excel functionality

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search);
        const initialPhase = searchParams.get('phase');

        this.state = {
            namer: searchParams.get('namer'),
            phase: initialPhase,
            ecnumber: searchParams.get('ecnumber'),
            results: null, 
            selectedPhase: initialPhase,
            isOpen: false
        };

        this.handlePhaseChange = this.handlePhaseChange.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
        this.downloadJSON = this.downloadJSON.bind(this);
        this.downloadExcel = this.downloadExcel.bind(this);
        this.predictNextPhase = this.predictNextPhase.bind(this);
    }

    componentDidMount() {
        this.getResults();
    }

    openModel = () => this.setState({ isOpen: true });
    closeModel = () => this.setState({ isOpen: false });

    async getResults() {
        try {
            const response = await axios.get(
                `${env.BACKEND}/api/results`,
                {
                    params: {
                        namer: this.state.namer,
                        phase: this.state.phase,
                        ecnumber: this.state.ecnumber
                    }
                }
            );
            
            this.setState({ results: response.data });
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    }

    handlePhaseChange(phase) {
        this.setState({ selectedPhase: phase });
    }

    // CSV Download Function
    downloadCSV() {
        const { selectedPhase, results } = this.state;
        const phaseData = results[selectedPhase];
    
        if (!phaseData || phaseData.length === 0) return;
    
        const headers = Object.keys(phaseData[0]).filter(header => header !== "pred");
        const csvRows = [];
    
        // Add headers
        csvRows.push(headers.join(','));
    
        // Add data rows
        for (const row of phaseData) {
            const values = headers.map(header => row[header]);
            csvRows.push(values.join(','));
        }
    
        // Create CSV string
        const csvString = csvRows.join('\n');
    
        // Trigger file download
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedPhase}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // JSON Download Function
    downloadJSON() {
        const { selectedPhase, results } = this.state;
        const phaseData = results[selectedPhase];

        if (!phaseData) return;

        const jsonString = JSON.stringify(phaseData, null, 2);  // Pretty-print JSON

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedPhase}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Excel Download Function
    downloadExcel() {
        const { selectedPhase, results } = this.state;
        const phaseData = results[selectedPhase];

        if (!phaseData) return;

        const worksheet = XLSX.utils.json_to_sheet(phaseData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, selectedPhase);

        // Create Excel file and trigger download
        XLSX.writeFile(workbook, `${selectedPhase}.xlsx`);
    }

    predictNextPhase() {
        this.openModel();
        const currentPhaseNumber = parseInt(this.state.phase.replace('Phase', ''));
        const nextPhaseNumber = currentPhaseNumber + 1;
        const nextPhase = `Phase${nextPhaseNumber}`;

        let data = new FormData();
        data.append('phase', nextPhase);
        data.append('namer', this.state.namer);
        data.append('ecnumber', this.state.ecnumber.toLowerCase());
        
        fetchResults(data)
        .then(res => {
            this.closeModel();
            window.location.assign(`/minpred/results?namer=${res['namer']}&phase=${nextPhase}&ecnumber=${this.state.ecnumber.toLowerCase()}`);
        });
    }

    render() {
        const { results, selectedPhase, phase } = this.state;

        const data = results || {}; 

        const phasesToDisplay = [];
        for (let i = 1; i <= parseInt(phase.replace('Phase', '')); i++) {
            phasesToDisplay.push(`Phase${i}`);
        }

        const currentPhaseNumber = parseInt(phase.replace('Phase', ''));
        const isNotPhase4 = currentPhaseNumber < 4;

        return (
            <div className='container main'>
                <Divider />
                <h4>MINpred Results</h4>
                <Divider />
                <div className='row justify-content-center'>
                    <nav>
                        {phasesToDisplay.map((ph, index) => (
                            <Button
                                key={index}
                                className={`kbl-btn-1 mx-5 lg ${selectedPhase === ph ? 'active-phase' : 'inactive-phase'}`}
                                onClick={() => this.handlePhaseChange(ph)}
                            >
                                {ph}
                            </Button>
                        ))}
                    </nav>
                </div>
                <Divider />
                <PhaseTable phaseData={data[selectedPhase] || []} phase={selectedPhase} namer={this.state.namer} ecnumber={this.state.ecnumber} />
                <Divider />
                <Button className="kbl-btn-1 mx-5 lg" onClick={this.downloadCSV}>Download {selectedPhase} CSV</Button>
                <Button className="kbl-btn-1 mx-5 lg" onClick={this.downloadJSON}>Download {selectedPhase} JSON</Button>
                <Button className="kbl-btn-1 mx-5 lg" onClick={this.downloadExcel}>Download {selectedPhase} Excel</Button>

                {isNotPhase4 && this.state.isOpen && (
                    <img src={test} className="loading" height="50px" alt="" />
                )}
                {isNotPhase4 && this.state.isOpen === false && (
                    <Button className="kbl-btn-1 mx-5 lg" onClick={this.predictNextPhase}>Predict Next Phase</Button>
                )}
                
                <Divider />
            </div>
        );
    }
}
