package com.honeychain.blockchain.controller;

import com.honeychain.blockchain.dto.BlockViewResponse;
import com.honeychain.customBlockchain.Block;
import com.honeychain.customBlockchain.BlockChain;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blockchain")
public class BlockChainViewerController {

    private final BlockChain blockChain;

    public BlockChainViewerController(BlockChain blockChain) {
        this.blockChain = blockChain;
    }

    @GetMapping("/chain")
    public List<BlockViewResponse> getBlockchain() {

        return blockChain.getChain()
                .stream()
                .map(this::convertBlock)
                .collect(Collectors.toList());
    }

    @GetMapping("/valid")
    public boolean isBlockchainValid() {

        return blockChain.isChainValid();
    }

    private BlockViewResponse convertBlock(Block block) {

        return new BlockViewResponse(
                block.getBlockNumber(),
                block.getData().getBatchId(),
                block.getData().getEventType(),
                block.getData().getSignerId(),
                block.getHash(),
                block.getPreviousHash(),
                block.getNonce(),
                block.getData().verifySignature()
        );
    }
}