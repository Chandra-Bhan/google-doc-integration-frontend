import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import config from "./config";

function DocumentIDExtractor() {
  const [file, setFile] = useState(null);
  const [googleDocsURL, setGoogleDocsURL] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [allDocuments, setAllDocuments] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? config.productionUrl
      : config.localUrl;

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const getAllDocuments = async () => {
    try {
      setLoading(true);
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const response = await axios.get(`${apiUrl}/api/v1/getPdfs`);
      console.log("All document Fetched:", response.data.result);
      setAllDocuments(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("ERROR: ", error);
      setLoading(false);
      alert("Please Refresh the Page backend server is not responded !!!");
    }
  };
  const saveDoc = async () => {
    try {
      setLoading(true);
      setShowModal(false);
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const response = await axios.get(
        `${apiUrl}/savedoc?fileId=${fileId}&fileName=${fileName}`
      );
      console.log("Save Function = ", response);
      setLoading(false);

      alert("SuccessFully Saved !!!");
      getAllDocuments();
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  };

  const editDocument = async () => {
    try {
      setLoading(true);
      if (!file) {
        console.error("Please select a file.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // Set the content type to multipart/form-data
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;

      // Replace with your server URL
      const response = await axios.post(
        `${apiUrl}/editDocument`,
        formData,
        config // Pass the config object with headers
      );

      if (response.status === 200) {
        const data = response.data;
        setGoogleDocsURL(data.documentUrl);
        console.log(data.documentUrl);
        setFileId(data.fileId);
        setFileName(data.fileName);
        setShowModal(true);
        setLoading(false);
        // window.open(data.documentUrl, "_blank");
      } else {
        console.error("Failed to edit the document.");
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error editing document:", error);
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      setLoading(true);
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? config.productionUrl
          : config.localUrl;
      const response = await axios.get(`${apiUrl}/create`);
      console.log(
        "New Document created = ",
        response.data.message,
        response.data.documentId,
        response.data.documentUrl
      );
      setGoogleDocsURL(response.data.documentUrl);
      setFileId(response.data.documentId);
      setFileName(response.data.fileName);
      setShowModal(true);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllDocuments();
  }, []);

  return (
    <div>
      <button
        onClick={handleCreateDocument}
        style={{
          marginRight: "-55rem",
          marginTop: "5rem",
        }}
        className="btn btn-primary"
      >
        Create New Document
      </button>
      <h2
        className="text-secondary"
        style={{ textAlign: "center", textDecoration: "underline" }}
      >
        Edit Existing Document
      </h2>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <input
          className="form-control w-50 ms-4"
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileUpload}
        />
        {file && (
          <button onClick={editDocument} className="btn btn-success">
            Edit Document
          </button>
        )}
      </div>
      <h3
        className="text-secondary"
        style={{ textAlign: "center", textDecoration: "underline" }}
      >
        List of all Documents
      </h3>
      {loading && (
        <div>
          <h3 className="text-danger">Loading...</h3>
        </div>
      )}
      {allDocuments && (
        <table
          className="table table-bordered"
          style={{
            width: "80%",
            margin: "auto",
            marginBottom: "5rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>doc links</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allDocuments.map((filename, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <a href="#">{filename}</a>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const handlEditingExistFile = async (fileName) => {
                        try {
                          setLoading(true);
                          console.log(fileName);
                          const response = await axios.post(
                            `${apiUrl}/editDocument?fileName=${fileName}`
                          );

                          if (response.status === 200) {
                            const data = response.data;
                            setGoogleDocsURL(data.documentUrl);
                            console.log(data.documentUrl);
                            setFileId(data.fileId);
                            setFileName(data.fileName);
                            setShowModal(true);
                            // window.open(data.documentUrl, "_blank");
                          } else {
                            console.error("Failed to edit the document.");
                          }
                          setLoading(false);
                        } catch (error) {
                          console.error("Error editing document:", error);
                          setLoading(false);
                        }
                      };
                      handlEditingExistFile(filename);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Google Docs Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            title="Google Docs"
            width="100%"
            height="500"
            src={googleDocsURL}
            frameBorder="0"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={saveDoc}>
            Save
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DocumentIDExtractor;
