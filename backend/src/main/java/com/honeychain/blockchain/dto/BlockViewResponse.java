package com.honeychain.blockchain.dto;

public class BlockViewResponse {

    private int blockNumber;
    private String batchId;
    private String eventType;
    private String actor;
    private String hash;
    private String previousHash;
    private int nonce;
    private boolean signatureValid;

    public BlockViewResponse(
            int blockNumber,
            String batchId,
            String eventType,
            String actor,
            String hash,
            String previousHash,
            int nonce,
            boolean signatureValid) {

        this.blockNumber = blockNumber;
        this.batchId = batchId;
        this.eventType = eventType;
        this.actor = actor;
        this.hash = hash;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.signatureValid = signatureValid;
    }

    public int getBlockNumber() {
        return blockNumber;
    }

    public String getBatchId() {
        return batchId;
    }

    public String getEventType() {
        return eventType;
    }

    public String getActor() {
        return actor;
    }

    public String getHash() {
        return hash;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public int getNonce() {
        return nonce;
    }

    public boolean isSignatureValid() {
        return signatureValid;
    }
}