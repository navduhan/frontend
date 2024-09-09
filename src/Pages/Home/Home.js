import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Divider } from "antd";
import "./Home.scss";
import minpred from './minpred.png';

const Home = () => {
  return (
    <div className="container main">
      <div className="separator">
        <h1>About MINpred</h1>
        <div className="divider">&nbsp;</div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="purpose">
            <p>
              The global nitrogen cycle has been notably disrupted by human actions, specifically through the utilization of industrial nitrogen fertilizers and the fixation of nitrogen by crops. This disturbance has caused a notable rise in reactive nitrogen within ecosystems. Consequently, agricultural systems face issues like inefficient nitrogen utilization due to nitrogen loss through processes like leaching and denitrification. Plants acquire nitrogen for their growth from diverse sources, including organic nitrogen derived from enzymatic processes like mineralization, a crucial element in the overall nitrogen cycling within ecosystems. In this study, we propose MINpred, a deep learning-based prediction method for the identification and classification of nitrogen mineralization-related enzymes prediction. We trained various protein sequence features such as amino acid composition, dipeptide composition, conformation transition and distribution, NMBroto, CKSAAP, conjoint, quasi order, etc., with the k-fold cross-validation and in an independent testing to validate our models. MINpred uses a phase-based classification: In Phase-I, the input query protein sequences are predicted as enzymes or non-enzymes. In Phase-II, it further categorizes the predicted enzymes into nitrogen mineralization enzymes or non-mineralization enzymes. Phase-III classifies the nitrogen mineralization enzymes into ten specific classes. Phase-IV assigns EC numbers to the predicted classes from Phase-III. Among all the features tested, the DPC+NMBroto hybrid feature gave the best prediction performance (accuracy of 96.15% in k-fold training and 93.43% in independent testing) with a high MCC (0.92 training and 0.87 independent testing) in phase-I; and in phase-II (accuracy of 95.23% in k-fold training and 92.43% in independent testing), Phase-III (overall accuracy of 96.23% in k-fold training and 93.83% in independent testing). For phase-IV, CKSAAP-based features gave the best performance with an accuracy of 90% in assigning the EC numbers. MINpred will enable researchers to predict and analyze a variety of new nitrogen mineralization-related enzymes from genomes and metagenomes.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <img src={minpred} alt="MINpred Overview" width={600} />
          <div className="button-container my-5">
            <Link to="/minpred/prediction">
              <Button variant="primary" className="mx-2">
               Prediction
              </Button>
            </Link>
            <Link to="/minpred/download">
              <Button variant="secondary" className="mx-2">
                Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Home;
