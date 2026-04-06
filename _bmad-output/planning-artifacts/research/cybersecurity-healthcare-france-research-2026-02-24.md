# Cybersecurity for Healthcare Applications in France - Research Report
## Date: 2026-02-24 | Coverage: 2025-2026

---

## Table of Contents
1. [OWASP Top 10 2025 & Mobile Top 10](#1-owasp-top-10-2025--mobile-top-10)
2. [Pro Sante Connect (PSC) Technical Integration](#2-pro-sante-connect-psc-technical-integration)
3. [Encryption Standards for Healthcare](#3-encryption-standards-for-healthcare)
4. [WAF for Healthcare APIs](#4-waf-web-application-firewall-for-healthcare)
5. [SIEM and Monitoring](#5-siem-and-monitoring-for-healthcare)
6. [ANSSI Security Recommendations](#6-anssi-security-recommendations)
7. [RBAC for Healthcare Apps](#7-rbac-role-based-access-control)
8. [Incident Response Plan 24h](#8-incident-response-plan-24h)
9. [Security Audit and Penetration Testing](#9-security-audit-and-penetration-testing)
10. [JWT vs Session-Based Auth](#10-jwt-vs-session-based-authentication)
11. [RGPD Technical Implementation](#11-rgpd-technical-implementation)
12. [Mobile App Security](#12-mobile-app-security)

---

## 1. OWASP Top 10 2025 & Mobile Top 10

### OWASP Top 10:2025 (Web Applications)

The OWASP Top 10 was updated for 2025 with two new categories. The complete list:

| Rank | Category | Healthcare Relevance |
|------|----------|---------------------|
| A01:2025 | **Broken Access Control** | Critical for patient data separation, multi-role access (physio, admin, clinic owner) |
| A02:2025 | **Security Misconfiguration** | Surged from #5 to #2; affects 3% of tested apps. Cloud/HDS config errors |
| A03:2025 | **Software Supply Chain Failures** | NEW - Dependencies, build systems, distribution infrastructure compromises |
| A04:2025 | **Cryptographic Failures** | Health data encryption at rest/transit, TLS implementation |
| A05:2025 | **Injection** | SQL/NoSQL injection in patient search, appointment APIs |
| A06:2025 | **Insecure Design** | Privacy-by-design failures in healthcare workflows |
| A07:2025 | **Identification and Authentication Failures** | PSC integration errors, session management |
| A08:2025 | **Software and Data Integrity Failures** | CI/CD pipeline security, update mechanisms |
| A09:2025 | **Security Logging and Alerting Failures** | Compliance audit trail requirements |
| A10:2025 | **Mishandling of Exceptional Conditions** | NEW - Improper error handling, failing open scenarios |

**Key changes from 2021:** Software Supply Chain Failures (A03) and Mishandling of Exceptional Conditions (A10) are entirely new categories reflecting evolving threat landscapes.

Sources:
- [OWASP Top 10:2025 Official](https://owasp.org/Top10/2025/)
- [OWASP Top 10:2025 Introduction](https://owasp.org/Top10/2025/0x00_2025-Introduction/)
- [GitLab - OWASP Top 10 2025 Changes](https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/)
- [Orca Security - Key Changes](https://orca.security/resources/blog/owasp-top-10-2025-key-changes/)

### OWASP Mobile Top 10 (2024 - Current)

Updated for the first time in eight years (late 2024), this is the current reference:

| Rank | Category | Healthcare Mobile App Impact |
|------|----------|------------------------------|
| M1 | **Improper Credential Usage** | e-CPS token storage, PSC credential handling |
| M2 | **Inadequate Supply Chain Security** | Third-party SDK risks in health apps |
| M3 | **Insecure Authentication/Authorization** | PSC/OpenID Connect implementation flaws |
| M4 | **Insufficient Input/Output Validation** | Patient data form injection |
| M5 | **Insecure Communication** | Health data in transit, missing certificate pinning |
| M6 | **Inadequate Privacy Controls** | PII/PHI leaks, RGPD violations |
| M7 | **Insufficient Binary Protections** | Reverse engineering of health app logic |
| M8 | **Security Misconfiguration** | Debug flags, insecure defaults |
| M9 | **Insecure Data Storage** | Local health data exposure, Keychain/Keystore misuse |
| M10 | **Insufficient Cryptography** | Weak encryption of patient records |

**Real-world healthcare vulnerability (2025):** Multiple vulnerabilities were identified in the Dario Health blood glucose monitoring Android app. Exploitation could allow attackers to access private PII, manipulate data, inject code, or achieve XSS resulting in leak of private health information.

Sources:
- [OWASP Mobile Top 10 Official](https://owasp.org/www-project-mobile-top-10/)
- [Strobes - OWASP Mobile Top 10 2025 Updated](https://strobes.co/blog/owasp-mobile-top-10-vulnerabilities-2024-updated/)
- [Guardsquare - Revisiting OWASP Mobile Top 10](https://www.guardsquare.com/blog/revisiting-owasp-mobile-top-10)
- [NowSecure - OWASP AI/LLM Top 10 for Mobile](https://www.nowsecure.com/blog/2025/11/05/the-owasp-ai-llm-top-10-understanding-security-and-privacy-risks-in-ai-powered-mobile-applications/)

---

## 2. Pro Sante Connect (PSC) Technical Integration

### Overview

Pro Sante Connect (PSC) is the national identity provider federation for healthcare professionals in France, operated by the Agence du Numerique en Sante (ANS). It relies on OpenID Connect (OIDC) as its core protocol.

### OpenID Connect Implementation

**Protocol:** OpenID Connect (OIDC) - an identification layer built on top of OAuth 2.0.

**Authentication flow:**
1. User initiates authentication via e-CPS mobile app or physical CPS card
2. PSC acts as the OpenID Provider (OP)
3. Service Provider (SP) receives an authentication assertion containing standard identity traits plus sector-specific information (profession, expertise, practice situation)
4. The SP manages access control based on returned claims

**Token specifications:**
- Asymmetric encryption with 2048-bit RSA key
- Encryption algorithm: RSA SHA-256
- Tokens contain standard OIDC claims plus healthcare-specific claims

### Major 2026 Evolution: Pro Sante Identite (PSI)

Starting early 2026, PSC tokens are evolving:
- The `sub` field will become a **non-business technical identifier** (no longer carrying RPPS meaning)
- A new field `PSISubjectNameID` will be introduced:
  - Contains the PSI functional identifier in UUID format (for users who activated PSI)
  - Empty for users who have not yet activated their PSI identity
- **Action required:** All integrated services must update their token parsing logic

### RPPS Integration

- Identities come from the Health Directory (Annuaire Sante), fed by **RPPS** and **FINESS** repositories
- Each professional has a unique national identifier: `idNat_PS`
- Format: 8 digits + RPPS number (11 non-significant characters: 10-character order number + 1 Luhn check digit)
- RPPS is the permanent unique identifier for all healthcare professionals

### e-CPS Authentication

- e-CPS is the mobile application (available on iOS/Android) enabling authentication
- Alternative to the physical CPS card
- Both methods are accepted by PSC as authentication credentials
- e-CPS provides two-factor authentication

### Trust Environment

- The trust environment registration window opened on 05/05/2025
- Service providers must submit evidence to connect to the PSC Trust Environment
- Technical documentation available at https://tech.esante.gouv.fr/

### Technical Documentation Endpoints

- Technical docs: https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique
- API reference: https://api.gouv.fr/les-api/api-pro-sante-connect
- Doctrine reference: https://esante.gouv.fr/doctrine/pro-sante-connect-igc-sante

Sources:
- [ANS - Documentation technique PSC](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique)
- [ANS - Pro Sante Connect](https://esante.gouv.fr/produits-services/pro-sante-connect)
- [Doctrine Numerique Sante 2025 - PSC et iGC Sante](https://esante.gouv.fr/doctrine/pro-sante-connect-igc-sante)
- [LemonLDAP PSC Documentation](https://lemonldap-ng.org/documentation/2.0/authopenidconnect_prosanteconnect.html)
- [API Pro Sante Connect - data.gouv.fr](https://www.data.gouv.fr/dataservices/api-pro-sante-connect)
- [API Pro Sante Connect - api.gouv.fr](https://api.gouv.fr/les-api/api-pro-sante-connect)
- [G_NIUS - PSC Regulation Profile](https://gnius.esante.gouv.fr/en/regulations/regulation-profiles/pro-sante-connect)
- [Hospitalia - PSC Evolutions](https://www.hospitalia.fr/Avec-les-evolutions-de-Pro-Sante-Connect-l-identification-electronique-des-professionnels-franchit-une-nouvelle-etape_a3193.html)
- [Legifrance - Arrete du 4 avril 2022](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000045551218)

---

## 3. Encryption Standards for Healthcare

### Data in Transit

| Standard | Requirement | Details |
|----------|-------------|---------|
| **TLS 1.3** | Mandatory | Required for all health data in transit. TLS 1.2 acceptable as minimum but 1.3 strongly recommended |
| **Certificate Pinning** | Recommended | Mobile apps must pin certificates to prevent MITM attacks |
| **mTLS** | Recommended for API-to-API | Mutual TLS for backend service communication |
| **Perfect Forward Secrecy** | Required | Ensures past sessions cannot be decrypted if long-term keys are compromised |

### Data at Rest

| Standard | Requirement | Details |
|----------|-------------|---------|
| **AES-256** | Mandatory | Standard for encrypting health data at rest |
| **FIPS 140-2 Level 2** | Minimum certification | Level 3 recommended for higher-risk scenarios |
| **HSM** | Recommended | Hardware Security Modules for key management |
| **RSA-2048+** | Required | For key exchanges; RSA-4096 recommended |

### Key Management

- Centralized key management using HSMs (Hardware Security Modules)
- Regular key rotation policies
- Separation of key management from data storage
- FIPS 140-2 Level 2 minimum certification for key management systems

### Emerging Technologies (2026)

- **Homomorphic encryption** gaining traction - enables analysis of encrypted data without decryption, promising for RGPD/GDPR compliance
- **Post-quantum cryptography** considerations beginning for long-term health data protection
- EdDSA emerging as the newest and most secure signing algorithm with quantum-resistant properties

### ANSSI Recommendations for Cryptography

- ANSSI publishes specific cryptographic algorithm recommendations
- AES-256 for symmetric encryption
- RSA-2048 minimum (4096 recommended) or ECDSA for asymmetric encryption
- SHA-256 minimum for hashing

Sources:
- [Censinet - HIPAA Encryption Protocols 2025](https://censinet.com/perspectives/hipaa-encryption-protocols-2025-updates)
- [Healthcare Data Privacy: 2026 Advancements](https://cybernews.com/hosting-hub/healthcare-data-privacy-advancements-and-new-tech-standards/)
- [HIPAA Encryption Requirements 2026 Update](https://www.hipaajournal.com/hipaa-encryption-requirements/)
- [Guide to Encryption for International Healthcare Compliance](https://censinet.com/perspectives/guide-encryption-international-healthcare-compliance)
- [Healthcare Data Encryption Standards Guide](https://mind-core.com/blogs/healthcare-data-encryption-standards-guide/)

---

## 4. WAF (Web Application Firewall) for Healthcare

### Solution Comparison for Healthcare APIs

| Solution | Type | Healthcare Suitability | Notes |
|----------|------|----------------------|-------|
| **ModSecurity** | Open-source | Good for on-premise HDS | Reached End-of-Life July 2024; OWASP CRS updated 2024 |
| **AWS WAF** | Cloud-managed | Excellent for AWS-hosted HDS | Managed rulesets + paid vendor rulesets (F5) |
| **Cloudflare WAF** | Cloud-managed | Good for edge protection | Bot management + DDoS protection included |
| **open-appsec** | AI-based | Emerging | Machine learning-based threat detection |

### ModSecurity Status (2025-2026)

- **End-of-Life reached July 2024** - no longer actively maintained
- OWASP Core Rule Set (CRS) received a major update in 2024
- CRS 2024 update improved Security Quality but decreased Detection Quality
- Migration path: Consider Coraza (Go-based ModSecurity replacement) or cloud WAF solutions

### Healthcare API-Specific WAF Rules

Key protections needed for health APIs:
1. **Rate limiting** on authentication endpoints (PSC callback, login)
2. **Request body inspection** for injection attempts in patient data fields
3. **API schema validation** to block malformed requests
4. **Geographic restrictions** where applicable (EEA data residency)
5. **Bot detection** to prevent automated scraping of health data
6. **Custom rules** for FHIR/HL7 API endpoints

### 2025-2026 Trends

- WAFs evolving toward **WAAP** (Web Application and API Protection) - broader scope
- API security, AI analytics, and cloud-native delivery are leading differentiators
- HIPAA guidance (late 2025) explicitly requires healthcare organizations to maintain **complete API inventories** and monitor for data exposure risks
- Traditional WAFs lack context about normal vs. suspicious API call patterns; context-aware WAFs emerging

### Recommended Architecture for Healthcare

```
Client -> CDN/Edge WAF (Cloudflare/AWS CloudFront)
       -> API Gateway (rate limiting, auth validation)
       -> Application WAF (OWASP CRS rules)
       -> Backend API (health data processing)
```

Sources:
- [OWASP ModSecurity Project](https://modsecurity.org/)
- [Best WAF Solutions 2024-2025 Comparison](https://www.openappsec.io/post/best-waf-solutions-in-2024-2025-real-world-comparison)
- [WAAP vs WAF 2026](https://www.glesec.com/waap-vs-waf/)
- [Sesame Disk - ModSecurity vs Cloudflare vs AWS WAF](https://sesamedisk.com/web-application-firewalls-modsecurity-cloudflare-aws-waf/)
- [GitHub - OWASP ModSecurity](https://github.com/owasp-modsecurity/ModSecurity)

---

## 5. SIEM and Monitoring for Healthcare

### Recommended Stack: Wazuh + ELK

**Wazuh** is the leading open-source SIEM/XDR platform for healthcare, offering:
- Host-based intrusion detection (HIDS)
- File integrity monitoring (FIM)
- Vulnerability assessment
- Regulatory compliance dashboards (GDPR, HIPAA, PCI-DSS)
- Log analysis and correlation

**ELK Stack Integration:**
- **Elasticsearch**: Index and search security events
- **Logstash**: Log collection and normalization
- **Kibana**: Visualization and compliance dashboards
- Wazuh integrates natively with the Elastic Stack

### Architecture for Healthcare Monitoring

```
Health App Servers -> Wazuh Agents (log collection, FIM, vulnerability scan)
Network Devices   -> Suricata (network IDS) -> Wazuh Manager
Cloud Services    -> Wazuh Cloud Connectors
                              |
                     Wazuh Manager (correlation, alerting)
                              |
                     ELK Stack (indexing, visualization)
                              |
                     Compliance Dashboards (RGPD, HDS, PGSSI-S)
```

### Key Monitoring Requirements for Healthcare Compliance

| Requirement | Tool/Feature | Standard |
|-------------|-------------|----------|
| **Access logging** | Wazuh + ELK | HDS, RGPD, PGSSI-S |
| **File integrity monitoring** | Wazuh FIM | HDS v2 |
| **Intrusion detection** | Wazuh HIDS + Suricata NIDS | ANSSI |
| **Vulnerability scanning** | Wazuh vulnerability detector | HDS v2, NIS2 |
| **Compliance reporting** | Wazuh compliance module | RGPD, HDS |
| **Real-time alerting** | Wazuh alerting + Kibana | Incident response 24h |
| **Audit trail** | ELK long-term storage | CNIL, HDS |

### Alternative Solutions

| Solution | Type | Healthcare Use Case |
|----------|------|-------------------|
| **Wazuh + ELK** | Open-source | Full SIEM/XDR, compliance monitoring |
| **Datadog** | SaaS | Cloud-native monitoring, APM, log management |
| **Splunk** | Enterprise | Advanced analytics, large-scale deployments |
| **Elastic Security** | Commercial | Enhanced ML-based threat detection |

### Healthcare-Specific Monitoring Rules

1. **Unauthorized access attempts** to patient records
2. **Unusual data export patterns** (bulk download detection)
3. **Off-hours access** to sensitive health data
4. **Failed authentication patterns** on PSC-integrated endpoints
5. **Configuration changes** to security controls
6. **API abuse detection** (rate anomalies, unusual endpoints)

Sources:
- [Wazuh Official - SIEM Platform](https://wazuh.com/platform/siem/)
- [Wazuh for Regulatory Compliance](https://thehackernews.com/2025/08/wazuh-for-regulatory-compliance.html)
- [CyberProof - SIEM for Healthcare CISO Guide 2025](https://www.cyberproof.com/siem/siem-for-healthcare-a-cisos-2025-guide-to-ensuring-compliance-security/)
- [GitHub - Wazuh](https://github.com/wazuh/wazuh)
- [Elastic Blog - Wazuh and IDS Integration](https://www.elastic.co/blog/improve-security-analytics-with-the-elastic-stack-wazuh-and-ids)
- [Wazuh - Elastic Stack Integration](https://wazuh.com/blog/detection-with-elastic-stack-integration/)

---

## 6. ANSSI Security Recommendations

### ANSSI Strategic Plan 2025-2027

ANSSI's plan "Au coeur d'un collectif pour une Nation cyber-resiliente" focuses on five missions:
1. **Defendre** (Defend) - Incident response and crisis management
2. **Connaitre** (Know) - Threat intelligence and situational awareness
3. **Partager** (Share) - Information sharing across sectors
4. **Accompagner** (Support) - Guidance for organizations
5. **Reguler** (Regulate) - Compliance enforcement including NIS2

### SecNumCloud Qualification

- **Current version:** SecNumCloud 3.2
- **Validity:** 3-year renewable visa
- **Key requirements:**
  - Data localization within the European Union
  - European law entity (no US Cloud Act exposure)
  - Personnel administration from within the EU
  - Documented and contractually limited subcontracting
  - Strict RGPD compliance
- **Healthcare relevance:** Increasingly required in public tenders for healthcare, defense, and critical infrastructure
- **Qualified providers (2025):** OVHcloud, 3DS Outscale, Scaleway (in process), S3NS

### PGSSI-S (Politique Generale de Securite des Systemes d'Information de Sante)

The PGSSI-S is the security framework for all French health information systems:

**Document corpus includes:**
- Security referentials and standards
- Organization guides
- Communication guides
- Implementation aids
- Technical documents

**Scope:** Public and private sectors, healthcare professionals, medico-social and social sectors, care establishments, and service providers.

**Key principles:**
- Two-factor authentication mandatory (via PSC/e-CPS)
- Data encryption at rest and in transit
- Access control based on professional identity
- Audit trail requirements
- Regular security assessments

### NIS2 Directive - France Transposition

**Status (Feb 2026):** France is finalizing the "Loi relative a la resilience des infrastructures critiques et au renforcement de la cybersecurite." Full entry into force expected early-to-mid 2026.

**Healthcare entities covered:**
- Hospitals
- Healthcare providers
- EU reference laboratories
- Pharmaceutical manufacturers
- Medical device manufacturers

**Key obligations:**
- Technical and organizational cybersecurity measures
- Multi-factor authentication or continuous authentication
- Cryptography and encryption policies
- Management body accountability for cybersecurity strategy
- Incident reporting obligations

**Penalties:**
- Essential entities: up to 10M EUR or 2% global revenue
- Important entities: up to 7M EUR or 1.4% global revenue

### CaRE Program (Cybersecurite acceleration et Resilience des Etablissements)

National program including:
- **HospiConnect** - Healthcare facility cybersecurity connectivity
- Funding for cybersecurity improvements in health establishments
- Between 2022-2023, 86% of incidents reported to ANSSI concerned health establishments
- Incident rate increased from 2.87% (2020) to 11.4% (2023)

Sources:
- [Doctrine Numerique Sante 2025 - Regles de securite](https://esante.gouv.fr/doctrine/securite)
- [ANSSI Publication - Etat des menaces secteur sante](https://industriels.esante.gouv.fr/actualites/publication-ANSSI-7-novembre-etat-menaces-cyber-secteur-sante)
- [ANSSI Plan Strategique 2025-2027](https://www.avocats-mathias.com/cybersecurite/cybersecurite-et-cyber-resilience-le-plan-strategique-2025-2027-de-lanssi)
- [CERT-FR - Secteur de la sante](https://www.cert.ssi.gouv.fr/cti/CERTFR-2024-CTI-010/)
- [ANSSI Official](https://cyber.gouv.fr/)
- [Scalingo - SecNumCloud Guide](https://scalingo.com/blog/secnumcloud-qualification-anssi-guide)
- [OVHcloud - SecNumCloud](https://www.ovhcloud.com/en/compliance/secnumcloud/)
- [NIS2 Directive - France Implementation](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive-france)
- [NIS2 France Timelines and Fines](https://copla.com/blog/compliance-regulations/nis2-directive-regulations-and-implementation-in-france/)
- [PGSSI-S Official](https://esante.gouv.fr/produits-services/pgssi-s)
- [PGSSI-S Corpus Documentaire](https://esante.gouv.fr/produits-services/pgssi-s/corpus-documentaire)
- [G_NIUS - PGSSI-S](https://gnius.esante.gouv.fr/en/regulations/regulation-profiles/general-health-information-systems-security-policy-pgssi-s)
- [CaRE Program](https://esante.gouv.fr/strategie-nationale/cybersecurite)

---

## 7. RBAC (Role-Based Access Control)

### Healthcare RBAC Patterns

#### Standard Healthcare Roles for a Physiotherapy Application

| Role | Permissions | RBAC Pattern |
|------|------------|-------------|
| **Physiotherapist (Kine titulaire)** | Full patient management, appointments, billing, medical notes | Base clinical role |
| **Replacement Physiotherapist (Kine remplacant)** | Limited patient access (assigned patients only), temporary permissions, time-bounded access | Delegated role with constraints |
| **Administrator** | User management, system configuration, billing oversight, reporting | Administrative superrole |
| **Clinic Owner (Titulaire de cabinet)** | All physio permissions + practice management, staff management, financial reporting | Hierarchical role extension |
| **Secretary/Receptionist** | Appointment scheduling, patient registration, basic contact info (no medical data) | Minimal privilege role |

#### RBAC Design Principles for Healthcare

1. **Principle of Least Privilege:** Each role gets minimum permissions needed
2. **Separation of Duties:** Clinical data access separate from administrative functions
3. **Time-bounded access:** Replacement physios get access only for their replacement period
4. **Context-aware access:** Location/IP-based restrictions where applicable
5. **Emergency access ("break the glass"):** Documented override mechanism with audit trail

#### Hybrid RBAC + ABAC Model (2025 Best Practice)

The emerging best practice combines:
- **RBAC for coarse-grained baseline permissions** (role assignment)
- **ABAC for fine-grained, dynamic controls** (contextual decisions)

Example attributes for ABAC overlay:
- Time of day / working hours
- Patient-professional relationship (assigned patients only)
- Location (clinic IP range)
- Device status (compliant device)
- Data sensitivity level

#### Implementation Pattern

```
User -> PSC Authentication (identity + profession)
     -> Role Assignment (based on profession, practice context)
     -> Permission Check (RBAC base permissions)
     -> Attribute Check (ABAC contextual rules)
     -> Data Access (filtered by role + attributes)
     -> Audit Log (all access recorded)
```

### Key Security Considerations

- **Grant delegation:** Mechanism for a titulaire to delegate specific permissions to a remplacant
- **Interdomain access control:** When a physio works across multiple clinics
- **AI-driven anomaly detection:** Emerging in 2025-2026 to identify unusual access patterns
- RBAC facilitates compliance with RGPD by providing auditable access controls and ensuring segregation of duties

Sources:
- [PMC - Health Information System RBAC Security Trends](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836325/)
- [MDPI - Unified RBAC and ABAC Risk-Aware Access Control](https://www.mdpi.com/1999-5903/17/6/262)
- [Oso - RBAC Examples](https://www.osohq.com/learn/rbac-examples)
- [Enter Health - RBAC in Healthcare RCM](https://www.enter.health/post/role-based-access-control-healthcare-rcm)
- [Cabot Solutions - RBAC for Healthcare SaaS](https://www.cabotsolutions.com/blog/role-based-access-control-rbac-for-secure-healthcare-saas-applications)
- [Censinet - Role-Based Controls for Patient Data](https://www.censinet.com/perspectives/how-role-based-controls-protect-patient-data)
- [Concentric AI - RBAC 2026 Guide](https://concentric.ai/how-role-based-access-control-rbac-helps-data-security-governance/)

---

## 8. Incident Response Plan 24h

### Regulatory Framework

#### Directive Sante Numerique (DSN) 2025

- **Transposed into French law since March 2025**
- Notification deadline to affected persons: **reduced to 24 hours** (previously 72 hours)
- Establishes **"liability by default"**: burden of proof on the data controller to demonstrate all appropriate technical and organizational measures were implemented

#### CNIL Notification Process

| Timeframe | Action | Channel |
|-----------|--------|---------|
| **Within 24 hours** | Initial notification to affected persons | Direct communication |
| **Within 72 hours** | Full notification to CNIL | Dedicated CNIL teleservice (online) |
| **Ongoing** | Supplementary information as available | CNIL teleservice updates |

#### Healthcare-Specific Reporting

Healthcare institutions must report to **multiple authorities** simultaneously:

1. **CNIL** - Personal data breach notification (72h)
2. **ARS (Agence Regionale de Sante)** - Healthcare incident reporting
3. **ANSSI/CERT-FR** - Cybersecurity incident (for NIS2-covered entities)
4. **Affected individuals** - Direct notification (24h under DSN)

#### Reportable Incidents

Healthcare establishments must report incidents that:
- Have potential or proven consequences for **safety of care**
- Affect **confidentiality or integrity** of health data
- Constitute a **significant or serious security incident**
- Are "exceptional situations"

### Incident Response Procedure

#### Phase 1: Detection & Triage (0-1h)
1. Detect incident via SIEM/monitoring (Wazuh alerts)
2. Assess severity and scope
3. Activate incident response team
4. Isolate affected systems if necessary

#### Phase 2: Notification (1-24h)
1. **Within 24h:** Notify affected persons (DSN requirement)
2. Prepare CNIL notification
3. Notify ARS if healthcare safety is impacted
4. Document all actions taken

#### Phase 3: Full Reporting (24-72h)
1. Submit formal CNIL notification via teleservice
2. Submit ANSSI/CERT-FR report if applicable
3. Provide detailed impact assessment
4. Document containment measures

#### Phase 4: Remediation & Recovery
1. Eradicate threat
2. Restore systems from verified backups
3. Implement additional controls
4. Conduct post-incident review

### CNIL Expanded Powers (2024-2025)

- Powers expanded by the digital modernization law of November 2024
- CNIL is the **primary institutional contact** for medical data violations
- New sanctions framework under simplified procedure (2025)
- CNIL 2025-2028 roadmap places health data as a priority focus area

Sources:
- [CNIL - Notifications d'incidents de securite](https://www.cnil.fr/fr/notifications-dincidents-de-securite-aux-autorites-de-regulation-comment-sorganiser-et-qui-sadresser)
- [MedTech France - CNIL Feuille de route 2025-2028 Sante](https://www.medtechfrance.fr/reglementation-et-financement/cadre-legislatif-et-normes/regulation-numerique-ce-que-la-feuille-de-route-2025-2028-de-la-cnil-change-pour-la-sante/)
- [Baker McKenzie - France Security Requirements and Breach Notification](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/emea/france/topics/security-requirements-and-breach-notification)
- [Juridique Lab - Donnees medicales compromises 2025](https://www.juridique-lab.fr/donnees-medicales-compromises-nouveaux-recours-juridiques-en-2025/)
- [CNIL - Sante](https://www.cnil.fr/fr/sante)
- [CIDFP - CNIL RGPD ANSSI Obligations 2025](https://www.cidfp.fr/cnil-rgpd-anssi-les-obligations-incontournables-pour-les-entreprises-en-2025/)

---

## 9. Security Audit and Penetration Testing

### HDS v2 Certification Requirements (2025-2026)

**Timeline:**
- HDS v2 in force since May 16, 2024
- Transition deadline: **May 16, 2026** for existing HDS v1 certified organizations
- New certifications from November 16, 2024 must be HDS v2

**Structure changes:**
- Reduced from 44 to 31 requirements
- Integrated with ISO 27001 (2023 version)
- Removed references to ISO 20000-1, ISO 27017, ISO 27018
- Relies on ISO/IEC 17021-1:2015 for conformity assessment

**Key HDS v2 requirements:**
- Physical hosting exclusively within the **European Economic Area (EEA)**
- Enhanced risk management (loss of control over storage media, data compromise)
- Crisis management processes for security incidents
- Continuous monitoring and management of security objectives
- Systematic evaluation of process effectiveness
- **Regular audits** to verify traceability logs are complete and intact

### PASSI Audit (Prestataire d'Audit de Securite des Systemes d'Information)

PASSI is the ANSSI-qualified audit framework for information security:

**Audit types:**
| Type | Description | Use Case |
|------|-------------|----------|
| **Black Box** | Penetration testing on a given target with no prior knowledge | External attack simulation |
| **Gray Box** | Auditors have standard user knowledge | Insider threat simulation |
| **White Box** | Auditors have full technical information | Comprehensive architecture review |

**PASSI audit scope for healthcare apps:**
- Web application penetration testing
- Mobile application security assessment
- API security testing
- Infrastructure security audit
- Configuration review
- Source code audit

### Penetration Testing Requirements

- Penetration testing by a **PASSI-qualified provider** is required to verify no major vulnerabilities
- Testing should cover:
  - OWASP Top 10 2025 vulnerabilities
  - OWASP Mobile Top 10 for mobile apps
  - Authentication flows (PSC integration)
  - Authorization bypass attempts (RBAC testing)
  - Data exposure through APIs
  - Encryption validation

### Bug Bounty Programs

- **Hackgate** - French platform for managing bug bounty programs and penetration tests
- **YesWeHack** - European bug bounty platform (headquartered in France)
- Growing adoption in French healthtech sector
- Recommended as complement to periodic PASSI audits for continuous security testing

### Audit Cadence Recommendations

| Activity | Frequency | Standard |
|----------|-----------|----------|
| PASSI penetration test | Annual minimum | HDS v2 |
| Vulnerability scanning | Monthly | PGSSI-S |
| Configuration audit | Quarterly | ISO 27001 |
| Compliance audit | Annual | HDS, RGPD |
| Bug bounty | Continuous | Best practice |
| Internal security review | Quarterly | PGSSI-S |

Sources:
- [Schellman - HDS Version 2 Key Considerations](https://www.schellman.com/blog/healthcare-compliance/key-considerations-for-complying-with-hds-version-2)
- [RiskInsight Wavestone - Evolution of HDS Framework](https://www.riskinsight-wavestone.com/en/2025/05/evolution-of-the-hds-framework-towards-enhanced-security-and-sovereignty/)
- [Qualysec - HDS Certification Requirements](https://qualysec.com/hds-certification-requirements/)
- [AFNOR - Certification HDS](https://certification.afnor.org/en/digital/hds-certification)
- [Ziwit - PASSI Certified Audit](https://www.ziwit.com/en/passi-audit)
- [HTTPCS - PASSI Qualification](https://blog.httpcs.com/en/passi-qualification/)
- [Le Monde Informatique - Hackgate Bug Bounty](https://www.lemondeinformatique.fr/actualites/lire-hackgate-une-plateforme-pour-gerer-les-bug-bounty-et-les-pen-test-90997.html)
- [Squad Group - HDS Normes et Conformite](https://www.squadgroup.com/fr/news/2025/2/13/hebergement-de-donnees-de-sante-normes-conformite-et-defis-de-la-certifications-2024/)

---

## 10. JWT vs Session-Based Authentication

### Recommendation for Healthcare APIs with PSC

**Best practice:** Use a **hybrid approach** - PSC/OpenID Connect for identity federation with server-side sessions for state management.

### JWT Considerations

| Aspect | JWT | Server-Side Sessions |
|--------|-----|---------------------|
| **Statelessness** | Stateless - no server storage | Requires session store (Redis/DB) |
| **Revocation** | Difficult - requires blocklist | Immediate - delete session |
| **Size** | Larger (contains claims) | Small cookie/token |
| **Scalability** | Better for microservices | Requires shared session store |
| **Security for healthcare** | Risk of token theft, hard to revoke | Better control, immediate revocation |

### Key Warning

**JWTs should NOT be used as session replacement in healthcare applications.** JWTs were designed for authorization delegation, not session management. Using JWTs for sessions can lower application security because:
- Cannot be revoked before expiry without maintaining a blocklist (defeats statelessness)
- Larger attack surface (token stored client-side)
- Risk of sensitive claims exposure if not encrypted

### Recommended Architecture for Healthcare

```
1. PSC Authentication (OpenID Connect)
   -> Receive ID Token + Access Token (JWT format, signed RSA-256)
   -> Validate JWT signature against PSC JWKS endpoint
   -> Extract user identity claims (RPPS, profession, etc.)

2. Session Creation
   -> Create server-side session (Redis/database)
   -> Issue HTTP-only, Secure, SameSite cookie
   -> Store PSC claims and RBAC permissions in session

3. API Authentication
   -> Validate session cookie on each request
   -> For service-to-service: short-lived JWTs (5 min max)
   -> Refresh PSC tokens as needed via refresh token flow

4. Token Specifications
   -> PSC tokens: RSA SHA-256, 2048-bit key
   -> Internal JWTs: EdDSA or ES256 recommended for new implementations
   -> Access tokens: 5-15 minute lifetime
   -> Refresh tokens: Rotate on each use, stored server-side
```

### PSC Token Evolution (2026)

- `sub` field becoming non-business technical identifier
- New `PSISubjectNameID` field (UUID format)
- Applications must update token parsing logic
- Asymmetric signing: RS256 (current PSC standard)

### Security Best Practices

1. **Always fully validate JWTs** - signature, issuer (`iss`), audience (`aud`), expiration (`exp`)
2. **Use short-lived tokens** (5-15 minutes for access tokens)
3. **Use asymmetric signing keys** (RS256 minimum, ES256 or EdDSA preferred)
4. **Centralized key management** for signing keys
5. **Never store sensitive health data** in JWT claims
6. **Implement token binding** where possible
7. **Use PKCE** (Proof Key for Code Exchange) with PSC authorization code flow

Sources:
- [LemonLDAP - PSC OpenID Connect Documentation](https://lemonldap-ng.org/documentation/2.0/authopenidconnect_prosanteconnect.html)
- [ANS - PSC Documentation technique](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique)
- [Curity - JWT Security Best Practices](https://curity.io/resources/learn/jwt-best-practices/)
- [WellAlly - Securing HealthTech APIs: OAuth 2.0, mTLS, Rate Limiting](https://www.wellally.tech/blog/healthtech-api-security-oauth-mtls)
- [LogRocket - JWT Authentication Best Practices](https://blog.logrocket.com/jwt-authentication-best-practices/)
- [JWT.app - JWT Security Best Practices 2025](https://jwt.app/blog/jwt-best-practices/)
- [TechLasi - API Authentication Best Practices 2025](https://techlasi.com/savvy/best-practices-for-secure-api-authentication/)

---

## 11. RGPD Technical Implementation

### Consent Management

#### CNIL Requirements for Mobile Health Apps (2024-2025)

- **CNIL recommendation published September 2024, updated April 2025**
- Enforcement campaign started **spring 2025** targeting mobile applications
- Scope: App editors, developers, SDK providers, OS providers

**Consent requirements:**
1. Explicit agreement required when collecting health data
2. Consent must specifically concern the principle of health data collection
3. Consent must not be coerced
4. Users must be able to refuse or withdraw consent as easily as giving it
5. Consent not required for data necessary for app functioning (but required for advertising, analytics)

**SDK governance:**
- SDK provider qualified as sub-processor when processing personal data on behalf of app editor
- App editor is the sole data controller
- SDK provider has no independent purposes
- All SDK data processing must be documented

#### Implementation Pattern

```
Consent Flow:
1. First launch -> Privacy notice (clear, accessible language)
2. Granular consent options:
   - Essential (no consent needed - legitimate interest)
   - Health data collection (explicit consent required)
   - Analytics SDK (consent required)
   - Push notifications (consent required)
3. Consent stored with timestamp, version, scope
4. Consent withdrawal available in settings (same ease as granting)
5. Consent refresh on privacy policy changes
```

### Data Anonymization and Pseudonymization

#### EDPB Guidelines 01/2025 on Pseudonymisation

Published January 2025, these provide the current authoritative guidance:

**Three-step pseudonymization process:**
1. **Transform** the data (replace identifiers with pseudonyms)
2. **Store mapping information separately** (secure, access-controlled)
3. **Restrict access** to mapping data

**Required techniques:**
- Simple hashing is **insufficient** without domain management or separation
- Recommended: **Combined use of salting, asymmetric encryption, and access control**
- Techniques include tokenization, hashing with salt, deterministic coding
- Regular method updates required (documented and auditable)

**Governance:**
- Define who can access pseudonymized data, under what conditions, with what limitations
- Implement regular RGPD audits
- Maintain transparent documentation (register of processing, DPIAs)
- Systematic data minimization policies

#### Anonymization vs Pseudonymization Decision Matrix

| Criterion | Anonymization | Pseudonymization |
|-----------|--------------|-----------------|
| **RGPD scope** | Outside RGPD | Still personal data |
| **Reversibility** | Irreversible | Reversible with key |
| **Use case** | Statistics, public reporting | Research, longitudinal studies |
| **Healthcare utility** | Limited (no re-identification) | High (patient follow-up possible) |
| **Recommended for** | Aggregate analytics | Patient data processing |

### Right to Erasure (Droit a l'effacement)

**Implementation requirements:**
1. Provide clear mechanism in app for erasure requests
2. Erase data from all systems including backups (or mark for deletion on backup rotation)
3. Propagate deletion to all sub-processors
4. Exceptions: legal retention obligations (e.g., medical records 20 years in France)
5. Document all erasure actions
6. Response deadline: 1 month (extendable by 2 months for complex cases)

### Privacy by Design Patterns

1. **Data minimization:** Collect only what is strictly necessary
2. **Purpose limitation:** Each data element tied to a specific purpose
3. **Storage limitation:** Define and enforce retention periods
4. **Integrity and confidentiality:** Encryption, access controls
5. **Privacy by default:** Most restrictive settings as default
6. **Transparency:** Clear privacy notices, accessible data processing information

### Health Data Specific RGPD Obligations

- Health data is a **special category** under RGPD Article 9
- Processing requires one of the derogations in Article 9(2)
- For health apps: typically explicit consent (9(2)(a)) or healthcare provision (9(2)(h))
- Data Protection Impact Assessment (DPIA) **mandatory** for large-scale health data processing
- Data Protection Officer (DPO) appointment recommended for health data processing at scale

Sources:
- [CNIL - Applications mobiles en sante et protection des donnees](https://www.cnil.fr/fr/applications-mobiles-en-sante-et-protection-des-donnees-personnelles-les-questions-se-poser)
- [CNIL - Recommandations applications mobiles](https://www.cnil.fr/fr/recommandations-applications-mobiles)
- [CNIL - Le RGPD applique au secteur de la sante](https://www.cnil.fr/fr/le-rgpd-applique-au-secteur-de-la-sante)
- [CNIL - Controles 2025](https://www.cnil.fr/fr/les-controles-de-la-cnil-en-2025)
- [Didomi - Mobile App Compliance 2025](https://www.didomi.io/blog/mobile-app-compliance-2025)
- [EDPB - Guidelines 01/2025 on Pseudonymisation](https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf)
- [Aumans Avocats - EDPB Pseudonymisation and Anonymization](https://aumans-avocats.com/en/pseudonymisation-and-anonymization-of-health-data-what-are-the-consequences-of-the-edpbs-new-guidelines/)
- [Collectiveminds - GDPR Pseudonymization and Anonymization](https://collectiveminds.health/articles/pseudonymization-vs-anonymization-key-differences-for-gdpr-compliance)
- [Cranium - Donnees de sante et RGPD](https://www.cranium.eu/fr/le-guide-ultime-des-donnees-de-sante-et-du-rgpd/)
- [Leto Legal - RGPD et Sante](https://www.leto.legal/guides/rgpd-et-sante)
- [CNIL Recommendation PDF](https://www.cnil.fr/sites/cnil/files/2024-09/recommandation-applications-mobiles.pdf)

---

## 12. Mobile App Security

### Certificate Pinning

**Implementation:**
- Pin the certificate's public key (SPKI) rather than the full certificate
- Maintain backup pins for certificate rotation
- TLS 1.2 minimum, TLS 1.3 strongly recommended
- Implement pinning failure reporting

**Current state of health apps (2025):**
- Research found **22 apps configured to trust all TLS certificates**
- **42 apps** allowed unencrypted HTTP traffic
- **2 apps** explicitly disabled certificate pinning
- These findings highlight critical gaps in healthcare mobile app security

**Platform implementation:**
- **iOS:** Use `NSAppTransportSecurity` with `NSPinnedDomains` in Info.plist, or implement via `URLSessionDelegate`
- **Android:** Use Network Security Config with `<pin-set>`, or implement via OkHttp CertificatePinner
- **React Native / Flutter:** Use platform-specific plugins or native modules

### Jailbreak / Root Detection

**Detection mechanisms:**
- Check for jailbreak/root indicators (Cydia, Magisk, SuperSU)
- Verify file system integrity
- Check for common bypass tools (Frida, Xposed)
- Verify code signing integrity

**Response strategy for healthcare apps:**
1. Detect compromised environment
2. Alert user about security risks
3. Disable sensitive features (health data access)
4. Log the event for audit purposes
5. Optionally prevent app operation entirely

**Tools and libraries:**
- **iOS:** IOSSecuritySuite, proprietary checks
- **Android:** SafetyNet/Play Integrity API, rootbeer library
- **Cross-platform:** Approov, Guardsquare (DexGuard/iXGuard)

### Secure Storage

| Platform | Mechanism | Use Case |
|----------|----------|----------|
| **iOS Keychain** | Hardware-backed secure enclave | Tokens, credentials, encryption keys |
| **iOS Data Protection** | NSFileProtectionComplete | Encrypted files with passcode |
| **Android Keystore** | Hardware-backed TEE/SE | Cryptographic keys |
| **Android EncryptedSharedPreferences** | AES-256 encryption | Application secrets |
| **Biometric-gated access** | FaceID/TouchID, Fingerprint | Additional authentication layer |

**Best practices:**
- Use `NSFileProtectionComplete` (iOS) for health data files
- Use Android Keystore with AES-256 for all sensitive data
- Never store health data in UserDefaults (iOS) or SharedPreferences (Android) unencrypted
- Implement biometric authentication for accessing stored health data
- Clear sensitive data from memory after use

### Code Obfuscation

**Techniques:**
- **iOS:** Bitcode (deprecated in Xcode 16), Swift symbol stripping, commercial tools (iXGuard)
- **Android:** R8/ProGuard (default), DexGuard (commercial), string encryption
- **React Native:** Hermes bytecode (partial protection), react-native-obfuscating-transformer
- **Flutter:** Dart AOT compilation provides some protection, commercial obfuscators available

### Additional Mobile Security Measures

1. **App Attestation:** Verify app integrity at runtime
   - iOS: App Attest API
   - Android: Play Integrity API

2. **Anti-tampering:** Detect modifications to app binary

3. **Screen capture prevention:** Prevent screenshots of sensitive health data
   - iOS: `UITextField.isSecureTextEntry` pattern
   - Android: `FLAG_SECURE` window flag

4. **Clipboard protection:** Clear clipboard after timeout for sensitive data

5. **Debug detection:** Detect and prevent debugger attachment in production

6. **Zero Trust Architecture:** Treat every API call as potentially compromised
   - Mobile app attestation before granting API access
   - Continuous verification throughout session

### 2026 Mobile Health Security Priorities

- Mobile app attestation as **core product feature** (not afterthought)
- API protection integrated with mobile security
- Zero Trust principles applied to mobile-to-backend communication
- AI-powered runtime threat detection
- Shift from periodic penetration testing to continuous security assessment

Sources:
- [Approov - Secure Mobile Health App Success 2026](https://approov.io/blog/how-to-secure-mobile-health-app-success-in-2026)
- [Mobisoft - iOS App Security Checklist 2025](https://mobisoftinfotech.com/resources/blog/app-security/ios-app-security-checklist-best-practices)
- [ISITDev - Mobile App Security Best Practices 2025](https://isitdev.com/mobile-app-security-best-practices-2025-3/)
- [HIPAA Vault - Mobile Healthcare Security](https://www.hipaavault.com/resources/mobile-healthcare-security-for-ios-and-android-apps/)
- [Help Net Security - Mobile Health Apps Privacy Problems 2025](https://www.helpnetsecurity.com/2025/10/15/mobile-healthcare-apps-security-and-privacy-problems/)
- [Webshark - Mobile App Security Best Practices 2026](https://www.webshark.tech/blogs/mobile-app-security-best-practices-for-2026/)
- [AsApp Studio - App Security 2026](https://asappstudio.com/app-security-in-2026/)
- [Medium - Advanced iOS Runtime Security](https://medium.com/@mrhotfix/advanced-ios-runtime-security-ssl-pinning-obfuscation-and-anti-tampering-254acc9f7450)
- [Appknox - Bypass SSL Pinning iOS 2025](https://www.appknox.com/blog/bypass-ssl-pinning-in-ios-app)

---

## Summary: Key Regulatory Compliance Checklist for Healthcare App in France (2025-2026)

| Requirement | Standard/Framework | Deadline/Status |
|-------------|-------------------|-----------------|
| HDS v2 certification | ISO 27001 + HDS specific | May 16, 2026 transition deadline |
| PGSSI-S compliance | ANS security framework | Ongoing |
| PSC/e-CPS integration | OpenID Connect via PSC | Mandatory for health services |
| PSI token evolution | New PSC token format | Early 2026 |
| NIS2 transposition | EU directive -> French law | Expected mid-2026 |
| RGPD/health data compliance | CNIL guidelines | Ongoing, enforcement 2025+ |
| CNIL mobile app compliance | CNIL recommendation 2024/2025 | Enforcement started spring 2025 |
| Incident notification 24h | Directive Sante Numerique | Since March 2025 |
| ANSSI strategic alignment | Plan 2025-2027 | Ongoing |
| SecNumCloud for cloud hosting | ANSSI qualification v3.2 | Increasingly required in tenders |
| PASSI security audit | ANSSI-qualified audit | Annual minimum |
| EDPB pseudonymisation | Guidelines 01/2025 | January 2025 |

---

*Research compiled on 2026-02-24 from 15+ web searches covering French and international sources.*
