package com.honeychain.customBlockchain;

import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Base64;

public class HoneyEvent {

    private final String batchId;
    private final String eventType;
    private final String actor;
    private final String details;
    private final String timestamp;

    private String signerId;
    private PublicKey signerPublicKey;
    private String digitalSignature;

    public HoneyEvent(
            String batchId,
            String eventType,
            String actor,
            String details,
            String timestamp) {

        this.batchId = batchId;
        this.eventType = eventType;
        this.actor = actor;
        this.details = details;
        this.timestamp = timestamp;
    }

    public String getData() {

        return batchId +
                eventType +
                actor +
                details +
                timestamp;
    }

    public void signEvent(Participant participant) {

        try {

            this.signerId = participant.getParticipantId();
            this.signerPublicKey = participant.getPublicKey();

            Signature signature =
                    Signature.getInstance("SHA256withECDSA");

            signature.initSign(participant.getPrivateKey());

            signature.update(
                    getData().getBytes(StandardCharsets.UTF_8)
            );

            byte[] signatureBytes = signature.sign();

            digitalSignature =
                    Base64.getEncoder()
                            .encodeToString(signatureBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verifySignature() {

        try {

            if (digitalSignature == null ||
                    signerPublicKey == null) {

                return false;
            }

            Signature signature =
                    Signature.getInstance("SHA256withECDSA");

            signature.initVerify(signerPublicKey);

            signature.update(
                    getData().getBytes(StandardCharsets.UTF_8)
            );

            byte[] signatureBytes =
                    Base64.getDecoder()
                            .decode(digitalSignature);

            return signature.verify(signatureBytes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String toString() {

        return "Batch ID: " + batchId +
                ", Event: " + eventType +
                ", Actor: " + actor +
                ", Details: " + details +
                ", Time: " + timestamp +
                ", Signer ID: " + signerId +
                ", Signature: " + digitalSignature;
    }

    public String getBatchId() {
        return batchId;
    }

    public String getEventType() {
        return eventType;
    }

    public String getSignerId() {
        return signerId;
    }
}