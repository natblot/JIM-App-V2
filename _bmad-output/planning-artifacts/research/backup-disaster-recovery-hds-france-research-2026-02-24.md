# Backup, Disaster Recovery & Business Continuity for HDS-Certified Healthcare Infrastructure in France

**Research Date:** 2026-02-24
**Scope:** RPO/RTO best practices, database backup patterns, DR strategies, encrypted backup requirements, testing/validation, BCP (PCA/PRA), Kubernetes backup, object storage, ANSSI recommendations

---

## 1. Backup Strategies for Healthcare Data -- RPO/RTO Best Practices

### 1.1 Healthcare-Specific RPO/RTO Targets

Healthcare applications require some of the most aggressive RPO/RTO targets across industries due to patient safety implications.

| System Tier | RPO Target | RTO Target | Examples |
|---|---|---|---|
| **Tier 1 -- Critical** | < 1 minute (near-zero) | < 15 minutes | Patient monitoring, emergency systems, active care records |
| **Tier 2 -- Essential** | < 15 minutes | < 1 hour | Patient management systems (EHR/DMP), appointment scheduling, prescription systems |
| **Tier 3 -- Important** | < 4 hours | < 4 hours | Diagnostic imaging, lab results, administrative systems |
| **Tier 4 -- Standard** | < 24 hours | < 24 hours | Billing, HR, non-critical reporting, archival systems |

**Key principle:** Healthcare providers require near-zero RPO/RTO to safeguard patient data and ensure uninterrupted access to critical medical systems. A hospital may use DRaaS with an RTO of 1 hour to restore access to patient management systems during emergencies and set an RPO of 15 minutes to ensure patient data is up-to-date and compliant with regulations.

Sources:
- [What Is RTO? Healthcare Disaster Recovery Planning Explained -- Merit Technologies](https://merittechnologies.com/what-is-rto-healthcare/)
- [6 RTO Best Practices -- Cohesity](https://www.cohesity.com/blogs/6-rto-best-practices-why-its-time-to-revisit-application-rtos/)
- [Zero RTO & RPO: Architectural Considerations -- Medium](https://medium.com/@bijit211987/approaching-zero-rto-rpo-architectural-considerations-and-best-practices-3848e7252894)
- [RTO and RPO in DRaaS -- DataBank](https://www.databank.com/resources/blogs/understanding-rto-and-rpo-in-draas/)

### 1.2 The 3-2-1-1-0 Backup Rule Adapted for HDS

The classic 3-2-1 rule has evolved into the **3-2-1-1-0** rule, which is now the recommended standard:

| Element | Requirement | HDS Adaptation |
|---|---|---|
| **3** copies | 3 copies of all data | Production + 2 backup copies, all on HDS-certified infrastructure |
| **2** media types | Store on 2 different media | e.g., SSD/NVMe production + Object Storage backup + tape/cold storage |
| **1** offsite | 1 copy stored offsite | Must remain within EEA (HDS v2 requirement); second French datacenter (e.g., Paris + Strasbourg) |
| **1** offline/immutable | 1 copy offline or immutable | WORM-locked Object Storage or air-gapped cold backup; critical for ransomware protection |
| **0** errors | 0 errors after restoration test | Mandatory verified restores; automated integrity checks |

**ANSSI recommends** respecting the 3-2-1 rule as essential for anti-ransomware backup: multiple copies, on different media, with one offline. The evolution to 3-2-1-1-0 integrates immutability mechanisms and automatic integrity verification.

**Immutability options:**
- **Immutable backups** (WORM/Object Lock): locked backups accessible in read-only mode for the entire locking period, not vulnerable to ransomware or malicious acts
- **Offline backup** (cold/static): protected against cyber-attacks and ransomware; considered more robust than online WORM solutions by ANSSI
- **Recommended compromise:** regular backups with WORM solution + offline backups at lower frequency

Sources:
- [Bonnes pratiques de sauvegarde: la regle 3-2-1-1-0 -- ORSYS](https://www.orsys.fr/orsys-lemag/en/good-practices-safeguarding-rule-3-2-1-1-0/)
- [Regle 3-2-1 sauvegarde anti-ransomware -- Hexanet](https://cybersecurite.hexanet.fr/le-blog/la-r%C3%A8gle-3-2-1-de-la-sauvegarde-le-guide-pratique-pour-une-protection-anti-ransomware)
- [La regle de sauvegarde 3-2-1-1-0 -- Soteria Lab](https://soteria-lab.fr/blog/la-regle-de-sauvegarde-3-2-1-1-0-une-strategie-robuste-pour-la-protection-des-donnees)
- [Sauvegardes et Ransomwares -- EuroCAPA](https://www.eurocapa.com/blog/proteger-sauvegardes-contre-ransomwares)

### 1.3 Best Practices Summary

1. **Prioritize applications by criticality** -- Conduct a Business Impact Analysis (BIA) to classify systems into tiers
2. **Set RPO/RTO per workload** -- Not all systems need the same targets; align with organizational priorities and budget
3. **Implement Continuous Data Protection (CDP)** for Tier 1 systems -- Provides RPO of seconds before a data loss event
4. **Use automated backup scheduling** -- Eliminate human error in backup execution
5. **Test regularly** -- Any backup and recovery practices must be tested regularly, with the most important practice being to actually perform those tests
6. **Encrypt all backups** -- Required by both RGPD and HDS certification
7. **Monitor backup health** -- Alerting on failed or missed backups

---

## 2. Database Backup Patterns

### 2.1 PostgreSQL -- Continuous Archiving (WAL) and Point-in-Time Recovery (PITR)

PostgreSQL maintains a Write-Ahead Log (WAL) that records every change made to the database's data files. This technique supports point-in-time recovery: it is possible to restore the database to its state at any time since the base backup was taken.

#### How WAL Archiving Works

1. **WAL segments** record every change before it is written to data files
2. **Base backups** capture a full filesystem-level snapshot at a point in time
3. **WAL archiving** continuously ships WAL segments to a backup location
4. **Recovery** restores the base backup, then replays WAL segments to the desired point in time

#### pgBackRest -- Recommended Tool for Healthcare PostgreSQL Backup

pgBackRest is the recommended enterprise-grade backup tool with native S3 support and encryption.

**Key configuration (pgbackrest.conf):**

```ini
[global]
# Repository on S3-compatible storage (OVHcloud/Scaleway)
repo1-type=s3
repo1-s3-region=gra
repo1-s3-endpoint=s3.gra.io.cloud.ovh.net
repo1-s3-bucket=healthcare-pg-backups
repo1-s3-key=<ACCESS_KEY>
repo1-s3-key-secret=<SECRET_KEY>

# Encryption (AES-256-CBC)
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=<STRONG_PASSPHRASE>

# Retention
repo1-retention-full=4
repo1-retention-diff=14

# WAL archiving
archive-async=y
spool-path=/var/spool/pgbackrest

[db-primary]
pg1-path=/var/lib/postgresql/16/main
```

**PostgreSQL configuration (postgresql.conf):**

```ini
archive_mode = on
archive_command = 'pgbackrest --stanza=db-primary archive-push %p'
wal_level = replica
max_wal_senders = 3
```

**Scheduling with cron:**

```cron
# Full backup every Sunday at 02:00
0 2 * * 0  pgbackrest --stanza=db-primary --type=full backup
# Differential backup every day at 02:00
0 2 * * 1-6  pgbackrest --stanza=db-primary --type=diff backup
# Incremental backup every 4 hours
0 */4 * * *  pgbackrest --stanza=db-primary --type=incr backup
```

**Point-in-Time Recovery:**

```bash
# Restore to a specific timestamp
pgbackrest --stanza=db-primary \
  --type=time \
  --target="2026-02-24 14:30:00+01" \
  --target-action=promote \
  restore
```

Sources:
- [PostgreSQL Documentation: Continuous Archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)
- [pgBackRest Configuration Reference](https://pgbackrest.org/configuration.html)
- [pgBackRest User Guide](https://pgbackrest.org/user-guide.html)
- [Backing up PostgreSQL with pgBackRest to Object Storage -- Scaleway](https://www.scaleway.com/en/docs/tutorials/backup-postgresql-pgbackrest-s3/)
- [PostgreSQL Incremental Backup and PITR -- pgDash](https://pgdash.io/blog/postgres-incremental-backup-recovery.html)

### 2.2 MongoDB Backup Strategies

#### Core Approaches

**1. Full Backups with mongodump:**

```bash
# Full backup with compression and authentication
mongodump \
  --uri="mongodb://user:pass@host:27017/healthdb?authSource=admin" \
  --gzip \
  --archive=/backup/healthdb-$(date +%Y%m%d-%H%M%S).gz
```

**2. Oplog-Based Point-in-Time Recovery:**

The oplog (operation log) records all write operations in a replica set. By capturing and replaying the oplog, MongoDB can be restored to a particular state.

```bash
# Capture oplog for PITR
mongodump \
  --uri="mongodb://host:27017" \
  --oplog \
  --gzip \
  --archive=/backup/healthdb-full-with-oplog.gz

# Restore to specific timestamp
mongorestore \
  --gzip \
  --archive=/backup/healthdb-full-with-oplog.gz \
  --oplogReplay \
  --oplogLimit="1708787400:1"
```

**3. Percona Backup for MongoDB (PBM) on Kubernetes:**

For Kubernetes-native MongoDB deployments, the Percona Operator provides automated backup and PITR:

```yaml
# Percona MongoDB Operator CR - backup configuration
apiVersion: psmdb.percona.com/v1
kind: PerconaServerMongoDB
spec:
  backup:
    enabled: true
    pitr:
      enabled: true
      oplogSpanMin: 10  # Upload oplog chunks every 10 minutes
    storages:
      s3-hds:
        type: s3
        s3:
          bucket: healthcare-mongo-backups
          region: gra
          endpointUrl: https://s3.gra.io.cloud.ovh.net
          credentialsSecret: mongo-backup-s3-creds
    tasks:
      - name: daily-full
        enabled: true
        schedule: "0 2 * * *"
        storageName: s3-hds
        compressionType: gzip
      - name: weekly-full
        enabled: true
        schedule: "0 3 * * 0"
        storageName: s3-hds
        compressionType: gzip
```

#### Recommended Schedule and Retention

| Backup Type | Schedule | Retention | RPO Achieved |
|---|---|---|---|
| Full backup | Weekly (Sunday 02:00 UTC) | 90 days | -- |
| Incremental backup | Every 4 hours | 30 days | 4 hours |
| Oplog chunks (PITR) | Every 10 minutes | 30 days | ~15 minutes |
| Monthly archive | 1st of month | 1 year | -- |

**Performance limits recommendation:** max 3 concurrent backups, 100 Mbps bandwidth throttling, 8GB memory limit per operation.

**Encryption:** AES-256 encryption with key rotation every 90 days.

Sources:
- [MongoDB Backup and Recovery Strategies -- QueryLeaf](https://www.queryleaf.com/blog/2025/10/16/mongodb-backup-and-recovery-strategies-advanced-disaster-recovery-and-data-protection-for-mission-critical-applications/)
- [MongoDB Backup and Recovery for Enterprise Data Protection -- QueryLeaf](https://www.queryleaf.com/blog/2025/10/30/mongodb-backup-and-recovery-for-enterprise-data-protection-advanced-disaster-recovery-strategies-point-in-time-recovery-and-operational-resilience/)
- [Percona Operator for MongoDB -- Backups PITR](https://docs.percona.com/percona-operator-for-mongodb/backups-pitr.html)
- [Point-in-Time Recovery for MongoDB on Kubernetes -- Percona](https://www.percona.com/blog/point-in-time-recovery-for-mongodb-on-kubernetes/)
- [Optimizing MongoDB Backup Strategy: Achieving 1-Hour RPO -- One2N](https://one2n.io/blog/optimizing-mongodb-backup-strategy-lessons-from-achieving-a-1-hour-rpo)
- [MongoDB Official Backup Documentation](https://www.mongodb.com/docs/manual/core/backups/)

---

## 3. Disaster Recovery for HDS Infrastructure

### 3.1 Multi-Zone Replication on French HDS Providers

#### OVHcloud 3-AZ Paris Region (HDS-Certified)

As of February 2025, OVHcloud launched **Object Storage Standard 3-AZ** in the Paris region:

- **Architecture:** Three distinct data centers located in close proximity (a few km between each AZ), each with its own distinct power source
- **SLA:** 99.99% availability
- **Resilience:** Designed to withstand the loss of an entire availability zone
- **HDS Certification:** 3-AZ Paris Region is HDS-certified with ISO 27001
- **S3 Compatible:** Native support for asynchronous replication, object versioning, and object lock (WORM)
- **Offsite Replication:** Optional automatic replication from Paris to Strasbourg, Gravelines, or Roubaix
- **Pricing:** Starting at EUR 14/TB/month (EUR 11/TB for >500TB), zero egress fees, offsite replication +EUR 4/TB/month

**OVHcloud DR Solutions:**
- **Zerto-powered DR:** Allows switching on-premises or OVHcloud-hosted private cloud to another OVHcloud data center with minimal RTO/RPO
- **VMware vSphere Replication** for VM-level replication
- **VMware HCX** for hybrid cloud extension

#### Scaleway Healthcare Solutions (HDS-Certified)

- **HDS-certified** since July 2024
- **9 Availability Zones** across 3 regions
- **Multi-AZ Object Storage:** Standard Multi-AZ and Standard One Zone (only these are HDS-certified)
- **Data sovereignty:** All health data remains within France; no transfer outside France for HDS offers
- **Storage tiers:** Object Storage, Block Storage, Glacier (cold storage for long-term archived health data)
- **SecNumCloud:** Qualification process started January 2025, targeting end of 2025

#### Azure France (HDS-Certified)

- **France Central** (Paris) and **France South** (Marseille) regions
- HDS-certified through Microsoft compliance program
- Azure Site Recovery for VM-level DR
- Geo-redundant storage (GRS) replicates between French regions

Sources:
- [OVHcloud Launches Object Storage Standard 3-AZ in Paris](https://corporate.ovhcloud.com/en/newsroom/news/object-storage-3az/)
- [OVHcloud Multi-AZ Deployment](https://www.ovhcloud.com/en/about-us/global-infrastructure/multi-az/)
- [OVHcloud Disaster Recovery Solutions](https://www.ovhcloud.com/en/solutions/uc-backup-disaster-recovery/)
- [Scaleway Healthcare & Life Sciences Solutions](https://www.scaleway.com/en/healthcare-and-life-sciences-solutions/)
- [Scaleway Security and Resilience](https://www.scaleway.com/en/security-and-resilience/)
- [Scaleway Multi-AZ Object Storage](https://www.scaleway.com/en/blog/improve-disaster-resiliency-with-highly-redundant-multi-az-object-storage/)
- [Microsoft HDS France Compliance](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)

### 3.2 Cross-Region DR Plans for Healthcare

**Recommended architecture for French healthcare applications:**

```
Primary Site: OVHcloud Paris 3-AZ (or Scaleway PAR)
   |
   |-- Synchronous replication (within 3-AZ)
   |   RPO: 0 | RTO: < 5 minutes
   |
Secondary Site: OVHcloud Strasbourg/Gravelines (or Scaleway AMS)
   |
   |-- Asynchronous replication (cross-region)
   |   RPO: < 15 minutes | RTO: < 1 hour
   |
Tertiary (Cold): S3 Object Storage with Object Lock
   |
   |-- Daily encrypted snapshots
   |   RPO: < 24 hours | RTO: < 4 hours
```

**Failover strategy layers:**
1. **Application-level:** Health checks + automatic failover via load balancer (e.g., HAProxy, Traefik)
2. **Database-level:** PostgreSQL streaming replication with automatic promotion; MongoDB replica set with automatic election
3. **Infrastructure-level:** DNS failover (low TTL), Kubernetes multi-cluster with Argo CD
4. **Storage-level:** S3 cross-region replication with versioning

### 3.3 Failover Strategies

| Strategy | RPO | RTO | Cost | Use Case |
|---|---|---|---|---|
| **Active-Active** (multi-AZ) | 0 | < 1 min | High | Critical patient-facing systems |
| **Active-Passive Hot** (warm standby) | < 5 min | < 15 min | Medium-High | Core healthcare apps |
| **Active-Passive Warm** (pilot light) | < 15 min | < 1 hr | Medium | Essential but non-critical |
| **Backup & Restore** | < 24 hr | < 4 hr | Low | Archival, reporting |

---

## 4. Encrypted Backup Requirements (RGPD/HDS)

### 4.1 Regulatory Requirements

**HDS Certification mandates:**
- Data must be encrypted **in transit** (TLS 1.2+, ideally TLS 1.3) and **at rest** (AES-256)
- HDS certification builds on ISO/IEC 27001 with additional RGPD and health-domain requirements
- An HDS-certified host imposes more strict requirements than a standard host, including systematic encryption and access control

**RGPD (Article 32) requirements:**
- Encryption is explicitly listed as a security measure for personal data protection
- Must demonstrate ability to ensure ongoing confidentiality, integrity, availability and resilience of processing systems
- Regular testing, assessment, and evaluation of security measures

**HDS v2 (effective November 2024, mandatory by May 2026) adds:**
- Physical hosting of health data exclusively within the EEA
- Transparency about data transfers and remote access
- Subcontractor chain compliance
- Health data must not be used for any purpose other than hosting

### 4.2 Encryption Standards for Healthcare Backups

| Layer | Minimum Standard | Recommended | Notes |
|---|---|---|---|
| **Data at rest** | AES-256-CBC | AES-256-GCM | All backups, all storage tiers |
| **Data in transit** | TLS 1.2 | TLS 1.3 | All backup transfers |
| **Backup tool encryption** | pgBackRest AES-256-CBC | pgBackRest AES-256-CBC + S3 SSE | Double encryption |
| **Object Storage** | Server-Side Encryption (SSE-S3) | SSE-KMS with customer-managed keys | OVHcloud/Scaleway support SSE |
| **Kubernetes secrets** | AES-CBC at rest | AES-GCM with external KMS | Use --encryption-provider-config |
| **Restic/Velero** | AES-256 (default) | AES-256 (built-in) | Restic backups are encrypted by default |

### 4.3 Key Management

**Best practices for healthcare backup encryption keys:**

1. **Use Hardware Security Modules (HSMs)** for tamper-resistant key storage
   - OVHcloud provides dedicated HSM offerings
   - Azure Key Vault with HSM-backed keys in France Central
   - Scaleway Secret Manager for secret/key management

2. **Automated key rotation** -- rotate encryption keys every 90 days minimum

3. **Separate key storage** -- encryption keys MUST be stored separately from encrypted data
   - Never store the encryption key alongside the backup
   - Use a dedicated KMS (Key Management Service)

4. **Role-Based Access Control (RBAC)** on key access

5. **Audit trails** -- all key access must be logged for compliance

6. **Key escrow** -- maintain secure key recovery procedures

**pgBackRest key management example:**

```ini
# Store cipher pass in separate, restricted file
# /etc/pgbackrest/cipher.conf (chmod 600, owned by postgres)
repo1-cipher-pass=<GENERATED_STRONG_PASSPHRASE>
```

Sources:
- [Backup & Securite des donnees de sante -- Kiwi Sante](https://www.kiwi-backup.com/sauvegardes-donnees-externalisees-licences/sauvegarde-hds-donnees-de-sante)
- [Comment stocker et envoyer des donnees de sante en securite -- LockSelf](https://www.lockself.com/blog/hebergement-donnees-sante-securise)
- [AES-256 Encryption for HIPAA -- Kiteworks](https://www.kiteworks.com/hipaa-compliance/hipaa-encryption-requirements-safe-harbor-guide/)
- [HSM Key Management and GDPR Compliance -- Randtronics](https://randtronics.com/how-hsm-key-management-supports-pci-dss-4-0-hipaa-and-gdpr-compliance/)
- [HDS & RGPD -- DPO Partage](https://www.dpo-partage.fr/hds-et-rgpd/)
- [Key Considerations for HDS Version 2 -- Schellman](https://www.schellman.com/blog/healthcare-compliance/key-considerations-for-complying-with-hds-version-2)

---

## 5. Backup Testing and Validation

### 5.1 HDS Certification Audit Requirements

**Certification cycle:**
- **Initial certification audit** -- Two phases:
  1. Documentary review of policies and procedures
  2. On-site audit of infrastructure and systems
- **Annual surveillance audits** -- Verify continued compliance
- **Renewal audit** -- Required every 3 years to maintain certification
- **Penetration testing** -- Aligned with risk assessment requirements (Chapter 5 of HDS framework); confirms security controls are working as intended

**Key audit elements for backup:**
- Documented backup policy (frequency, scope, retention)
- Evidence of regular backup testing
- Encryption verification
- Access control logs for backup systems
- DR plan documentation and test results

### 5.2 Mandatory Testing Schedules

| Test Type | Minimum Frequency | HDS Requirement | Details |
|---|---|---|---|
| **Backup integrity check** | Daily (automated) | Required | Verify backup completeness, checksums |
| **Single-file restore test** | Weekly | Recommended | Restore random files and verify content |
| **Full database restore test** | Monthly | Required | Complete PITR restore to test environment |
| **Full DR failover test** | Semi-annually | Required | Complete site failover simulation |
| **BCP/PCA tabletop exercise** | Annually | Required | Stakeholder walkthrough of continuity plan |
| **Penetration testing** | Annually | Required | Security control validation |
| **Backup encryption verification** | Quarterly | Required | Verify encryption is active and keys work |

### 5.3 Restoration Testing Procedures

**Automated restore verification script (example):**

```bash
#!/bin/bash
# Healthcare backup restoration test
# Run monthly via cron

RESTORE_DB="test_restore_$(date +%Y%m%d)"
TIMESTAMP=$(date -d '1 hour ago' +%Y-%m-%d\ %H:%M:%S%z)

# 1. Restore PostgreSQL to test instance
pgbackrest --stanza=db-primary \
  --type=time \
  --target="$TIMESTAMP" \
  --target-action=promote \
  --db-path=/var/lib/postgresql/restore \
  restore

# 2. Start test instance and validate
pg_ctl -D /var/lib/postgresql/restore start -o "-p 5433"

# 3. Run data integrity checks
psql -p 5433 -c "SELECT count(*) FROM patients;" > /tmp/restore_check.log
psql -p 5433 -c "SELECT max(updated_at) FROM medical_records;" >> /tmp/restore_check.log

# 4. Compare with production counts
PROD_COUNT=$(psql -p 5432 -t -c "SELECT count(*) FROM patients;")
TEST_COUNT=$(psql -p 5433 -t -c "SELECT count(*) FROM patients;")

# 5. Report results
if [ "$PROD_COUNT" -eq "$TEST_COUNT" ]; then
  echo "PASS: Restore verified" | tee -a /tmp/restore_check.log
else
  echo "FAIL: Count mismatch" | tee -a /tmp/restore_check.log
  # Alert operations team
fi

# 6. Cleanup
pg_ctl -D /var/lib/postgresql/restore stop
rm -rf /var/lib/postgresql/restore
```

### 5.4 Compliance Documentation Requirements

For each backup test, maintain records including:
- Date and time of test
- Type of backup tested (full, incremental, PITR)
- Restore duration (measured RTO)
- Data completeness verification (measured RPO)
- Any errors encountered and resolution
- Sign-off by responsible person
- Retention of test results for audit period (minimum 3 years)

Sources:
- [HDS Certification Requirements -- Qualysec](https://qualysec.com/hds-certification-requirements/)
- [HDS Certification Requirements -- Feel Agile](https://feelagile.com/en/exigences-certification-hebergeur-de-donnees-de-sante-hds/)
- [HDS Accreditation Framework -- BSI/ANS](https://www.bsigroup.com/globalassets/localfiles/fr-fr/hds/ressources/referentiel-certification-hds-eng.pdf)
- [AFNOR HDS Certification](https://certification.afnor.org/en/digital/hds-certification)

---

## 6. Business Continuity Planning -- PCA/PRA for French Healthcare

### 6.1 Definitions (French Context)

- **PCA (Plan de Continuite d'Activite):** Business Continuity Plan -- ensures activity continues during a disruption without interruption. Focus is on maintaining operations.
- **PRA (Plan de Reprise d'Activite):** Disaster Recovery Plan -- defines procedures to restart IT systems and services after a total or partial loss. Focus is on restoration.
- **PCI (Plan de Continuite Informatique):** IT Continuity Plan -- the IT-specific component of the PCA, as defined by the PGSSI-S (Politique Generale de Securite des Systemes d'Information de Sante).

### 6.2 PCA/PRA Structure for Healthcare Applications

The French healthcare authorities (via the PGSSI-S framework) provide specific guidance:

**PCA Key Components:**
1. **Business Impact Analysis (BIA)** -- Identify critical healthcare processes and their IT dependencies
2. **Risk Assessment** -- Evaluate threats (ransomware, natural disaster, hardware failure, human error)
3. **Continuity Strategy** -- Define acceptable degraded modes of operation
4. **Communication Plan** -- Stakeholder notification procedures
5. **Testing Program** -- Regular exercises and drills

**PRA Key Components:**
1. **RTO/RPO per system** -- Maximum acceptable downtime and data loss per application
2. **Recovery procedures** -- Step-by-step restoration instructions
3. **Failover architecture** -- Primary/secondary site configuration
4. **Data synchronization** -- Replication and backup mechanisms
5. **Return to normal** -- Procedures to return to primary site after incident

**Healthcare-specific considerations:**
- Patient care cannot be instantly transferred to a backup site nor suddenly interrupted
- Degraded mode procedures must ensure minimum patient safety
- Clinical staff must be trained on manual/paper-based fallback procedures
- Integration with hospital emergency plans (Plan Blanc)

### 6.3 PRA/PCA Architecture for HDS-Hosted Applications

```
+------------------------------------------+
|          PCA (Business Continuity)        |
|                                          |
|  +------------------------------------+  |
|  |   PCI (IT Continuity)              |  |
|  |                                    |  |
|  |  +------------------------------+  |  |
|  |  |  PRA (Disaster Recovery)     |  |  |
|  |  |                              |  |  |
|  |  |  - Backup & Restore          |  |  |
|  |  |  - Replication               |  |  |
|  |  |  - Failover                  |  |  |
|  |  |  - Site switching            |  |  |
|  |  +------------------------------+  |  |
|  |                                    |  |
|  |  + Degraded mode procedures       |  |
|  |  + IT communication plan          |  |
|  |  + Technical runbooks             |  |
|  +------------------------------------+  |
|                                          |
|  + Business communication plan           |
|  + Staff procedures                      |
|  + Patient safety protocols              |
|  + Regulatory notification               |
+------------------------------------------+
```

### 6.4 HDS Provider PCA/PRA Offerings

**Typical HDS-certified hosting includes:**
- PRA/PCA between 2 datacenters in France
- Each datacenter equipped with PCA and PRA, regularly documented and tested
- Defined SLAs with penalties for RTO/RPO breaches
- These guarantees are not optional and are audited, conditioning the obtaining and maintaining of certification

**Contractual elements (HDS v2 Chapter 6):**
- Data rights procedures
- Incident contacts and escalation
- SLAs with penalties
- Sub-processor safeguards
- Reversibility: deletion or return provisions upon contract termination

Sources:
- [PRA/PCA -- Hosteur Sante](https://www.hosteur.fr/pra-pca/)
- [Hebergement donnees de sante -- BT Blue](https://www.bt-blue.com/hebergement-de-donnees-de-sante/)
- [PRA/PCA securisation -- Diatem](https://www.diatem.net/pca-pra-securite/)
- [PRA/PCA infogerance -- Niwanet](https://www.niwanet.net/infogerance/pca-pra/)
- [PGSSI-S Guide PCI -- eSante](https://esante.gouv.fr/sites/default/files/media_entity/documents/PGSSI-S_Guide_Pratique-PCI-V1.1.pdf)
- [CaRE2 D2: Resilience des etablissements de sante -- Adista](https://adista.fr/expertises/solutions-cloud-et-services-d-infrastructures/construire-son-pcra-pra-dans-le-cadre-de-care2-d2)

---

## 7. Velero/Restic for Kubernetes Backup

### 7.1 Velero Overview (v1.18 -- Current Stable)

Velero (with over 20,000 estimated active users) is the most popular Kubernetes backup tool. Version 1.18 introduces:
- Concurrent backup processing
- Cache volume support
- Incremental backup size tracking
- Volume policy support for PVC phase (skip Pending/Lost PVCs)

### 7.2 Installation with S3-Compatible HDS Storage

**Installation for OVHcloud S3:**

```bash
# Create credentials file
cat > /tmp/credentials-velero <<EOF
[default]
aws_access_key_id=<OVH_S3_ACCESS_KEY>
aws_secret_access_key=<OVH_S3_SECRET_KEY>
EOF

# Install Velero with node-agent (Restic/Kopia) for PV backup
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.8.0 \
  --bucket healthcare-k8s-backups \
  --backup-location-config \
    region=gra,s3ForcePathStyle="true",s3Url=https://s3.gra.io.cloud.ovh.net \
  --snapshot-location-config region=gra \
  --secret-file /tmp/credentials-velero \
  --use-node-agent \
  --default-volumes-to-fs-backup \
  --uploader-type=kopia
```

**For Scaleway S3:**

```bash
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.8.0 \
  --bucket healthcare-k8s-backups \
  --backup-location-config \
    region=fr-par,s3ForcePathStyle="true",s3Url=https://s3.fr-par.scw.cloud \
  --secret-file /tmp/credentials-velero \
  --use-node-agent \
  --default-volumes-to-fs-backup
```

### 7.3 Backup Scheduling for Healthcare Microservices

```bash
# Hourly backup of critical namespaces (1-day retention)
velero schedule create hourly-critical \
  --schedule="0 * * * *" \
  --include-namespaces healthcare-api,patient-service \
  --ttl 24h

# Daily production backup (7-day retention)
velero schedule create daily-production \
  --schedule="0 2 * * *" \
  --include-namespaces production \
  --ttl 168h

# Weekly full backup (30-day retention)
velero schedule create weekly-full \
  --schedule="0 0 * * 0" \
  --ttl 720h

# Monthly compliance backup (1-year retention)
velero schedule create monthly-compliance \
  --schedule="0 3 1 * *" \
  --ttl 8760h
```

### 7.4 Pre-Backup Hooks for Database Consistency

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    # PostgreSQL pre-backup hook
    pre.hook.backup.velero.io/container: postgres
    pre.hook.backup.velero.io/command: '["/bin/sh", "-c", "pg_dump -U postgres healthdb > /backup/dump.sql"]'
    pre.hook.backup.velero.io/timeout: 120s
    # Post-backup cleanup
    post.hook.backup.velero.io/container: postgres
    post.hook.backup.velero.io/command: '["/bin/sh", "-c", "rm -f /backup/dump.sql"]'
    # Annotate volumes for backup
    backup.velero.io/backup-volumes: data,logs
```

### 7.5 Restore Procedures

```bash
# Full namespace restore
velero restore create --from-backup daily-production-20260224 \
  --include-namespaces production

# Selective resource restore
velero restore create --from-backup daily-production-20260224 \
  --include-resources deployments,services,configmaps

# Cross-namespace restore (for testing)
velero restore create --from-backup daily-production-20260224 \
  --namespace-mappings production:production-restored
```

### 7.6 Secondary Backup Location (Geographic Redundancy)

```yaml
apiVersion: velero.io/v1
kind: BackupStorageLocation
metadata:
  name: secondary-strasbourg
  namespace: velero
spec:
  provider: aws
  objectStorage:
    bucket: healthcare-k8s-backups-dr
  config:
    region: sbg
    s3ForcePathStyle: "true"
    s3Url: https://s3.sbg.io.cloud.ovh.net
```

### 7.7 Monitoring

Velero exposes Prometheus metrics. Key alerts to configure:
- Backup failure rate > 0
- No successful backup in last 24 hours
- Backup duration exceeding threshold
- Storage location access errors

**Security note:** Restic backups are encrypted by default using AES-256. Kopia (newer alternative to Restic) also provides built-in encryption.

Sources:
- [Velero Official Site](https://velero.io/)
- [Velero GitHub Repository](https://github.com/vmware-tanzu/velero)
- [Kubernetes Disaster Recovery and Backup Strategies -- DasRoot](https://dasroot.net/posts/2026/02/kubernetes-disaster-recovery-backup-strategies/)
- [Kubernetes Backup and Restore with Helm and Velero -- OneUptime](https://oneuptime.com/blog/post/2026-01-17-helm-velero-backup-restore/view)
- [How to Back Up and Restore Kubernetes with Velero -- OneUptime](https://oneuptime.com/blog/post/2026-01-06-kubernetes-backup-restore-velero/view)
- [Velero Restic File-Level Backup -- OneUptime](https://oneuptime.com/blog/post/2026-02-09-velero-restic-file-level-backup/view)
- [Velero Docs: File System Backup](https://velero.io/docs/v1.10/file-system-backup/)
- [Kubernetes Backup using Velero -- AFI](https://afi.ai/blog/kubernetes-velero-backup)

---

## 8. Object Storage for Backup on HDS Providers

### 8.1 OVHcloud Object Storage (S3-Compatible, HDS-Certified)

**Storage Classes:**

| Storage Class | Use Case | Availability SLA | Min Object Size | Notes |
|---|---|---|---|---|
| **Standard 3-AZ** | Critical backups, active DR | 99.99% | -- | HDS-certified, Paris region |
| **Standard 1-AZ** | Regular backups | 99.9% | -- | HDS-certified |
| **Standard IA (Infrequent Access)** | Long-term retention | 99.9% | 128KB | 30-day minimum |

**Lifecycle Rules Configuration:**

```xml
<LifecycleConfiguration>
  <Rule>
    <ID>Healthcare-Backup-Lifecycle</ID>
    <Status>Enabled</Status>
    <Filter>
      <Prefix>backups/</Prefix>
    </Filter>
    <!-- Transition to IA after 30 days (minimum) -->
    <Transition>
      <Days>30</Days>
      <StorageClass>STANDARD_IA</StorageClass>
    </Transition>
    <!-- Delete after 365 days -->
    <Expiration>
      <Days>365</Days>
    </Expiration>
  </Rule>
  <Rule>
    <ID>Compliance-Archive-Retention</ID>
    <Status>Enabled</Status>
    <Filter>
      <Prefix>compliance/</Prefix>
    </Filter>
    <!-- Keep compliance archives for 10 years -->
    <Expiration>
      <Days>3650</Days>
    </Expiration>
  </Rule>
</LifecycleConfiguration>
```

**Key constraints:**
- Minimum transition duration: 30 days
- Objects < 128KB cannot be transitioned between tiers
- Versioning must be activated before setting lifecycle rules (only way to recover expired objects)
- Lifecycle rules processed asynchronously, most within 24 hours

**Features for healthcare compliance:**
- **Object Lock (WORM):** Prevents deletion/modification for a defined retention period
- **Versioning:** Maintains all versions of objects
- **Server Access Logging:** Detailed records for audit
- **Offsite Replication:** Automatic replication to secondary French datacenter (+EUR 4/TB/month)
- **Zero egress fees:** Important for DR scenarios requiring large data transfers

### 8.2 Scaleway Object Storage (S3-Compatible, HDS-Certified)

**HDS-Certified Storage Classes:**
- **Standard Multi-AZ** (Paris) -- For critical healthcare backups
- **Standard One Zone** (Paris) -- For non-critical storage

**Features:**
- S3-compatible API
- Server-side encryption
- Lifecycle policies for automated tiering
- Glacier cold storage for long-term archival
- Multi-AZ or multi-node data replication
- All health data remains within France

### 8.3 Backup Bucket Configuration Example (AWS CLI with OVHcloud)

```bash
# Create backup bucket
aws s3 mb s3://healthcare-backups-prod \
  --endpoint-url https://s3.gra.io.cloud.ovh.net

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket healthcare-backups-prod \
  --versioning-configuration Status=Enabled \
  --endpoint-url https://s3.gra.io.cloud.ovh.net

# Enable Object Lock (WORM) for immutable backups
aws s3api put-object-lock-configuration \
  --bucket healthcare-backups-prod \
  --object-lock-configuration '{
    "ObjectLockEnabled": "Enabled",
    "Rule": {
      "DefaultRetention": {
        "Mode": "COMPLIANCE",
        "Days": 90
      }
    }
  }' \
  --endpoint-url https://s3.gra.io.cloud.ovh.net

# Apply lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket healthcare-backups-prod \
  --lifecycle-configuration file://lifecycle-policy.json \
  --endpoint-url https://s3.gra.io.cloud.ovh.net
```

Sources:
- [OVHcloud Object Storage S3 Compatible](https://www.ovhcloud.com/en/public-cloud/object-storage/)
- [OVHcloud Object Storage Lifecycle Rules](https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066009)
- [OVHcloud Object Storage Compliancy](https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-compliancy?id=kb_article_view&sysparm_article=KB0047472)
- [OVHcloud 3-AZ Paris Region Launch](https://corporate.ovhcloud.com/en/newsroom/news/object-storage-3az/)
- [Scaleway Object Storage Documentation](https://www.scaleway.com/en/docs/object-storage/)
- [Scaleway Cloud Storage Solutions](https://www.scaleway.com/en/cloud-storage-solutions/)

---

## 9. ANSSI Recommendations for Backup and DR

### 9.1 ANSSI Cybersecurity Hygiene Guide -- Backup Measures

The ANSSI "Guide d'Hygiene Informatique" provides foundational backup requirements:

**Measure 37 -- Define and Apply a Backup Policy for Critical Components:**
- Clearly define essential data to be backed up
- Ensure availability of backups kept in a safe location
- Policy must include at minimum:
  - List of data deemed vital for the organization and servers concerned
  - Different types of backup (full, incremental, differential)
  - Frequency of backups
  - Procedure for administration and execution of backups
- Policy must be regularly updated

**Measure 38 -- Conduct Regular Security Controls and Audits:**
- Regular checks of available software updates
- Regular antivirus/antimalware scans
- Periodic disk cleanup and integrity verification

**Measure 39 -- Designate an Information Systems Security Officer (RSSI):**
- Named person responsible for information security
- Known to all personnel

### 9.2 ANSSI Strategic Plan 2025-2027

Key elements for backup and resilience:
- Develop continuity plans adapted to cloud-specific risks
- Independent backups, regularly tested
- **Immutability** (logical): Snapshots verrouilles, WORM storage
- **Strong isolation** of backup administration environments
- Protection against ransomware targeting backup infrastructure

### 9.3 ANSSI Cloud Security Recommendations (2025)

ANSSI has identified new cloud threats in 2025 and recommends:
- Independent backup infrastructure (not dependent on the cloud provider being backed up)
- Regular and independent restoration testing
- Encryption of all backup data
- Monitoring of backup system access
- Segregation of backup administration from production administration

### 9.4 ANSSI-Aligned Backup Architecture

```
Production Environment (HDS-Certified)
    |
    |-- [Encrypted] --> Primary Backup (Same Region, Different AZ)
    |                     Type: Hot/Warm
    |                     Retention: 30 days
    |                     Immutability: Object Lock (WORM)
    |
    |-- [Encrypted] --> Secondary Backup (Different Region in France)
    |                     Type: Warm
    |                     Retention: 90 days
    |                     Immutability: Object Lock (COMPLIANCE mode)
    |
    |-- [Encrypted] --> Offline Backup (Air-gapped or cold storage)
                          Type: Cold
                          Retention: 1 year+
                          Frequency: Weekly
                          Media: Glacier/Tape
```

### 9.5 PGSSI-S Healthcare Backup Requirements

The PGSSI-S (Politique Generale de Securite des Systemes d'Information de Sante) provides healthcare-specific backup rules:

- Backup scope must include all patient data, application configurations, and system states
- Restoration procedures must be documented and regularly tested
- Backup encryption is mandatory for health data
- Backup media must be stored in secure locations
- Access to backup systems must be restricted and logged

Sources:
- [ANSSI Publications](https://cyber.gouv.fr/publications)
- [ANSSI Cybersecurity Hygiene Guide](https://messervices.cyber.gouv.fr/documents-guides/guide_hygiene_informatique_anssi.pdf)
- [ANSSI Sauvegarde Fondamentaux -- MesServicesCyber](https://messervices.cyber.gouv.fr/guides/fondamentaux-sauvegarde-systemes-dinformation)
- [ANSSI Strategic Plan 2025-2027 -- Mathias Avocats](https://www.avocats-mathias.com/cybersecurite/cybersecurite-et-cyber-resilience-le-plan-strategique-2025-2027-de-lanssi)
- [ANSSI Cloud Threats 2025 -- Digitemis](https://www.digitemis.com/anssi-menaces-cloud-2025-securite/)
- [ANSSI Cybersecurity Hygiene Guide 2025 -- DynaTrust](https://dynatrust.io/en/2025/09/24/anssi-cybersecurity-hygiene-guide-the-essential-framework-for-securing-your-business-in-2025/)
- [PGSSI-S Guide Sauvegarde -- eSante](https://esante.gouv.fr/sites/default/files/media_entity/documents/PGSSI-S_Guide_Pratique-Sauvegarde-V1.1.pdf)
- [PGSSI-S Guide PCI -- eSante](https://esante.gouv.fr/sites/default/files/media_entity/documents/PGSSI-S_Guide_Pratique-PCI-V1.1.pdf)
- [Ransomware sauvegardes hors ligne et resilience -- Forum des Competences](https://www.forum-des-competences.org/ransomware-sauvegardes-hors-ligne/)
- [Recommandations ANSSI face aux cyberattaques -- Ataraxie-IT](https://ataraxie-it.com/recommandations-anssi-face-cyberattaques/)

---

## 10. HDS v2 Transition -- Key Timeline and Changes

### 10.1 Timeline

| Date | Milestone |
|---|---|
| **May 16, 2024** | HDS v2 reference document published |
| **November 16, 2024** | New certifications must be on HDS v2 |
| **July 2025** | Google Cloud transitioned to HDS v2.0 |
| **May 16, 2026** | **DEADLINE:** All active HDS certificates must be on v2 |

### 10.2 Key Changes in HDS v2

1. **Data sovereignty:** Physical hosting of health data exclusively within the EEA
2. **ISO 27001:2023 alignment:** Replaces previous ISO 20000-1, ISO 27017, ISO 27018 references with 31 specific embedded requirements
3. **Transparency:** Data transfer maps must be published; remote access from non-EEA countries must be disclosed
4. **Subcontracting:** Complete visibility of subcontracting chains; identical security/location standards for subcontractors
5. **Data usage limitation:** Health data must not be used for any purpose other than hosting
6. **Reversibility:** Deletion or return provisions upon contract termination
7. **Risk assessments:** Must specifically address health data hosting failure scenarios

Sources:
- [Evolution of HDS Framework -- RiskInsight Wavestone](https://www.riskinsight-wavestone.com/en/2025/05/evolution-of-the-hds-framework-towards-enhanced-security-and-sovereignty/)
- [Key Considerations for HDS Version 2 -- Schellman](https://www.schellman.com/blog/healthcare-compliance/key-considerations-for-complying-with-hds-version-2)
- [HDS v2 New French Certification -- Hogan Lovells](https://www.hoganlovells.com/en/publications/health-data-hosting-the-new-french-hds-certification-has-been-released)
- [France Publishes Updated HDS Certification Standard -- Inside Privacy](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)
- [Data Localisation Rules HDS -- Fieldfisher](https://www.fieldfisher.com/en/insights/data-localisation-rules-hds-certification-framework)
- [Google Cloud HDS v2.0 Certification](https://security.googlecloudcommunity.com/ciso-blog-77/google-cloud-achieves-hds-v2-0-certification-raising-the-bar-for-secure-health-data-hosting-in-france-5906)

---

## Summary: Recommended Backup Architecture for HDS Healthcare Application

```
Healthcare Application (Kubernetes on HDS-Certified Infrastructure)
|
+-- PostgreSQL (Primary)
|   |-- WAL archiving via pgBackRest -> S3 Object Storage (encrypted AES-256)
|   |-- Full backup: Weekly | Diff: Daily | Incr: Every 4 hours
|   |-- PITR capability: RPO < 5 minutes
|   +-- Streaming replication to standby (async, cross-AZ)
|
+-- MongoDB (Replica Set)
|   |-- Percona Operator with automated PITR
|   |-- Oplog chunks: Every 10 minutes -> S3 (encrypted)
|   |-- Full backup: Weekly | Incremental: Every 4 hours
|   +-- RPO: < 15 minutes
|
+-- Kubernetes Resources
|   |-- Velero v1.18 with Kopia (node-agent)
|   |-- Hourly critical namespace backup (24h TTL)
|   |-- Daily full backup (7d TTL)
|   |-- Weekly compliance backup (30d TTL)
|   |-- Monthly archive (1y TTL)
|   +-- Pre/post hooks for database consistency
|
+-- Object Storage (OVHcloud 3-AZ Paris / Scaleway Multi-AZ)
|   |-- Primary: Standard 3-AZ with Object Lock (WORM)
|   |-- Secondary: Offsite replication to Strasbourg/Gravelines
|   |-- Archive: Glacier/IA for long-term (10-year compliance)
|   +-- Lifecycle policies for automated tiering
|
+-- Encryption
|   |-- All backups: AES-256 at rest
|   |-- All transfers: TLS 1.3 in transit
|   |-- Keys managed via KMS/HSM, rotated every 90 days
|   +-- Keys stored separately from backup data
|
+-- Testing & Compliance
|   |-- Daily: Automated integrity checks (0 errors)
|   |-- Monthly: Full PITR restore test
|   |-- Semi-annual: Full DR failover test
|   |-- Annual: BCP tabletop exercise + penetration test
|   +-- All results documented for HDS audit
|
+-- DR Strategy
    |-- Active-Active within 3-AZ (RPO: 0, RTO: < 5 min)
    |-- Warm standby cross-region (RPO: < 15 min, RTO: < 1 hr)
    |-- Cold backup restore (RPO: < 24 hr, RTO: < 4 hr)
    +-- All within EEA (HDS v2 requirement)
```
