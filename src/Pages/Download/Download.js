import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';


class DownloadMINpred extends Component {
  render() {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h2" className="text-center">
                MINpred Download
              </Card.Header>
              <Card.Body>
                <Card.Title>Download the Standalone Version</Card.Title>
                <Card.Text>
                  The standalone version of MINpred can be downloaded from the link below:
                </Card.Text>
                <Button
                  className='kbl-btn-1'
                  href="/minpred.tar.gz"
                >
                  Download MINpred Standalone
                </Button>

                <hr />

                <Card.Title>Installation Instructions</Card.Title>
                <ListGroup variant="flush" className="mb-4">
                 
                  <ListGroupItem>
                    <strong>Download the Miniconda Installer for Linux:</strong>
                    <br />
                    <a
                      href="https://docs.conda.io/en/latest/miniconda.html#linux-installers"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Miniconda Installer for Linux
                    </a>
                  </ListGroupItem>
                  <ListGroupItem>
                    <strong>Extract the Archive:</strong>
                    <br />
                    <code>tar -xvzf minpred.tar.gz</code>
                  </ListGroupItem>
                  <ListGroupItem>
                    <strong>Navigate to the Directory:</strong>
                    <br />
                    <code>cd minpred</code>
                  </ListGroupItem>
                  <ListGroupItem>
                    <strong>Create and Activate a Conda Environment:</strong>
                    <br />
                    <code>
                      conda env create -f environment.yml
                      <br />
                      conda activate minpred
                    </code>
                  </ListGroupItem>
                  <ListGroupItem>
                    <strong>Install the Package:</strong>
                    <br />
                    <code>pip install .</code>
                  </ListGroupItem>
                </ListGroup>

                <Card.Title>Usage Instructions</Card.Title>
                <Card.Text>
                  To run the MINpred tool with the example FASTA file, use the following command:
                </Card.Text>
                <Card>
                  <Card.Body>
                    <code>minpred -i ./example/test.fasta -od output </code>
                  </Card.Body>
                </Card>
              </Card.Body>
              <Card.Footer className="text-muted text-center">
                Ensure you have all prerequisites installed before proceeding with the installation.
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DownloadMINpred;
