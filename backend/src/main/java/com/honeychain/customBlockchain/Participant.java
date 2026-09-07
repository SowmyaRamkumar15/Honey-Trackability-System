package com.honeychain.customBlockchain;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;

public class Participant {

    private final String participantId;
    private final String name;
    private final String role;

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    public Participant(
            String participantId,
            String name,
            String role) {

        this.participantId = participantId;
        this.name = name;
        this.role = role;

        KeyPair keyPair = generateKeyPair();

        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
    }

    private KeyPair generateKeyPair() {

        try {

            java.security.KeyPairGenerator generator =
                    java.security.KeyPairGenerator.getInstance("EC");

            generator.initialize(256);

            return generator.generateKeyPair();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String getParticipantId() {
        return participantId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
}