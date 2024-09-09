import React, { Component } from 'react';
import * as NGL from 'ngl';
import { Button} from 'react-bootstrap'; // Ensure the Button component is imported
import { Divider } from 'antd';
class PDBViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            representationType: 'cartoon', // Default representation type
            colorscheme:'atomindex',
            bgcolor:'#ddd'
        };
        this.stage = null; // Reference to NGL stage
        this.viewerContainerRef = React.createRef(); // Reference to the container element
        this.component = null; // Reference to the loaded component
        this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);
        this.handleRepresentationChange = this.handleRepresentationChange.bind(this);
        this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
        this.loadStructure = this.loadStructure.bind(this)
    }

    componentDidMount() {
        this.stage = new NGL.Stage(this.viewerContainerRef.current);
        this.updateBackgroundColor()
    
        this.loadStructure(this.props.pdbData, this.state.representationType,this.state.colorscheme);
    }

    componentDidUpdate(prevProps, prevState) {
        this.stage = new NGL.Stage(this.viewerContainerRef.current);
        
        // Check if pdbData changed
        if (prevProps.pdbData !== this.props.pdbData) {
            this.loadStructure(this.props.pdbData, this.state.representationType, this.state.colorscheme);
            this.updateBackgroundColor();
        }
        
        // Check if representationType changed
        if (prevState.representationType !== this.state.representationType) {
            this.loadStructure(this.props.pdbData, this.state.representationType, this.state.colorscheme);
            this.updateBackgroundColor();
        }
        
        // Check if colorscheme changed
        if (prevState.colorscheme !== this.state.colorscheme) {
            this.loadStructure(this.props.pdbData, this.state.representationType, this.state.colorscheme);
            this.updateBackgroundColor();
        }
    }
    

    updateBackgroundColor() {
        const canvas = this.viewerContainerRef.current.querySelector('canvas');
        if (canvas) {
            canvas.style.backgroundColor = this.state.bgcolor;
        } else {
            console.error('Canvas element not found');
        }
    }
    loadStructure(data2, represent, colorschemed) {
        if (!this.stage) return; // Ensure stage is initialized

        let jsonData;
        try {
            jsonData = typeof data2 === 'string' ? JSON.parse(data2) : data2;
        } catch (e) {
            console.error('Invalid JSON data:', e);
            return;
        }

        if (!jsonData.atoms || !Array.isArray(jsonData.atoms)) {
            console.error('Invalid JSON structure:', jsonData);
            return;
        }

        const convertJsonToPdb = (jsonData) => {
            return jsonData.atoms.map(atom => {
                return `${atom.recordName.padEnd(6, ' ')}${atom.serial.toString().padStart(5, ' ')} ${atom.name.padEnd(4, ' ')}${atom.alternateLocation.padEnd(1, ' ')}${atom.residueName.padEnd(3, ' ')} ${atom.chainID.padEnd(1, ' ')}${atom.residueSequenceNumber.toString().padStart(4, ' ')}${atom.insertionCode.padEnd(1, ' ')}   ${atom.x.toFixed(3).padStart(8, ' ')}${atom.y.toFixed(3).padStart(8, ' ')}${atom.z.toFixed(3).padStart(8, ' ')}${atom.occupancy.toFixed(2).padStart(6, ' ')}${atom.tempFactor.toFixed(2).padStart(6, ' ')}${atom.segmentID.padEnd(4, ' ')}${atom.element.padStart(2, ' ')}${atom.charge.padEnd(2, ' ')}\n`;
            }).join('') + 'END\n';
        };

        const pdbData = convertJsonToPdb(jsonData);
        const blob = new Blob([pdbData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Clear previous representations
        if (this.component) {
            this.component.removeAllRepresentations();
        }

        this.stage.loadFile(url, { ext: 'pdb' }).then(component => {
            console.log(component)
            this.component = component; // Store reference to the loaded component
            this.component.addRepresentation(represent, {color:colorschemed});
            this.component.updateRepresentations({ type: represent, color:colorschemed });
            this.component.autoView();
            URL.revokeObjectURL(url); // Clean up the URL object
        }).catch(err => {
            console.error('Error loading PDB file:', err);
        });
    }

    handleRepresentationChange = (event) => {
        const representationType = event.target.value;
        this.setState({ representationType }, () => {
            if (this.component) {
                this.component.removeAllRepresentations();
                this.component.addRepresentation(this.state.representationType, {color: this.state.colorscheme});
                this.component.updateRepresentations({ type: this.state.representationType, color: this.state.colorscheme  });
                this.component.autoView();
            } else {
                this.loadStructure(this.props.pdbData, this.state.representationType, this.state.colorscheme);
            }
        });
    }

    handleColorSchemeChange (e){
        const colorscheme = e.target.value;
        this.setState({ colorscheme }, () => {
            if (this.component) {
                this.component.removeAllRepresentations();
                this.component.addRepresentation(this.state.representationType,  {color: this.state.colorscheme});
                this.component.updateRepresentations({ type: this.state.representationType, color:this.state.colorscheme  });
                this.component.autoView();
            } else {
                this.loadStructure(this.props.pdbData, this.state.representationType, this.state.colorscheme);
            }
        });
    }

    handleBackgroundColorChange = (e) => {
        const bgcolor = e.target.value;
        this.setState({ bgcolor }, () => {
            this.updateBackgroundColor(); // Update the background color
        });
    }

    convertJsonToPdb = (jsonData) => {
        return jsonData.atoms.map(atom => {
            return `${atom.recordName.padEnd(6, ' ')}${atom.serial.toString().padStart(5, ' ')} ${atom.name.padEnd(4, ' ')}${atom.alternateLocation.padEnd(1, ' ')}${atom.residueName.padEnd(3, ' ')} ${atom.chainID.padEnd(1, ' ')}${atom.residueSequenceNumber.toString().padStart(4, ' ')}${atom.insertionCode.padEnd(1, ' ')}   ${atom.x.toFixed(3).padStart(8, ' ')}${atom.y.toFixed(3).padStart(8, ' ')}${atom.z.toFixed(3).padStart(8, ' ')}${atom.occupancy.toFixed(2).padStart(6, ' ')}${atom.tempFactor.toFixed(2).padStart(6, ' ')}${atom.segmentID.padEnd(4, ' ')}${atom.element.padStart(2, ' ')}${atom.charge.padEnd(2, ' ')}\n`;
        }).join('') + 'END\n';
    }

    downloadPDB = () => {
        let jsonData;
        try {
            jsonData = typeof this.props.pdbData === 'string' ? JSON.parse(this.props.pdbData) : this.props.pdbData;
        } catch (e) {
            console.error('Invalid JSON data:', e);
            return;
        }

        const pdbData = this.convertJsonToPdb(jsonData);

        const blob = new Blob([pdbData], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'structure.pdb';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    
    saveAsImage = (format) => {
        const params = { factor: 4, antialias: true, transparent: true };
        if (format === 'png') {
            this.stage.makeImage(params).then((blob) => {
                NGL.download(blob, 'structure.png');
            });
        } else if (format === 'svg') {
            this.stage.exportSVG({ factor: 4 }).then((blob) => {
                NGL.download(blob, 'structure.svg');
            });
        }
    }

    render() {
        const viewerStyle = {
            width: '100%',
            height: '600px',
            backgroundColor: this.state.bgcolor,
            border: '1px solid #000',
            borderRadius: '8px',
            display: 'flex', // Add this line to enable flexbox
            // justifyContent: 'center', // Center content horizontally
            alignItems: 'center' // Optionally center content vertically
        };
        

        return (
            <div>
            <div className='row justify-content-center'>
                <div className='col-md-2' style={{ marginBottom: '10px' }}>
                    <h6><b>Select a Representation</b></h6>
                    <select className="form-control kbl-form" value={this.state.representationType} onChange={this.handleRepresentationChange}>
                    
                    <option value="cartoon">Cartoon</option>
                    <option value="ball+stick">Ball+Stick</option>
                        <option value="surface">Surface</option>
                        <option value="spacefill">Spacefill</option>
                        <option value="licorice">Licorice</option>
                        <option value="backbone">Backbone</option>
                       
                    </select>
                </div>
                <div className='col-md-2' style={{ marginBottom: '10px' }}>
                <h6> <b>Select a Color Scheme</b></h6>
                    <select className="form-control kbl-form" value={this.state.colorscheme} onChange={this.handleColorSchemeChange}>
                        <option value="atomindex">Residue Index</option>
                        <option value="element">Element</option>
                        <option value="chainid">Chain ID</option>
                        <option value="b-factor">B-Factor</option>
                        <option value="hydrophobicity">Hydrophobicity</option>
                    </select>
                </div>
                <div className='col-md-2' style={{ marginBottom: '10px' }}>
            <h6><b>Select Background Color</b></h6>
            <select
                className="form-control kbl-form"
                value={this.state.bgcolor}
                onChange={this.handleBackgroundColorChange}
            >
                <option value="#ddd">Light Gray</option>
                <option value="#f0f0f0">Very Light Gray</option>
                <option value="#ffffff">White</option>
                <option value="#000000">Black</option>
                <option value="#e0e0e0">Light Silver</option>
            </select>
        </div>
                <div className='col-md-6' style={{ marginBottom: '10px' }}>
                <h6> <b>Download options</b></h6>
                    <Button className="kbl-btn-1 mx-2 lg" onClick={this.downloadPDB} style={{ marginLeft: '10px' }}>Download PDB</Button>
                    <Button className="kbl-btn-1 mx-2 lg" onClick={() => this.saveAsImage('png')} style={{ marginLeft: '10px' }}>Save as PNG</Button>
                    <Button className="kbl-btn-1 mx-2 lg" onClick={() => this.saveAsImage('svg')} style={{ marginLeft: '10px' }}>Save as SVG</Button>
                </div>
                <Divider />
                </div>
                <div ref={this.viewerContainerRef} style={viewerStyle} key={this.state.representationType+this.state.colorscheme}></div>
         
            </div>
        );
    }
}

export default PDBViewer;
