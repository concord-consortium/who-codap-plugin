import React from "react";

import "./info-modal.scss";

export const InfoModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="info-modal-container">
      <div className="info-modal">
        <div className="info-header">
          More Information
        </div>
        <div className="info-modal-body">
          <p>
            <b>Source:</b> This data comes from the World Health Organization (WHO), an agency of the United Nations
            (UN). The WHO connects nations, partners and people to promote health, leads global efforts to expand
            universal health coverage, directs and coordinates the world’s response to health emergencies, and strives
            to give everyone, everywhere an equal chance at a safe and healthy life.
          </p>
          <p><a href="https://www.who.int/about" target="_blank" rel="noreferrer">Learn more about the WHO</a></p>
          <p><a href="https://data.who.int" target="_blank" rel="noreferrer">Learn more about Data at WHO</a></p>
          <p>
            <b>Acknowledgements:</b> Brought to you by the DataPBL project, a collaboration between Concord Consortium,
            EL Education, and the University of Colorado. This material is supported by the National Science Foundation
            under Grant No. DRL-2200887. Any opinions, findings, and conclusions or recommendations expressed in this
            material are those of the authors and do not necessarily reflect the views of the NSF.
          </p>
          <div className="info-modal-footer">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};
