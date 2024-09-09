import React from 'react';
import axios from 'axios';
import { env } from '../../env';
import test from './test.gif';
import { Table, Button } from 'react-bootstrap';
import { Divider } from 'antd';
import './Results.scss'
import '../../scss/components/buttons.scss';
import '../../scss/components/forms.scss';
import '../../scss/style.scss'

export default class PhaseTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phaseData: props.phaseData || '',
            namer: props.namer || '',
            phase: props.phase || '',
            ecnumber: props.ecnumber || '',
            loadingState: {},  // State to manage loading for each row for both tertiary and secondary structure
        };
        this.predictTertiaryStructure = this.predictTertiaryStructure.bind(this);
        this.predictSecondaryStructure = this.predictSecondaryStructure.bind(this);
    }

    getTopThreeValues(row) {
        const numericValues = {};

        for (let key in row) {
            if (!isNaN(row[key]) && key !== "pred") {
                numericValues[key] = parseFloat(row[key]);
            }
        }

        const sortedKeys = Object.keys(numericValues).sort((a, b) => numericValues[b] - numericValues[a]);
        return sortedKeys.slice(0, 3);
    }

    getHeaders(phaseData, phase) {
        const headers = Object.keys(phaseData[0]);

        if (phase === 'Phase3') {
            const predictionIndex = headers.indexOf('Prediction');
            const predIndex = headers.indexOf('pred');

            if (predictionIndex > 1) {
                headers.splice(predictionIndex, 1);
                headers.splice(1, 0, 'Prediction');
            }

            if (predIndex > -1) {
                headers.splice(predIndex, 1);
            }
        }

        // Add 'Tertiary Structure' and 'Secondary Structure' columns to headers
        headers.push('Secondary Structure', 'Tertiary Structure');

        // Add new columns for Phase 4
        if (phase === 'Phase4') {
            headers.push('Annotation');  // Add 'Annotation' column
        }

        return headers;
    }

    getLink(value, type) {
        const baseUrls = {
            'NCBI': 'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id=',
            'UniProt': 'https://www.uniprot.org/uniprotkb?query=',
            'Brenda': 'https://www.brenda-enzymes.org/enzyme.php?ecno=',
            'KEGG': 'https://www.genome.jp/dbget-bin/www_bget?ec:',
            'JGI IMG/M': 'https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=EnzymeGenomeList&gtype=isolate&ec_number=EC:',
        };
        return `${baseUrls[type]}${value}`;
    }

    getEnzymeName(ecNumber) {
        const enzymeMap = {
            '3.5.1.1': 'Asparginase',
            '3.5.1.2': 'Glutaminase',
            '3.5.1.4': 'Amidase',
            '3.5.1.5': 'Urease',
            '3.5.1.11': 'Penicillin amidase',
            '3.5.1.28': 'N-acetylmuramoyl-L-alanine amidase',
            '3.5.1.68': 'N-formylglutamate deformylase',
            '3.4.11.1': 'Leucyl aminopeptidase',
            '3.4.11.2': 'Membrane alanyl aminopeptidase',
            '3.4.11.4': 'Tripeptide aminopeptidase',
            '3.4.11.5': 'Prolyl aminopeptidase',
            '3.4.11.6': 'Aminopeptidase B',
            '3.4.11.9': 'Xaa-Pro aminopeptidase',
            '3.4.11.10': 'Bacterial leucyl aminopeptidase',
            '3.4.11.18': 'Aminopeptidase',
            '3.4.11.19': 'D-stereospecific aminopeptidase',
            '3.4.11.24': 'Aminopeptidase S',
            '3.4.13.-': 'Dipeptidase',
            '3.4.13.9': 'Carnosinase',
            '3.4.13.19': 'Beta-alanyl dipeptidase',
            '3.4.13.20': 'Prolidase',
            '3.4.13.21': 'Aminodipeptidase',
            '3.4.13.22': 'Xaa-His dipeptidase',
            '3.4.14.-': 'Dipeptidyl-peptidase',
            '3.4.14.1': 'Dipeptidyl-peptidase I',
            '3.4.14.5': 'Dipeptidyl-peptidase IV',
            '3.4.14.10': 'Tripeptidyl-peptidase II',
            '3.4.14.11': 'Xaa-Pro dipeptidyl-peptidase',
            '3.4.14.12': 'Xaa-Xaa-Pro tripeptidyl-peptidase',
            '3.4.17.-': 'Metallopeptidases',
            '3.4.17.11': 'Glutamate carboxypeptidase',
            '3.4.17.13': 'Muramoyltetrapeptide carboxypeptidase',
            '3.4.17.14': 'Zinc D-Ala-D-Ala carboxypeptidase',
            '3.4.17.18': 'Carboxypeptidase T',
            '3.4.17.19': 'Carboxypeptidase Taq',
            '3.4.17.21': 'Glutamate carboxypeptidase II',
            '3.4.17.24': 'Tubulin-glutamate carboxypeptidase',
            '3.4.19.-': 'Omega peptidase',
            '3.4.19.1': 'Acylaminoacyl-peptidase',
            '3.4.19.3': 'Pyroglutamyl-peptidase I',
            '3.4.19.9': 'Folate gamma-glutamyl hydrolase',
            '3.4.19.11': 'Gamma-D-glutamyl-meso-diaminopimelate peptidase',
            '3.4.19.12': 'Ubiquitinyl hydrolase 1',
            '3.4.21.-': 'Serine endopeptidase',
            '3.4.21.53': 'Endopeptidase La',
            '3.4.21.62': 'Subtilisin',
            '3.4.21.88': 'Repressor LexA',
            '3.4.21.89': 'Signal peptidase I',
            '3.4.21.92': 'Endopeptidase Clp',
            '3.4.21.102': 'C-terminal processing peptidase',
            '3.4.21.105': 'Rhomboid protease',
            '3.4.21.107': 'Peptidase Do',
            '3.4.22.-': 'Cysteine endopeptidase',
            '3.4.22.8': 'Clostripain',
            '3.4.22.10': 'Streptopain',
            '3.4.22.37': 'Gingipain R',
            '3.4.22.40': 'Bleomycin hydrolase',
            '3.4.22.49': 'Separase',
            '3.4.22.68': 'Ulp1 peptidase',
            '3.4.22.70': 'Sortase A',
            '3.4.22.71': 'Sortase B',
            '3.4.23.-': 'Aspartic endopeptidase',
            '3.4.23.12': 'Nepenthesin',
            '3.4.23.21': 'Rhizopuspepsin',
            '3.4.23.24': 'Candidapepsin',
            '3.4.23.36': 'Signal peptidase II',
            '3.4.23.43': 'Prepilin peptidase',
            '3.4.23.51': 'HycI peptidase',
            '3.4.24.-': 'Metalloendopeptidase',
            '3.4.24.3': 'Microbial collagenase',
            '3.4.24.13': 'IgA-specific metalloendopeptidase',
            '3.4.24.39': 'Deuterolysin',
            '3.4.24.40': 'Serralysin',
            '3.4.24.55': 'Pitrilysin',
            '3.4.24.64': 'Mitochondrial processing peptidase',
            '3.4.24.75': 'Lysostaphin',
            '3.4.24.84': 'Ste24 endopeptidase',
            'Others': `Other EC number in ${this.state.ecnumber}`
        };
        return enzymeMap[ecNumber] || '';
    }

    async predictTertiaryStructure(sampleId, index) {
        try {
            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        tertiaryLoading: true,
                        tertiaryStructureUrl: ''
                    }
                }
            }));

            const response = await axios.get(`${env.BACKEND}/api/struct`, {
                params: {
                    namer: this.state.namer,
                    phase: this.state.phase,
                    ecnumber: this.state.ecnumber,
                    acc_extract: sampleId
                }
            });

            const structureUrl = JSON.stringify(response.data);
            const localStorageKey = `tertiaryStructureUrl_${sampleId}`;
            sessionStorage.setItem(localStorageKey, structureUrl);

            const viewUrl = `/minpred/structure?pdb=${encodeURIComponent(localStorageKey)}`;
            window.open(viewUrl, '_blank');

            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        tertiaryLoading: false,
                        tertiaryStructureUrl: structureUrl
                    }
                }
            }));
        } catch (error) {
            console.error("Error predicting tertiary structure:", error);
            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        tertiaryLoading: false,
                        tertiaryStructureUrl: ''
                    }
                }
            }));
        }
    }

    async predictSecondaryStructure(sampleId, index) {
        try {
            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        secondaryLoading: true,
                        secondaryStructureUrl: ''
                    }
                }
            }));

            const response = await axios.get(`${env.BACKEND}/api/secstruct`, {
                params: {
                    namer: this.state.namer,
                    phase: this.state.phase,
                    ecnumber: this.state.ecnumber,
                    acc_extract: sampleId
                }
            });

            const structureUrl = JSON.stringify(response.data);
            const localStorageKey = `secondaryStructureUrl_${sampleId}`;
            localStorage.setItem(localStorageKey, structureUrl);
            console.log(structureUrl)
            const viewUrl = `/minpred/sstruct?sec=${encodeURIComponent(localStorageKey)}`;
            window.open(viewUrl, '_blank');

            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        secondaryLoading: false,
                        secondaryStructureUrl: structureUrl
                    }
                }
            }));
        } catch (error) {
            console.error("Error predicting secondary structure:", error);
            this.setState(prevState => ({
                loadingState: {
                    ...prevState.loadingState,
                    [index]: {
                        ...prevState.loadingState[index],
                        secondaryLoading: false,
                        secondaryStructureUrl: ''
                    }
                }
            }));
        }
    }

    getPredictionCountsByPhase(phaseData, phase) {
        const phaseCounts = {};

        phaseData.forEach(row => {
            const prediction = row['Prediction'];

            if (!phaseCounts[phase]) {
                phaseCounts[phase] = { total: 0, predictions: {} };
            }

            phaseCounts[phase].total += 1;

            if (prediction) {
                phaseCounts[phase].predictions[prediction] = (phaseCounts[phase].predictions[prediction] || 0) + 1;
            }
        });

        return phaseCounts;
    }

    render() {
        const { phaseData, phase } = this.props;
        const { loadingState } = this.state;

        if (!phaseData || phaseData.length === 0) return <div>No data available for {phase}</div>;

        const headers = this.getHeaders(phaseData, phase);
        const phaseCounts = this.getPredictionCountsByPhase(phaseData, phase);

        return (
            <div>
                <div className='row justify-content-center' style={{ maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                    {Object.entries(phaseCounts).map(([phase, counts]) => (
                        <div key={phase} style={{ marginBottom: '10px' }}>
                            {phase === 'Phase1' && (
                                <span>Total Number of Input Protein Sequences: {counts.total} | </span>
                            )}
                            {phase === 'Phase2' && (
                                <span>Total Number of Enzyme Sequences: {counts.total} | </span>
                            )}
                            {phase === 'Phase3' && (
                                <span>Total Number of Mineralization Enzyme Sequences: {counts.total} | </span>
                            )}
                            {phase === 'Phase4' && (
                                <span>Total Number of {this.state.ecnumber} Sequences: {counts.total} | </span>
                            )}

                            {Object.entries(counts.predictions).map(([prediction, count], index) => (
                                <span key={prediction}>
                                    {prediction}: {count}
                                    {index < Object.entries(counts.predictions).length - 1 && " | "}
                                </span>
                            ))}
                        </div>
                    ))}
                    <Divider />
                </div>
                <Table responsive className="kbl-table table table-borderless">
                    <thead className="kbl-thead">
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {phaseData.map((row, index) => {
                            const topThreeKeys = this.getTopThreeValues(row);
                            const { tertiaryLoading, tertiaryStructureUrl, secondaryLoading, secondaryStructureUrl } = loadingState[index] || {};

                            return (
                                <tr key={index}>
                                    {headers.map((header) => (
                                        <td key={header} style={{
                                            color: topThreeKeys.includes(header)
                                                ? topThreeKeys.indexOf(header) === 0
                                                    ? 'Darkgreen'
                                                    : topThreeKeys.indexOf(header) === 1
                                                        ? 'Red'
                                                        : 'Blue'
                                                : 'Black'
                                        }}>
                                            {header === 'Prediction' && phase === 'Phase4'
                                                ? <>
                                                    {row[header]} (<strong>{this.getEnzymeName(row[header])}</strong>)
                                                </>
                                                : header === 'Tertiary Structure'
                                                    ? (
                                                        tertiaryLoading
                                                            ? <img src={test} alt="Loading..." style={{ width: '50px', height: '20px' }} />
                                                            : tertiaryStructureUrl
                                                                ? <Button
                                                               
                                                                    
                                                                    className='kbl-btn-3'
                                                                    onClick={() => {
                                                                        const localStorageKey = `tertiaryStructureUrl_${row['SampleID']}`;
                                                                        const viewUrl = `/minpred/structure?pdb=${encodeURIComponent(localStorageKey)}`;
                                                                        window.open(viewUrl, '_blank');
                                                                    }}
                                                                >
                                                                    View
                                                                </Button>
                                                                : <Button
                                                                 
                                                                    className='kbl-btn-1'
                                                                    onClick={() => this.predictTertiaryStructure(row['SampleID'], index)}
                                                                >
                                                                    Predict
                                                                </Button>
                                                    )
                                                    : header === 'Secondary Structure'
                                                        ? (
                                                            secondaryLoading
                                                                ? <img src={test} alt="Loading..." style={{ width: '50px', height: '20px' }} />
                                                                : secondaryStructureUrl
                                                                    ? <Button
                                                                        variant="info"
                                                                        className='kbl-btn-4'
                                                                        onClick={() => {
                                                                            const localStorageKey = `secondaryStructureUrl_${row['SampleID']}`;
                                                                            const viewUrl = `/minpred/sstruct?sec=${encodeURIComponent(localStorageKey)}`;
                                                                            window.open(viewUrl, '_blank');
                                                                        }}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                    : <Button
                                                                        variant="primary"
                                                                        className='kbl-btn-2'
                                                                        onClick={() => this.predictSecondaryStructure(row['SampleID'], index)}
                                                                    >
                                                                        Predict
                                                                    </Button>
                                                        )
                                                        : header === 'Annotation'
                                                            ? (
                                                                <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                                                    <Button
                                                                        variant="link"
                                                                        className='mx-1 my-1'
                                                                        size="sm"
                                                                        href={this.getLink(row['Prediction'], 'NCBI')}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        NCBI
                                                                    </Button>
                                                                    <Button
                                                                        variant="link"
                                                                        className='mx-1 my-1'
                                                                        size="sm"
                                                                        href={this.getLink(row['Prediction'], 'UniProt')}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        UniProt
                                                                    </Button>
                                                                    <Button
                                                                        variant="link"
                                                                        className='mx-1 my-1'
                                                                        size="sm"
                                                                        href={this.getLink(row['Prediction'], 'Brenda')}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        Brenda
                                                                    </Button>
                                                                    <Button
                                                                        variant="link"
                                                                        className='mx-1 my-1'
                                                                        size="sm"
                                                                        href={this.getLink(row['Prediction'], 'KEGG')}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        KEGG
                                                                    </Button>
                                                                    <Button
                                                                        variant="link"
                                                                        className='mx-1 my-1'
                                                                        size="sm"
                                                                        href={this.getLink(row['Prediction'], 'JGI IMG/M')}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        JGI IMG/M
                                                                    </Button>
                                                                </div>
                                                            )
                                                            : row[header]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}
