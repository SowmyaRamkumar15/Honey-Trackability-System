import React, { useEffect, useState } from "react";
import axios from "axios";

function BlockchainViewer() {

    const [blocks, setBlocks] = useState([]);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        loadBlockchain();
    }, []);

    const loadBlockchain = async () => {

        try {

            const blocksResponse =
                await axios.get("http://localhost:8080/api/blockchain/chain");

            const validResponse =
                await axios.get("http://localhost:8080/api/blockchain/valid");

            setBlocks(blocksResponse.data);
            setValid(validResponse.data);

        } catch (error) {

            console.error(
                "Failed to load blockchain",
                error
            );
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Blockchain Ledger</h1>

            <h3>
                Chain Status:{" "}
                <span>
                    {valid ? "✅ Valid" : "❌ Invalid"}
                </span>
            </h3>

            {blocks.map((block) => (

                <div
                    key={block.blockNumber}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}
                >

                    <h2>
                        Block #{block.blockNumber}
                    </h2>

                    <p>
                        <strong>Event:</strong>{" "}
                        {block.eventType}
                    </p>

                    <p>
                        <strong>Batch ID:</strong>{" "}
                        {block.batchId}
                    </p>

                    <p>
                        <strong>Actor:</strong>{" "}
                        {block.actor}
                    </p>

                    <p>
                        <strong>Nonce:</strong>{" "}
                        {block.nonce}
                    </p>

                    <p>
                        <strong>Hash:</strong>
                        <br />
                        <code>{block.hash}</code>
                    </p>

                    <p>
                        <strong>Previous Hash:</strong>
                        <br />
                        <code>{block.previousHash}</code>
                    </p>

                    <p>
                        <strong>Digital Signature:</strong>{" "}
                        {block.signatureValid
                            ? "✅ Valid"
                            : "❌ Invalid"}
                    </p>

                </div>

            ))}

        </div>
    );
}

export default BlockchainViewer;