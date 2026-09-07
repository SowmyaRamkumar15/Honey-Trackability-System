package com.honeychain.blockchain.service.impl;

import com.honeychain.batch.entity.HoneyBatch;
import com.honeychain.blockchain.dto.BlockchainRecordResponse;
import com.honeychain.blockchain.entity.BlockchainRecord;
import com.honeychain.blockchain.entity.BlockchainRecordType;
import com.honeychain.blockchain.exception.BlockchainException;
import com.honeychain.blockchain.mapper.BlockchainRecordMapper;
import com.honeychain.blockchain.repository.BlockchainRecordRepository;
import com.honeychain.blockchain.service.BlockchainService;
import com.honeychain.blockchain.util.BatchCanonicalDataBuilder;
import com.honeychain.blockchain.util.HashUtil;
import com.honeychain.blockchain.util.LabResultCanonicalDataBuilder;
import com.honeychain.customBlockchain.Block;
import com.honeychain.customBlockchain.BlockChain;
import com.honeychain.customBlockchain.HoneyEvent;
import com.honeychain.customBlockchain.Participant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@ConditionalOnProperty(
        name = "blockchain.mode",
        havingValue = "real"
)
public class RealBlockchainService implements BlockchainService {

    private static final Logger logger =
            LoggerFactory.getLogger(RealBlockchainService.class);

    private static final String NETWORK = "HONEYCHAIN-REAL";

    private final BlockchainRecordRepository blockchainRecordRepository;
    private final BlockchainRecordMapper blockchainRecordMapper;
    private final BlockChain blockchain;
    /*
     * This is YOUR actual blockchain.
     */

    public RealBlockchainService(
            BlockchainRecordRepository blockchainRecordRepository,
            BlockchainRecordMapper blockchainRecordMapper,
            BlockChain blockchain) {

        this.blockchainRecordRepository = blockchainRecordRepository;
        this.blockchainRecordMapper = blockchainRecordMapper;
        this.blockchain = blockchain;

        logger.info("=================================================");
        logger.info("HoneyChain REAL blockchain initialized");
        logger.info("Genesis block created");
        logger.info("=================================================");
    }

    @Override
    @Transactional
    public synchronized BlockchainRecordResponse recordBatch(
            HoneyBatch batch) {

        if (batch == null || batch.getBatchId() == null) {
            throw new BlockchainException(
                    "Cannot record batch with null or missing batch ID");
        }

        /*
         * Don't add the same batch twice.
         */
        Optional<BlockchainRecord> existing =
                blockchainRecordRepository
                        .findByBatchIdAndRecordType(
                                batch.getBatchId(),
                                BlockchainRecordType.BATCH_CREATED);

        if (existing.isPresent()) {

            logger.info(
                    "Batch {} already recorded",
                    batch.getBatchId());

            return blockchainRecordMapper
                    .toResponse(existing.get());
        }

        /*
         * Build deterministic data.
         */
        String canonicalData =
                BatchCanonicalDataBuilder
                        .buildCanonicalString(batch);

        /*
         * This hash is the fingerprint of the batch data.
         */
        String dataHash =
                HashUtil.generateSha256(canonicalData);

        /*
         * Create a participant.
         *
         * In our prototype the participant generates
         * an EC key pair automatically.
         */
        Participant participant =
                new Participant(
                        String.valueOf(batch.getBeekeeperProfileId()),
                        "Beekeeper",
                        "BEEKEEPER"
                );

        /*
         * Create your HoneyEvent.
         */
        HoneyEvent event =
                new HoneyEvent(
                        batch.getBatchId(),
                        "BATCH_CREATED",
                        String.valueOf(batch.getBeekeeperProfileId()),
                        canonicalData,
                        LocalDateTime.now().toString()
                );

        /*
         * Sign the event using ECDSA.
         */
        event.signEvent(participant);

        /*
         * Add the signed event to YOUR blockchain.
         *
         * This performs:
         *   signature verification
         *   previous hash linking
         *   SHA-256 hashing
         *   proof-of-work mining
         */
        boolean added =
                blockchain.addBlock(event);

        if (!added) {
            throw new BlockchainException(
                    "Event rejected by blockchain");
        }

        /*
         * Get the block that was just mined.
         */
        Block minedBlock =
                blockchain.getChain()
                        .get(blockchain.size() - 1);

        String transactionHash =
                "0x" + minedBlock.getHash();

        Long blockNumber =
                (long) minedBlock.getBlockNumber();

        /*
         * Save blockchain metadata in the existing
         * database so the rest of the application
         * continues working exactly as before.
         */
        BlockchainRecord record =
                new BlockchainRecord(
                        batch.getBatchId(),
                        dataHash,
                        transactionHash,
                        blockNumber,
                        NETWORK,
                        BlockchainRecordType.BATCH_CREATED,
                        LocalDateTime.now()
                );

        BlockchainRecord saved =
                blockchainRecordRepository.save(record);

        logger.info(
                "REAL BLOCKCHAIN: Batch {} added at block {}",
                batch.getBatchId(),
                blockNumber);

        logger.info(
                "REAL BLOCKCHAIN: Hash = {}",
                minedBlock.getHash());

        return blockchainRecordMapper
                .toResponse(saved);
    }

    @Override
    @Transactional
    public synchronized BlockchainRecordResponse recordLabResult(
            String batchId,
            Integer purityScore,
            String result,
            LocalDateTime testedAt) {

        if (batchId == null || batchId.isBlank()) {
            throw new BlockchainException(
                    "Cannot record lab result: batchId is required");
        }

        /*
         * Don't record the same lab result twice.
         */
        Optional<BlockchainRecord> existing =
                blockchainRecordRepository
                        .findByBatchIdAndRecordType(
                                batchId,
                                BlockchainRecordType.LAB_RESULT);

        if (existing.isPresent()) {

            return blockchainRecordMapper
                    .toResponse(existing.get());
        }

        /*
         * Build deterministic lab data.
         */
        String canonicalData =
                LabResultCanonicalDataBuilder
                        .buildCanonicalString(
                                batchId,
                                purityScore,
                                result,
                                testedAt
                        );

        String dataHash =
                HashUtil.generateSha256(canonicalData);

        /*
         * LAB participant.
         */
        Participant participant =
                new Participant(
                        "LAB",
                        "Honey Quality Laboratory",
                        "LAB"
                );

        /*
         * Create event.
         */
        HoneyEvent event =
                new HoneyEvent(
                        batchId,
                        "LAB_RESULT",
                        "LAB",
                        canonicalData,
                        testedAt.toString()
                );

        /*
         * Sign event.
         */
        event.signEvent(participant);

        /*
         * Add to YOUR blockchain.
         */
        boolean added =
                blockchain.addBlock(event);

        if (!added) {
            throw new BlockchainException(
                    "Lab event rejected by blockchain");
        }

        /*
         * Get mined block.
         */
        Block minedBlock =
                blockchain.getChain()
                        .get(blockchain.size() - 1);

        String transactionHash =
                "0x" + minedBlock.getHash();

        Long blockNumber =
                (long) minedBlock.getBlockNumber();

        /*
         * Save metadata for compatibility
         * with the existing application.
         */
        BlockchainRecord record =
                new BlockchainRecord(
                        batchId,
                        dataHash,
                        transactionHash,
                        blockNumber,
                        NETWORK,
                        BlockchainRecordType.LAB_RESULT,
                        LocalDateTime.now()
                );

        BlockchainRecord saved =
                blockchainRecordRepository.save(record);

        logger.info(
                "REAL BLOCKCHAIN: Lab result for {} added at block {}",
                batchId,
                blockNumber);

        return blockchainRecordMapper
                .toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BlockchainRecordResponse getBatchRecord(
            String batchId) {

        return getBatchRecord(
                batchId,
                BlockchainRecordType.BATCH_CREATED);
    }

    @Override
    @Transactional(readOnly = true)
    public BlockchainRecordResponse getBatchRecord(
            String batchId,
            BlockchainRecordType recordType) {

        return blockchainRecordRepository
                .findByBatchIdAndRecordType(
                        batchId,
                        recordType)
                .map(blockchainRecordMapper::toResponse)
                .orElseGet(() ->
                        new BlockchainRecordResponse(
                                false,
                                batchId,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                        ));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBatchRecorded(String batchId) {

        return blockchainRecordRepository
                .existsByBatchIdAndRecordType(
                        batchId,
                        BlockchainRecordType.BATCH_CREATED);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isLabResultRecorded(String batchId) {

        return blockchainRecordRepository
                .existsByBatchIdAndRecordType(
                        batchId,
                        BlockchainRecordType.LAB_RESULT);
    }
}