import React from "react";
import PDBViewer from "../../Components/PDBviewer/PDBviewer";
import { Divider } from "antd";

export default class Structure extends React.Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search);
        const pdbUrlFromQuery = searchParams.get('pdb');
        const sample = pdbUrlFromQuery.split("_")[1]
        console.log(sample)
        // Retrieve the stored PDB URL from local storage, if available
        const storedPdbUrl = sessionStorage.getItem(pdbUrlFromQuery) || pdbUrlFromQuery;
        
        this.state = {
            pdbUrl: storedPdbUrl,
            sample: sample
        };
    }

    render() {
        console.log(JSON.parse(this.state.pdbUrl)); // Log the PDB URL for debugging
        return (
            <div className="container main">
                <Divider />
                <h4>Predicted Strcuture for: {this.state.sample}</h4>
                <Divider />
                <PDBViewer pdbData={JSON.parse(this.state.pdbUrl)} />

                <Divider />
            </div>
        );
    }
}
