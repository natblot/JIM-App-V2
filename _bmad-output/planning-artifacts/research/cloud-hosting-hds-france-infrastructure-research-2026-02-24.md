# Cloud Hosting HDS France - Infrastructure Research Report

**Date:** 2026-02-24
**Status:** Comprehensive research - multi-source verified
**Scope:** HDS-certified cloud providers, Kubernetes, CDN DOM-TOM, pricing

---

## Table of Contents

1. [HDS 2.0 Certification Framework (New Requirements)](#1-hds-20-certification-framework)
2. [OVHcloud Healthcare/HDS](#2-ovhcloud-healthcarehds)
3. [Scaleway Health/HDS](#3-scaleway-healthhds)
4. [Microsoft Azure France](#4-microsoft-azure-france)
5. [AWS France (eu-west-3)](#5-aws-france-eu-west-3)
6. [Google Cloud France](#6-google-cloud-france)
7. [Outscale (Dassault Systemes)](#7-outscale-dassault-systemes)
8. [SecNumCloud vs HDS Comparison](#8-secnumcloud-vs-hds-comparison)
9. [Docker/Kubernetes on HDS Infrastructure](#9-dockerkubernetes-on-hds-infrastructure)
10. [CDN for DOM-TOM (French Overseas Territories)](#10-cdn-for-dom-tom)
11. [Pricing Comparison for Startup Healthcare App](#11-pricing-comparison)
12. [Sources](#12-sources)

---

## 1. HDS 2.0 Certification Framework

### Key Deadline: 16 May 2026

All existing HDS-certified providers must migrate to HDS v2.0 by **16 mai 2026**. New applicants since 16 November 2024 are already evaluated against v2.0.

### What Changed from HDS 1.0 to HDS 2.0

| Aspect | HDS 1.0 (2018) | HDS 2.0 (May 2024) |
|--------|----------------|---------------------|
| ISO alignment | ISO 27001:2013 | **ISO 27001:2022** (new controls) |
| Data location | Not explicitly restricted | **Mandatory EEA storage** (European Economic Area) |
| Sovereignty | Minimal requirements | **Transparency obligations** re: access from non-EU countries |
| Scope | 6 activity types | Clarified and restructured activities |
| Interoperability | Not addressed | **System interoperability encouraged/required** |
| Risk management | Basic | **Adapted to new digital contexts** + new cybersecurity controls |
| Contractual | Basic obligations | **Reinforced contractual obligations** |

### HDS 2.0 Core Requirements

- **ISO/IEC 27001:2022** represents approximately 80% of applicable HDS certification requirements
- Health data must be hosted on territory of an **EEA member country**
- Enhanced transparency for **international data transfers**
- Stronger coordination with international standards
- New technical requirements from ISO 27001:2022 including updated cybersecurity controls
- Encourages/imposes system **interoperability** to avoid data silos

### 6 Activities Covered by HDS Certification

1. Physical hosting of infrastructure
2. Physical hosting of health information systems
3. Virtual hosting of infrastructure
4. Virtual hosting of health information systems
5. Managed hosting of infrastructure
6. Managed hosting of health information systems

### Certification Bodies (Organismes de Certification)

Official list maintained by ANS (Agence du Numerique en Sante) at: https://esante.gouv.fr/offres-services/hds/liste-des-organismes-de-certification

**Sources:**
- [Nouvelle version du referentiel HDS - Economie.gouv.fr](https://presse.economie.gouv.fr/nouvelle-version-du-referentiel-de-certification-hds/)
- [ANS - Publication au Journal Officiel](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)
- [RiskInsight Wavestone - Evolution of HDS Framework](https://www.riskinsight-wavestone.com/en/2025/05/evolution-of-the-hds-framework-towards-enhanced-security-and-sovereignty/)
- [Schellman - New HDS Framework Explained](https://www.schellman.com/blog/compliance/new-hds-framework-2024)
- [AFNOR Certification HDS](https://certification.afnor.org/en/digital/hds-certification)

---

## 2. OVHcloud Healthcare/HDS

### HDS Certification Status

- **HDS certified since 2019** (initial approval 2016)
- Certifications held: ISO/IEC 27001, ISO 27701, SOC I & II, HDS
- Pursuing **SecNumCloud 3.2** qualification across Public Cloud portfolio (40+ products)
- Working toward HDS 2.0 compliance (deadline May 2026)

### Data Centers in France

- **GRA** (Gravelines) - Northern France, primary data center
- **SBG** (Strasbourg) - Eastern France
- **RBX** (Roubaix) - Northern France
- **LIM** (Limburg) - nearby, but Germany
- France Central region now offers **3 availability zones**

### HDS-Certified Products

Confirmed HDS-eligible OVHcloud services:
- **Public Cloud Instances** (compute VMs)
- **Dedicated Servers** (bare metal)
- **Hosted Private Cloud** (powered by VMware)
- **Managed Kubernetes Service (MKS)**
- **Cloud Databases** (PostgreSQL, MySQL, MongoDB, Valkey)
- **AI Training, ML Serving, Data Processing**
- **Object Storage, Block Storage**
- **Load Balancer**
- **Log management**
- **Managed Rancher Service**

### HDS Activation Requirements

To use OVHcloud services for healthcare data:
1. Subscribe to **Business or Enterprise support** (mandatory)
2. Accept the **OVHcloud Healthcare Addendum**
3. Business Support cost: **~10% of monthly bill, minimum ~EUR 300/month**

### Managed Kubernetes Service (MKS)

- **Control plane: FREE** (Free tier) or Standard Plan available
- Worker nodes billed at standard VM instance rate
- MKS Standard Kickstart: free for 1 month (first-time, before 22 June 2026)
- Plans: Free, Standard (with SLA guarantees)
- Supports HDS-compliant workloads when HDS addendum activated

### Compute Instance Pricing (Public Cloud - France Region)

| Instance | vCPU | RAM | Storage | EUR/hour | EUR/month |
|----------|------|-----|---------|----------|-----------|
| B3-8 | 2 | 8 GB | 50 GB SSD | 0.047 | 22.00 |
| B3-16 | 4 | 16 GB | 100 GB SSD | 0.093 | 44.00 |
| B3-32 | 8 | 32 GB | 200 GB SSD | 0.186 | 88.00 |
| B3-64 | 16 | 64 GB | 400 GB SSD | ~0.37 | ~176.00 |

*B3 = General Purpose (balanced CPU/RAM 4:1 ratio), AMD EPYC Milan processors*

### Managed Database PostgreSQL

- Billed hourly or monthly
- IOPS, backups, and traffic **included** in price
- Competitive pricing vs AWS/Azure/DigitalOcean (2025 benchmark)
- Exact pricing: visit https://www.ovhcloud.com/fr/public-cloud/prices/

### Key Advantages

- Predictable, transparent pricing (no egress fees for EU)
- Free incoming/outgoing data transfer (excluding APAC)
- French company, French data centers
- Broad HDS product coverage
- Free Kubernetes control plane

### Key Limitations

- Business/Enterprise support mandatory for HDS (adds ~EUR 300+/month)
- Less global reach than hyperscalers
- Fewer managed services than AWS/Azure/GCP

**Sources:**
- [OVHcloud Healthcare](https://www.ovhcloud.com/fr/healthcare/)
- [OVHcloud HDS Compliance](https://www.ovhcloud.com/en/compliance/hds/)
- [OVHcloud HDS Products](https://help.ovhcloud.com/csm/en-hds-certification?id=kb_article_view&sysparm_article=KB0061194)
- [OVHcloud HDS Activation](https://help.ovhcloud.com/csm/en-public-cloud-compute-enable-hds?id=kb_article_view&sysparm_article=KB0062394)
- [OVHcloud Kubernetes](https://www.ovhcloud.com/en/public-cloud/kubernetes/)
- [OVHcloud Kubernetes Plans](https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-mks-plans?id=kb_article_view&sysparm_article=KB0073776)
- [B3-8 Pricing - Cloud Mercato](https://pcr.cloud-mercato.com/providers/ovh/flavors/B3-8)

---

## 3. Scaleway Health/HDS

### HDS Certification Status

- **HDS certified since July 2024**
- **Object Storage HDS-certified since November 2025**
- ISO/IEC 27001:2022 certified
- **SecNumCloud qualification in progress** (J0 milestone January 2025, full certification expected end 2025/early 2026)
- No transfer of personal health data outside of France

### Data Centers

- **PAR1** (Paris, DC5) - Vitry-sur-Seine
- **PAR2** (Paris, DC3)
- **AMS1** (Amsterdam) - not HDS eligible
- **WAW1** (Warsaw) - not HDS eligible
- **HDS offers limited to French data centers only**

### HDS-Certified Products

- Virtual Instances (compute)
- Object Storage (since November 2025)
- Block Storage
- Kubernetes Kapsule
- Managed Databases (PostgreSQL, MySQL)
- Load Balancers

### Kubernetes Kapsule Pricing

| Plan | Memory | Replicas | Max Nodes | SLA | EUR/month |
|------|--------|----------|-----------|-----|-----------|
| Mutualized (Free) | Up to 4 GB | 1 | 150 | No | **FREE** |
| Dedicated-4 | 4 GB | 2 | 250 | 99.5% | **80.00** |
| Dedicated-8 | 8 GB | 2 | 500 | 99.5% | **131.00** |
| Dedicated-16 | 16 GB | 2 | 500 | 99.5% | **255.00** |

*Worker nodes billed at standard compute instance prices (see below)*

### Compute Instance Pricing

#### Development Instances (Shared vCPU)
| Instance | vCPU | RAM | EUR/month |
|----------|------|-----|-----------|
| STARDUST1-S | 1 | 1 GB | ~0.10 |
| DEV1-S | 2 | 2 GB | ~6.42 |
| DEV1-M | 3 | 4 GB | ~14.45 |
| DEV1-L | 4 | 8 GB | ~30.66 |
| DEV1-XL | 4 | 12 GB | ~46.57 |

#### General Purpose (Shared vCPU)
| Instance | vCPU | RAM | EUR/month |
|----------|------|-----|-----------|
| PLAY2-PICO | 1 | 2 GB | ~10.22 |
| PLAY2-NANO | 2 | 4 GB | ~19.71 |
| PLAY2-MICRO | 4 | 8 GB | ~39.42 |
| PRO2-XXS | 2 | 8 GB | ~40.15 |
| GP1-XS | 4 | 16 GB | ~66.43 |

#### General Purpose (Dedicated vCPU)
| Instance | vCPU | RAM | EUR/month |
|----------|------|-----|-----------|
| POP2-2C-8G | 2 | 8 GB | ~53.65 |
| POP2-4C-16G | 4 | 16 GB | ~107.31 |

*All prices include egress and IPv6. Storage and public IPv4 billed separately.*

### Managed Database PostgreSQL Pricing

#### Shared Resources
| Node Type | vCPU | RAM | EUR/month |
|-----------|------|-----|-----------|
| DB-PLAY2-PICO | 1 | 2 GB | 16.78 |
| DB-PLAY2-NANO | 2 | 4 GB | 31.10 |
| DB-PRO2-XXS | 2 | 8 GB | 79.20 |
| DB-PRO2-XS | 4 | 16 GB | 158.40 |

#### Dedicated vCPU
| Node Type | vCPU | RAM | EUR/month |
|-----------|------|-----|-----------|
| DB-POP2-2C-8G | 2 | 8 GB | 103.58 |
| DB-POP2-4C-16G | 4 | 16 GB | 207.16 |
| DB-POP2-8C-32G | 8 | 32 GB | 410.45 |

*Storage: Block 5K IOPS at EUR 0.0993/GB/month, 15K IOPS at EUR 0.1489/GB/month*
*Automated backups: EUR 0.03/GB/month*

### Startup Program

- Up to **EUR 36,000 in credits** for startups
- Transparent pricing, no hidden egress fees

### Key Advantages

- French company, 100% renewable energy data centers
- Strong European compliance (GDPR, HDS)
- Transparent pricing, no hidden egress fees
- Competitive pricing vs hyperscalers
- Free Kubernetes control plane option
- SecNumCloud in progress

### Key Limitations

- HDS certification more recent (July 2024) - less track record
- Fewer HDS-certified products than OVHcloud
- No Enterprise-level managed services portfolio
- Smaller ecosystem than hyperscalers

**Sources:**
- [Scaleway HDS Announcement](https://www.scaleway.com/fr/news/scaleway-annonce-sa-certification-hds-pour-garantir-la-securite-des-donnees-de-sante/)
- [Scaleway Healthcare Solutions](https://www.scaleway.com/en/healthcare-and-life-sciences-solutions/)
- [Scaleway Security & Resilience](https://www.scaleway.com/en/security-and-resilience/)
- [Scaleway Pricing - Instances](https://www.scaleway.com/en/pricing/virtual-instances/)
- [Scaleway Pricing - Containers](https://www.scaleway.com/en/pricing/containers/)
- [Scaleway Pricing - Databases](https://www.scaleway.com/en/pricing/managed-databases/)
- [Scaleway SecNumCloud Process](https://www.scaleway.com/en/news/scaleway-begins-the-secnumcloud-qualification-process/)

---

## 4. Microsoft Azure France

### HDS Certification Status

- **HDS certified** (since 2018 certification process)
- Must migrate to **HDS 2.0 by May 2026**
- Coverage includes Azure, Office 365, Dynamics 365

### Data Centers in France

- **France Central** (Paris region) - 3 availability zones
- **France South** (Marseille region) - paired region for DR

### Azure Services Available in France Regions

Full Azure portfolio available in France Central:
- Azure Kubernetes Service (AKS)
- Azure SQL Database, Azure Database for PostgreSQL
- Azure Blob Storage, Azure Files
- Azure App Service
- Azure Functions (Serverless)
- Azure Container Instances
- Azure Active Directory / Entra ID
- Azure Key Vault
- Azure Monitor, Application Insights
- Azure Front Door / CDN

### AKS (Azure Kubernetes Service) Pricing

| Tier | Control Plane | EUR/month (approx) |
|------|--------------|---------------------|
| Free | Free | 0 |
| Standard | $0.10/cluster/hour | ~72/month |
| Premium | $0.10/cluster/hour + LTS | ~72/month + premium |

*Worker nodes billed at VM rates. Example D2s v3 (2 vCPU, 8 GB): ~EUR 85/month*

### HDS Compliance Concerns (Sovereignty)

- **HDS 2.0 requires EEA data storage** - Azure France regions comply
- **Concern:** Microsoft is US-based, subject to US CLOUD Act
- HDS 2.0 requires **transparency** about extra-EU access risks
- For French public sector: may not meet SecNumCloud requirements
- Azure operates via HDS addendum / contractual commitments

### Key Advantages

- Broadest managed services portfolio
- Mature Kubernetes (AKS) with advanced features
- Strong enterprise integration (Active Directory, Office 365)
- Global CDN with edge locations

### Key Limitations

- US company subject to CLOUD Act (sovereignty concern)
- Complex pricing with many hidden costs (egress, IOPS, etc.)
- HDS 2.0 sovereignty requirements may create friction
- Higher cost than French providers for equivalent compute

**Sources:**
- [Microsoft HDS Compliance](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)
- [Azure HDS Blog](https://azure.microsoft.com/en-us/blog/microsoft-azure-is-now-certified-to-host-sensitive-health-data-in-france/)
- [AKS Pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)
- [AKS Pricing Guide](https://www.pump.co/blog/azure-aks-pricing)
- [Inside Privacy - Updated HDS Standard](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)

---

## 5. AWS France (eu-west-3)

### HDS Certification Status

- **HDS certified for 24 AWS Regions** (renewed January 13, 2025)
- eu-west-3 (Paris) region included
- Must migrate to **HDS 2.0 by May 2026**
- Certificate available on ANS website and AWS Artifact

### eu-west-3 (Paris) Region

- 3 Availability Zones
- Full AWS service portfolio available
- Located in Paris area

### EKS (Elastic Kubernetes Service) Pricing

| Component | Cost |
|-----------|------|
| EKS Control Plane (standard support) | $0.10/hour (~EUR 73/month) |
| EKS Control Plane (extended K8s support) | $0.60/hour (~EUR 438/month) |
| Worker nodes (t3.medium, 2 vCPU/4 GB) | ~EUR 35/month on-demand |
| Worker nodes (m6i.xlarge, 4 vCPU/16 GB) | ~EUR 160/month on-demand |

### Estimated Monthly Costs (Startup)

| Cluster Size | Configuration | EUR/month |
|-------------|---------------|-----------|
| Small dev | 3x t3.medium + Spot | ~150 |
| Production HA | 10x m6i.xlarge | ~1,200-1,600 |
| Enterprise | 50+ nodes | 15,000+ |

### Cost Breakdown by Component

- Compute (EC2 instances + control plane): **65-75%** of total bill
- Networking (LB, NAT Gateway, data transfer): **20-30%**
- Storage (EBS volumes): **5-10%**

### HDS Compliance Concerns (Sovereignty)

- Same CLOUD Act concern as Azure
- HDS 2.0 requires EEA data storage (eu-west-3 complies)
- Must declare risks of extra-EU access
- AWS provides HDS-specific contractual addendum

### Key Advantages

- Broadest service catalog globally
- Mature EKS with deep integrations
- Spot instances can save 60-70% on compute
- Largest global infrastructure

### Key Limitations

- Highest egress fees among all providers
- US company, CLOUD Act applies
- Complex billing (many hidden components)
- Most expensive option for comparable compute

**Sources:**
- [AWS HDS Compliance](https://aws.amazon.com/compliance/hds/)
- [AWS HDS Certification 24 Regions](https://aws.amazon.com/blogs/security/aws-achieves-hds-certification-for-24-aws-regions/)
- [AWS EKS Pricing](https://aws.amazon.com/eks/pricing/)
- [EKS Pricing Guide 2025](https://www.devzero.io/blog/eks-pricing)
- [EKS Cost Calculator](https://clustercost.com/tools/cost-estimator/)

---

## 6. Google Cloud France

### HDS Certification Status

- **HDS v2.0 certified since July 2025** - one of the FIRST hyperscalers to achieve v2.0
- Covers 25 sites globally (Europe, Americas, Southeast Asia)
- Covers both Google Cloud and Google Workspace (enterprise)
- Certificate available on Google Cloud compliance page

### France Region

- **europe-west1** (Belgium - closest to France)
- **europe-west9** (Paris) - launched for French data residency
- Paris region supports GKE, Cloud SQL, Cloud Storage, etc.

### Healthcare Services

- Cloud Healthcare API
- BigQuery for health analytics
- Vertex AI for medical AI/ML
- DICOM/FHIR/HL7v2 data stores
- HDS addendum available for contract terms

### S3NS Partnership (Thales + Google)

- **S3NS obtained SecNumCloud 3.2 qualification** on December 17, 2025
- Combines Google Cloud technology with France's strictest security requirements
- First sovereign cloud to combine hyperscaler tech with SecNumCloud
- Intended for sensitive data (government, defense, healthcare)

### GKE (Google Kubernetes Engine) Pricing

| Tier | Control Plane | EUR/month (approx) |
|------|--------------|---------------------|
| Standard | $0.10/cluster/hour | ~73 |
| Autopilot | Pay per pod resource | Variable |

*Worker nodes at standard Compute Engine rates*

### Key Advantages

- **First hyperscaler with HDS v2.0** (ahead of AWS/Azure)
- Strong AI/ML capabilities for healthcare
- S3NS partnership for sovereign cloud needs
- Healthcare API (FHIR/DICOM native)

### Key Limitations

- US company, CLOUD Act applies (mitigated by S3NS for sensitive use)
- Paris region smaller than AWS/Azure France
- More expensive than French sovereign providers
- S3NS is separate offering with different pricing

**Sources:**
- [Google Cloud HDS v2.0 Achievement](https://security.googlecloudcommunity.com/ciso-blog-77/google-cloud-achieves-hds-v2-0-certification-raising-the-bar-for-secure-health-data-hosting-in-france-5906)
- [Google Cloud HDS Compliance](https://cloud.google.com/security/compliance/hds)
- [S3NS SecNumCloud Qualification](https://blog.datacenter-paris.com/2026/01/17/s3ns-obtient-la-certification-secnumcloud-le-cloud-souverain-thales-google-renforce/)

---

## 7. Outscale (Dassault Systemes)

### Certifications

- **SecNumCloud 3.2 qualified** (FIRST cloud to achieve this from ANSSI)
- **HDS certified**
- ISO 27001, ISO 27017, ISO 27018
- CISPE, TISAX
- No extra-EU data access concerns (French company)

### Sovereign Cloud Positioning

- Cloud subsidiary of Dassault Systemes (100% French)
- Highest level of sovereignty in French cloud market
- Target: government, defense, healthcare, critical infrastructure

### Services

- IaaS (Virtual Machines on-demand)
- **OKS (Outscale Kubernetes as a Service)** - available since March 2025
  - Multi-AZ mode on 2 European cloud regions
  - One region qualified SecNumCloud 3.2
- Block Storage, Object Storage
- Load Balancers
- Networking (VPC, VPN, DirectConnect)

### Healthcare Partnerships

- Partnership with **PariSante Campus** to support digital health startups
- HDS-labeled infrastructure for health data
- Scalingo partnership for managed PaaS on Outscale infrastructure

### AI & Innovation (2025-2026)

- **Mistral AI** Le Chat available via marketplace (since September 2025)
- **Quantum as a Service** (beta since November 2025)

### Pricing Model

- Per VM-hour billing (billed per second)
- Resource reservations available (1 month to 3 years)
- Up to **60% discount** with reserved instances
- Pricing on request via quotation form
- Generally **2-3x more expensive** than OVHcloud/Scaleway for equivalent compute
- Premium justified by SecNumCloud qualification

### Key Advantages

- **Highest sovereignty level** (SecNumCloud 3.2)
- 100% French company (Dassault Systemes)
- No CLOUD Act exposure
- Combined HDS + SecNumCloud for maximum compliance
- PariSante Campus healthcare ecosystem

### Key Limitations

- Premium pricing (2-3x vs competitors)
- Smaller service catalog than hyperscalers
- Less developer tooling and community
- Pricing not transparent (quotation required)
- Smaller ecosystem

**Sources:**
- [Outscale SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)
- [Outscale Sovereign Cloud](https://en.outscale.com/cloud-experience/sovereign-cloud/)
- [Outscale Pricing](https://en.outscale.com/pricing/)
- [Outscale Kubernetes OKS](https://en.outscale.com/cloud-experience/outscale-kubernetes-as-a-service/)
- [Outscale Healthcare + AI Strategy](https://www.usine-digitale.fr/article/outscale-structure-son-cloud-souverain-autour-de-l-ia-avec-mistral-du-quantique-et-de-la-sante.N2233332)

---

## 8. SecNumCloud vs HDS Comparison

| Criteria | HDS | SecNumCloud |
|----------|-----|-------------|
| **Issuing body** | ANS (Agence Numerique en Sante) | ANSSI (Agence Nationale SSI) |
| **Scope** | Health data only | All sensitive data |
| **Type** | Certification | Qualification |
| **ISO base** | ISO 27001:2022 (~80% of requirements) | ISO 27001 + specific technical controls |
| **Data location** | EEA (since v2.0) | France only |
| **Sovereignty** | Transparency obligations | Full sovereignty (no foreign law exposure) |
| **CLOUD Act protection** | Partial (transparency) | Full (French company required) |
| **Target users** | Healthcare organizations | Government, defense, critical infrastructure |
| **Cost impact** | 3-4x standard hosting | 5-10x standard hosting |
| **Certified providers (examples)** | OVH, Scaleway, AWS, Azure, GCP, Outscale | Outscale, S3NS (Thales/Google), 3DS |

### When to Use What

- **HDS alone:** Startup healthcare app, non-government, standard patient data
- **HDS + SecNumCloud:** Government health agencies, national health data, highest sensitivity
- **Neither needed:** Non-personal health data, anonymized research data

### Current SecNumCloud 3.2 Qualified Providers

1. **Outscale** (Dassault Systemes) - First to achieve
2. **S3NS** (Thales + Google Cloud) - December 2025
3. OVHcloud - In progress (multiple data centers)
4. Scaleway - In progress (J0 January 2025)

**Sources:**
- [Allonia - SecNumCloud and HDS](https://allonia.com/en/cloud-secnumcloud-and-hds/)
- [Scalingo - ISO 27001, HDS, SecNumCloud](https://scalingo.com/blog/iso-27001-hds-and-secnumcloud-for-scalingo)
- [Archimag - 11 Cloud Souverains](https://www.archimag.com/demat-cloud/2023/03/01/onze-cloud-souverains-incontournables)
- [S3NS SecNumCloud](https://blog.datacenter-paris.com/2026/01/17/s3ns-obtient-la-certification-secnumcloud-le-cloud-souverain-thales-google-renforce/)

---

## 9. Docker/Kubernetes on HDS Infrastructure

### Managed Kubernetes Options Comparison

| Provider | Service | Control Plane Cost | SLA | HDS Ready | Max Nodes |
|----------|---------|-------------------|-----|-----------|-----------|
| **OVHcloud** | MKS (Managed K8S) | **FREE** (Free tier) | Standard plan | Yes | - |
| **Scaleway** | Kapsule | **FREE** (Mutualized) | Dedicated from EUR 80/mo | Yes | 150-500 |
| **Azure** | AKS France Central | **FREE** (Free tier) or ~EUR 72/mo (Standard) | Standard/Premium | Yes | 5000 |
| **AWS** | EKS eu-west-3 | **~EUR 73/mo** | Included | Yes | 5000 |
| **Google** | GKE europe-west9 | **~EUR 73/mo** (Standard) or Free (Autopilot) | Included | Yes (v2.0) | 15000 |
| **Outscale** | OKS | Pricing on request | SecNumCloud SLA | Yes | - |

### Recommended Stack for HDS Kubernetes

```
Kubernetes Cluster (HDS-certified provider)
  |-- Application Pods (Docker containers)
  |-- Managed PostgreSQL (separate HDS service)
  |-- Object Storage (HDS-certified, S3-compatible)
  |-- Load Balancer (HDS-certified)
  |-- Monitoring (Prometheus/Grafana or managed)
  |-- Container Registry (provider's registry or self-hosted)
  |-- Secrets Management (Vault or provider KMS)
```

### OVHcloud Kubernetes Specifics

- Managed Kubernetes based on CNCF-certified Kubernetes
- Managed Rancher Service also available (since KubeCon 2024)
- Supports HDS compliance when HDS addendum activated
- Integration with OVHcloud Container Registry
- Node pools with auto-scaling

### Scaleway Kapsule Specifics

- CNCF-certified Kubernetes
- Free mutualized control plane for development
- Dedicated control plane with SLA for production
- Integration with Scaleway Container Registry
- Easy Volumes (persistent storage) integration
- Kosmos for multi-cloud K8s clusters

### Key Consideration for HDS

All container images, persistent volumes, and network traffic must remain within HDS-certified infrastructure boundaries. The entire chain must be HDS-compliant, including:
- Container registry
- Kubernetes nodes
- Persistent storage
- Database connections
- Load balancers
- Backup storage
- Log aggregation

---

## 10. CDN for DOM-TOM (French Overseas Territories)

### Challenge

French overseas territories (DOM-TOM/DROM-COM) are geographically distant from mainland France:
- **Martinique/Guadeloupe** (~6,800 km from Paris, Caribbean)
- **Guyane** (~7,100 km from Paris, South America)
- **Reunion** (~9,400 km from Paris, Indian Ocean)
- **Mayotte** (~8,000 km from Paris, Indian Ocean)

Without CDN, latency from Paris data center: 120-250ms RTT depending on territory.

### Cloudflare PoP Coverage for DOM-TOM

| Territory | Cloudflare PoP | Nearest PoP if none | Est. Latency |
|-----------|---------------|---------------------|--------------|
| **Reunion** | **RUN (Saint-Denis)** - Direct PoP | - | ~5-15ms |
| **Tahiti** | **PPT (Papeete)** - Direct PoP | - | ~5-15ms |
| **Martinique** | **None confirmed** | BGI (Bridgetown, Barbados) or MIA (Miami) | ~20-50ms |
| **Guadeloupe** | **None confirmed** | BGI (Bridgetown, Barbados) or SJU (San Juan, PR) | ~20-50ms |
| **Guyane** | **None confirmed** | BGI (Bridgetown) or GEO (Georgetown, Guyana) | ~30-60ms |
| **Mayotte** | **None confirmed** | RUN (Reunion) or NBO (Nairobi) | ~40-80ms |

### Nearby Caribbean/Indian Ocean Cloudflare PoPs

- **BGI** - Bridgetown, Barbados
- **SJU** - San Juan, Puerto Rico
- **KIN** - Kingston, Jamaica
- **POS** - Port of Spain, Trinidad & Tobago
- **GND** - St. George's, Grenada
- **MIA** - Miami, Florida
- **RUN** - Saint-Denis, Reunion (direct coverage)

### CDN Strategy Recommendations

#### Option 1: Cloudflare (Recommended for Cost)
- **Free tier** available for basic CDN
- Pro plan: $20/month, Business: $200/month
- Good coverage for Reunion (direct PoP)
- Caribbean served from nearby PoPs (Barbados, Puerto Rico)
- Global Anycast network with 300+ cities
- No HDS certification required for CDN layer (only static assets, no health data cached)

#### Option 2: AWS CloudFront
- Edge locations in Caribbean region (San Juan, Miami)
- Integrates natively with AWS eu-west-3
- Pay-per-use pricing
- Better for dynamic content acceleration

#### Option 3: OVHcloud CDN
- Included with some hosting plans
- Fewer PoPs than Cloudflare/CloudFront
- Native integration with OVHcloud infrastructure

### DOM-TOM CDN Architecture Recommendation

```
User (DOM-TOM) --> CDN Edge (Cloudflare/CloudFront)
                       |
                       |--> Static assets (cached at edge)
                       |--> Dynamic API calls --> Origin (Paris, HDS infrastructure)
```

**Important:** CDN for DOM-TOM should only cache **non-health-data content** (JS, CSS, images, public pages). All personal health data must transit directly to HDS-certified infrastructure. CDN providers are generally NOT HDS-certified for data caching.

### Latency Optimization for DOM-TOM

1. **Aggressive caching** of static assets at CDN edge
2. **API response caching** for non-sensitive data (geocoding, reference data)
3. **Service Worker** for offline-capable PWA
4. **Image optimization** (WebP/AVIF, responsive images)
5. **Code splitting** to reduce initial bundle size
6. **GraphQL or efficient API design** to minimize round trips

**Sources:**
- [Cloudflare Global Network](https://www.cloudflare.com/network/)
- [Cloudflare PoP Locations List](https://www.feitsui.com/en/article/26)
- [CDN Planet - Reunion CDN](https://www.cdnplanet.com/geo/reunion-cdn/)
- [Cloudflare Network Performance Update 2025](https://blog.cloudflare.com/network-performance-update-birthday-week-2025/)

---

## 11. Pricing Comparison for Startup Healthcare App

### Reference Architecture

A typical healthcare startup application:
- 3 Kubernetes worker nodes (4 vCPU, 16 GB RAM each)
- 1 Managed PostgreSQL database (4 vCPU, 16 GB RAM, 100 GB storage)
- 100 GB Object Storage (documents, medical files)
- 1 Load Balancer
- Monitoring/Logging
- CDN for static assets
- HDS compliance

### Monthly Cost Estimates (EUR)

| Component | OVHcloud | Scaleway | AWS (eu-west-3) | Azure (France Central) |
|-----------|----------|----------|-----------------|----------------------|
| **K8s Control Plane** | 0 (Free) | 0 (Free) or 80 (Dedicated) | ~73 | 0 (Free) or ~72 |
| **3x Worker Nodes (4vCPU/16GB)** | 3 x 44 = **132** | 3 x 107 = **321** (POP2) or 3 x 66 = **199** (GP1) | 3 x 160 = **480** | 3 x 85 = **255** |
| **Managed PostgreSQL (4vCPU/16GB)** | ~120-180 (est.) | **158** (PRO2-XS) or **207** (POP2) | ~250-350 | ~250-350 |
| **100 GB Object Storage** | ~5 | ~3 | ~3 | ~3 |
| **Load Balancer** | ~10-20 | ~10-15 | ~25-40 | ~25-40 |
| **Monitoring** | ~20 (included/basic) | ~10-20 | ~50-100 | ~50-100 |
| **Egress (100 GB/month)** | **0** (free) | **0** (free) | ~9-12 | ~9-12 |
| **HDS Support Surcharge** | **~300** (Business min.) | ~0 (included) | ~0 (included) | ~0 (included) |
| **CDN (Cloudflare Pro)** | ~18 | ~18 | ~18 | ~18 |
| **TOTAL ESTIMATED** | **~600-650** | **~470-850** | **~900-1,100** | **~700-900** |

### Cost Summary by Provider

| Provider | Monthly Est. | Annual Est. | Notes |
|----------|-------------|-------------|-------|
| **Scaleway** (Free K8s + GP1 nodes) | **~470-550** | ~5,600-6,600 | Cheapest option, HDS since 2024 |
| **OVHcloud** (Free K8s + B3 nodes) | **~600-650** | ~7,200-7,800 | Includes mandatory Business Support |
| **Azure France** (Free AKS + D2s) | **~700-900** | ~8,400-10,800 | Enterprise features, CLOUD Act concern |
| **AWS eu-west-3** (EKS + m6i) | **~900-1,100** | ~10,800-13,200 | Most services, highest egress costs |
| **Google Cloud** (GKE + e2) | **~800-1,000** | ~9,600-12,000 | HDS v2.0 ready, AI/ML strengths |
| **Outscale** (OKS) | **~1,200-2,000** | ~14,400-24,000 | SecNumCloud premium, quotation needed |

### Startup-Specific Considerations

1. **Scaleway Startup Program:** Up to EUR 36,000 in credits
2. **AWS Startup Credits:** Up to $100,000 via AWS Activate
3. **Azure Startup Credits:** Up to $150,000 via Microsoft for Startups
4. **Google Cloud Startup Credits:** Up to $200,000 via Google for Startups
5. **OVHcloud Startup Program:** Available, amount varies

### Recommendation for Healthcare Startup

**Best value for HDS compliance:** **Scaleway** or **OVHcloud**
- French companies, no CLOUD Act exposure
- Transparent pricing, no egress fees
- Lower base costs
- HDS native

**Best for scale/features:** **AWS** or **Azure** (but apply for startup credits)
- Use startup credits to offset Year 1 costs
- Superior managed services ecosystem
- Be aware of HDS 2.0 sovereignty transparency requirements

**Best for maximum sovereignty:** **Outscale**
- Only if SecNumCloud is required
- 2-3x cost premium is significant for startup

---

## 12. Additional Providers Worth Noting

### Scalingo (PaaS on HDS Infrastructure)

- PaaS (Platform as a Service) built on Outscale infrastructure
- HDS certified
- Managed PostgreSQL, Redis, MongoDB, Elasticsearch
- Docker-based deployment (no K8s management needed)
- Pricing: from ~EUR 7.20/month for small containers
- Good for teams that don't want to manage Kubernetes

### NumSpot (La Poste + Dassault + Docaposte)

- Cloud platform launched Q1 2025
- Obtained **HDS certification** (February 2026)
- Extended **ISO 27001 certification** (February 2026)
- Targeting SecNumCloud qualification
- Sovereign French cloud consortium

### Cloud Temple

- HDS certified for sovereign cloud platform
- French managed cloud provider
- SecNumCloud in progress

### Oodrive

- Renewed **ISO 27001, ISO 27701, and HDS 2.0** certifications (February 2026)
- French SaaS for secure document management
- Specialized in sensitive data hosting

---

## 12. Sources Index

### Official / Government
- [ANS - Liste des hebergeurs certifies HDS](https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies)
- [ANS - Publication JO referentiel HDS](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)
- [Economie.gouv.fr - Nouvelle version referentiel HDS](https://presse.economie.gouv.fr/nouvelle-version-du-referentiel-de-certification-hds/)

### OVHcloud
- [OVHcloud Healthcare](https://www.ovhcloud.com/fr/healthcare/)
- [OVHcloud HDS Compliance](https://www.ovhcloud.com/en/compliance/hds/)
- [OVHcloud HDS Products](https://help.ovhcloud.com/csm/en-hds-certification?id=kb_article_view&sysparm_article=KB0061194)
- [OVHcloud HDS Activation](https://help.ovhcloud.com/csm/en-public-cloud-compute-enable-hds?id=kb_article_view&sysparm_article=KB0062394)
- [OVHcloud Kubernetes](https://www.ovhcloud.com/en/public-cloud/kubernetes/)
- [OVHcloud Kubernetes Plans](https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-mks-plans?id=kb_article_view&sysparm_article=KB0073776)
- [OVHcloud Public Cloud Prices](https://www.ovhcloud.com/en/public-cloud/prices/)
- [OVHcloud Business Support](https://www.ovhcloud.com/en/support-levels/business/)
- [B3-8 Pricing](https://pcr.cloud-mercato.com/providers/ovh/flavors/B3-8)

### Scaleway
- [Scaleway HDS Announcement](https://www.scaleway.com/fr/news/scaleway-annonce-sa-certification-hds-pour-garantir-la-securite-des-donnees-de-sante/)
- [Scaleway Healthcare Solutions](https://www.scaleway.com/en/healthcare-and-life-sciences-solutions/)
- [Scaleway Pricing Instances](https://www.scaleway.com/en/pricing/virtual-instances/)
- [Scaleway Pricing Containers](https://www.scaleway.com/en/pricing/containers/)
- [Scaleway Pricing Databases](https://www.scaleway.com/en/pricing/managed-databases/)
- [Scaleway SecNumCloud](https://www.scaleway.com/en/news/scaleway-begins-the-secnumcloud-qualification-process/)
- [Scaleway Security](https://www.scaleway.com/en/security-and-resilience/)

### Azure
- [Microsoft HDS Compliance](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)
- [Azure HDS Blog](https://azure.microsoft.com/en-us/blog/microsoft-azure-is-now-certified-to-host-sensitive-health-data-in-france/)
- [AKS Pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)

### AWS
- [AWS HDS Compliance](https://aws.amazon.com/compliance/hds/)
- [AWS HDS 24 Regions](https://aws.amazon.com/blogs/security/aws-achieves-hds-certification-for-24-aws-regions/)
- [AWS EKS Pricing](https://aws.amazon.com/eks/pricing/)

### Google Cloud
- [Google Cloud HDS v2.0](https://security.googlecloudcommunity.com/ciso-blog-77/google-cloud-achieves-hds-v2-0-certification-raising-the-bar-for-secure-health-data-hosting-in-france-5906)
- [Google Cloud HDS](https://cloud.google.com/security/compliance/hds)

### Outscale
- [Outscale SecNumCloud 3.2](https://www.3ds.com/newsroom/press-releases/outscale-first-cloud-qualified-secnumcloud-32)
- [Outscale Sovereign Cloud](https://en.outscale.com/cloud-experience/sovereign-cloud/)
- [Outscale Pricing](https://en.outscale.com/pricing/)
- [Outscale Kubernetes OKS](https://en.outscale.com/cloud-experience/outscale-kubernetes-as-a-service/)

### CDN & DOM-TOM
- [Cloudflare Global Network](https://www.cloudflare.com/network/)
- [Cloudflare PoP Locations](https://www.feitsui.com/en/article/26)
- [CDN Planet - Reunion](https://www.cdnplanet.com/geo/reunion-cdn/)

### Analysis & Legal
- [RiskInsight Wavestone - HDS Evolution](https://www.riskinsight-wavestone.com/en/2025/05/evolution-of-the-hds-framework-towards-enhanced-security-and-sovereignty/)
- [Schellman - New HDS Framework](https://www.schellman.com/blog/compliance/new-hds-framework-2024)
- [Inside Privacy - Updated HDS Standard](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)
- [Allonia - SecNumCloud and HDS](https://allonia.com/en/cloud-secnumcloud-and-hds/)
- [CMS Law - Nouveau referentiel HDS](https://cms.law/fr/fra/news-information/nouveau-referentiel-de-certification-des-hebergeurs-de-donnees-de-sante-hds)
- [AFNOR - HDS Certification](https://certification.afnor.org/en/digital/hds-certification)
- [Scalingo HDS Guide](https://scalingo.com/blog/health-data-hosting)
- [NumSpot HDS + ISO 27001](https://numspot.com/2026/02/03/numspot-etend-sa-certification-iso-27001-et-obtient-la-certification-hds/)
- [Oodrive HDS 2.0 Renewal](https://www.storagenewsletter.com/2026/02/16/oodrive-renouvelle-ses-certifications-iso-27001-iso-27701-et-hds-2-0-et-confirme-son-niveau-dexigence-en-matiere-de-protection-des-donnees/)

---

*Research conducted on 2026-02-24. Pricing data is approximate and should be verified on provider websites before making procurement decisions. All EUR amounts are excluding VAT unless noted.*
