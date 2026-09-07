package com.honeychain.customBlockchain;

import java.security.MessageDigest;

public class Block {
    private int blockNumber;
    private HoneyEvent data;
    private String hash;
    private String previousHash;

    private int nonce;

    public Block(int blockNumber, HoneyEvent data, String previousHash){
        this.blockNumber = blockNumber;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;

        this.hash = calculateHash();
    }

    public String calculateHash(){
        String info = blockNumber+data.toString()+previousHash+nonce;

        return sha256(info);
    }

    public String sha256(String input){
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(input.getBytes());
            StringBuilder result = new StringBuilder();

            for(byte b : bytes){
                result.append(String.format("%02x", b));
            }
            return result.toString();
        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    public void mineBlock(int difficulty){
        String target = "0".repeat(difficulty);

        while(!hash.startsWith(target)){
            nonce++;
            hash = calculateHash();
        }

    }
      public int getBlockNumber() {
        return blockNumber;
    }

    public HoneyEvent getData() {
        return data;
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
}
