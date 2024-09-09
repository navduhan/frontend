import React from "react";


export default class Footer extends React.Component {
    render(){
        return(
            <div className="row flex-lg-row justify-content-center">
             
            <p>
              &copy; 2023 |&nbsp;{" "}
              <a
                href="http://kaabil.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kaundal Artificial Intelligence and Advanced Bioinformatics Lab
              </a>
              &nbsp; |&nbsp;{" "}
              <a href="https://usu.edu" target="_blank" rel="noopener noreferrer">
                Utah State University
              </a>
            </p>
          </div>
        )
    }
}