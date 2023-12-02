// Import React, Ant Design components and CSV parser
import React, { useState } from "react";
import { Modal, Button, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import Papa from "papaparse";




// Define the ImporterModal component
function ImporterModal() {
    // Define the state for the modal visibility
    
   

    // Define the state for the players data and the file name
    const [fileName, setFileName] = useState("");
    let [players, setPlayers] = useState([]);
    // Define the upload props for the select file button

    // Define the columns for the table
   

    // Define the data for the table
   

    // Define the showModal function
    const showModal = () => {
        // Set the modal visibility to true
        setVisible(true);
    };

    // Define the handleOk function
    const handleOk = () => {
        // Set the modal visibility to false
        setVisible(false);
        // Reset the players data and the file name
        setPlayers([]);
        setFileName("");
    };

    // Define the handleCancel function
    

    return (
        <div className="bg-gray-700 h-[40rem] ">
        
          
            </div>
        
    );
}

export default ImporterModal;
