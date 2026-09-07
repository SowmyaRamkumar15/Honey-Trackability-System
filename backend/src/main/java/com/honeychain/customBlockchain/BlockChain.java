package com.honeychain.customBlockchain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

@Component 
public class BlockChain {

    private final List<Block> chain = new ArrayList<>();

    private static final int DIFFICULTY = 4;

    public BlockChain() {

        HoneyEvent genesisEvent =
                new HoneyEvent(
                        "GENESIS",
                        "GENESIS",
                        "SYSTEM",
                        "Honey Chain started",
                        "GENESIS"
                );

        Block genesis =
                new Block(
                        0,
                        genesisEvent,
                        "0"
                );

        chain.add(genesis);
    }

    public synchronized boolean addBlock(HoneyEvent event) {

        if (event == null ||
                !event.verifySignature()) {

            return false;
        }

        Block previousBlock =
                chain.get(chain.size() - 1);

        Block newBlock =
                new Block(
                        chain.size(),
                        event,
                        previousBlock.getHash()
                );

        newBlock.mineBlock(DIFFICULTY);

        chain.add(newBlock);

        return true;
    }

    public synchronized boolean isChainValid() {

        for (int i = 1; i < chain.size(); i++) {

            Block currentBlock = chain.get(i);
            Block previousBlock = chain.get(i - 1);

            if (!currentBlock.getHash()
                    .equals(currentBlock.calculateHash())) {

                return false;
            }

            if (!currentBlock.getPreviousHash()
                    .equals(previousBlock.getHash())) {

                return false;
            }

            if (!currentBlock.getData().verifySignature()) {
                return false;
            }
        }

        return true;
    }

    public synchronized List<Block> getChain() {

        return Collections.unmodifiableList(
                new ArrayList<>(chain)
        );
    }

    public synchronized int size() {
        return chain.size();
    }

    public synchronized Block findBlockByBatchId(String batchId) {

    for (Block block : chain) {

        if (block.getData() != null &&
                batchId.equals(block.getData().getBatchId())) {

            return block;
        }
    }

    return null;
}
}