# Database & Storage Technologies for Healthcare Applications in France (HDS Compliance)

**Research Date:** 2026-02-24
**Context:** JIM App - Physiotherapist replacement platform requiring storage of professional profiles, contract documents, matching data (geolocation-based), messaging, and audit logs under HDS 2.0 compliance.

---

## Table of Contents

1. [PostgreSQL for Healthcare](#1-postgresql-for-healthcare)
2. [MongoDB for Healthcare Profiles & Matching](#2-mongodb-for-healthcare-profiles--matching)
3. [Redis for Healthcare Caching](#3-redis-for-healthcare-caching)
4. [Elasticsearch / OpenSearch for Professional Search](#4-elasticsearch--opensearch-for-professional-search)
5. [Database Encryption at Rest](#5-database-encryption-at-rest)
6. [Multi-Database Architecture Patterns](#6-multi-database-architecture-patterns)
7. [TimescaleDB for Audit Logs & Compliance Tracking](#7-timescaledb-for-audit-logs--compliance-tracking)
8. [HDS 2.0 Compliance & Hosting Providers](#8-hds-20-compliance--hosting-providers)
9. [Recommended Architecture for JIM](#9-recommended-architecture-for-jim)

---

## 1. PostgreSQL for Healthcare

### Current Versions & Key Features

**PostgreSQL 17** (current stable as of early 2026):

- **SQL/JSON Enhancements**: New SQL/JSON constructors (`JSON`, `JSON_SCALAR`, `JSON_SERIALIZE`) and query functions (`JSON_EXISTS`, `JSON_QUERY`, `JSON_VALUE`). The `JSON_TABLE()` function converts JSON data directly into PostgreSQL table representation, which is particularly useful for handling semi-structured healthcare data like FHIR resources or professional profile metadata.
- **Performance Gains**: Overhauled memory management for VACUUM, optimized storage access, improvements for high concurrency workloads, speedups in bulk loading/exports, and query execution improvements for indexes.
- **Logical Replication Enhancements**: Simplifies management of high availability workloads and major version upgrades -- critical for zero-downtime healthcare systems.

**PostgreSQL 18** (released September 2025):

- **Asynchronous I/O (AIO) Subsystem**: Demonstrated up to 3x performance improvements for sequential scans, bitmap heap scans, vacuums, and related operations.
- **Skip Scan Lookups**: Enables multicolumn B-tree indexes to be used in more query patterns.
- **UUIDv7 (`uuidv7()`)**: Generates timestamp-ordered UUIDs natively -- excellent for audit logs and time-ordered records.
- **Virtual Generated Columns**: Compute values during read operations, reducing storage overhead.
- **OAuth Authentication**: Native support for modern authentication flows.
- **Temporal Constraints**: PRIMARY KEY, UNIQUE, and FOREIGN KEY constraints over ranges -- useful for modeling contract validity periods, availability windows, etc.

**PostgreSQL 19** is planned for September 2026.

### Full-Text Search Capabilities

PostgreSQL's built-in full-text search (FTS) with `tsvector` and GIN indexes is production-ready for healthcare professional search:

- GIN indexes for full-text search can achieve approximately **99.7% reduction in execution time** compared to unindexed queries.
- Pre-computed `tsvector` columns with properly configured GIN indexes (`fastupdate=off` for reads) can achieve **~50x speed improvement** over naive implementations.
- Supports French language stemming, accent-insensitive search, and weighted ranking -- essential for searching physiotherapist profiles by specialty, location name, etc.

### JIM Relevance

PostgreSQL is the ideal **primary database** for JIM:
- Contracts and legal documents metadata (with `jsonb` for flexible fields)
- User accounts and authentication data
- Financial transactions and billing
- Referential data (specialties, regions, qualification types)
- Full-text search on profiles (without requiring a separate search engine for basic needs)

### Sources

- [PostgreSQL 17 Released!](https://www.postgresql.org/about/news/postgresql-17-released-2936/)
- [Exploring PostgreSQL 17: New Features & Enhancements](https://www.enterprisedb.com/blog/exploring-postgresql-17-new-features-enhancements)
- [PostgreSQL 18 Released!](https://www.postgresql.org/about/news/postgresql-18-released-3142/)
- [PostgreSQL 18 Press Kit](https://www.postgresql.org/about/press/presskit18/)
- [3 Great New Features in Postgres 17 | InfoWorld](https://www.infoworld.com/article/3540394/3-great-new-features-in-postgres-17.html)
- [PostgreSQL 17 Performance Tuning: Full-Text Search](https://medium.com/@jramcloud1/20-postgresql-17-performance-tuning-full-text-search-index-tsvector-ece3b576a37b)
- [High-Performance Full Text Search in Postgres](https://risingwave.com/blog/implementing-high-performance-full-text-search-in-postgres/)
- [Postgres Full-Text Search: A Search Engine in a Database | Crunchy Data](https://www.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database)
- [PostgreSQL 17 Performance Upgrade 2026](https://medium.com/@DevBoostLab/postgresql-17-performance-upgrade-2026-f4222e71f577)

---

## 2. MongoDB for Healthcare Profiles & Matching

### Document Model for Professional Profiles

MongoDB's flexible document model is well-suited for physiotherapist profiles that may contain varying fields depending on specialties, certifications, and preferences:

- **Schema Flexibility**: Each profile can have different sets of specializations, certifications, availability patterns, and preferences without requiring schema migrations.
- **Embedded Documents**: Availability calendars, skill sets, and preference objects can be nested within a single profile document, reducing join overhead.
- **Healthcare Interoperability**: MongoDB is actively used in healthcare for reducing data fragmentation and enabling interoperability across systems (EMPI applications for matching and unifying demographics across applications).

### Geospatial Queries for Physiotherapist Matching

MongoDB's **2dsphere indexes** are purpose-built for the proximity-based matching JIM needs:

- **2dsphere Index**: Supports geospatial queries on an earth-like sphere. Can determine points within a specified area, calculate proximity to a specified point, and return exact matches on coordinate queries.
- **`$nearSphere` Operator**: Returns documents ordered by proximity to a given point -- ideal for "find nearest available physiotherapist" queries.
- **`$geoWithin`**: Find physiotherapists within a specific geographic boundary (e.g., department, region).
- **GeoJSON Support**: Longitude values between -180 and 180, latitude between -90 and 90.
- **Compound Indexes**: 2dsphere indexes can be combined with other fields (specialty, availability, rating) for multi-criteria proximity search.

**Example use case for JIM**: A clinic in Lyon needs a replacement physiotherapist specializing in sports rehabilitation within 30km. MongoDB can execute a single query combining `$nearSphere` (location), `$eq` (specialty), and date-range filters (availability) efficiently.

### MongoDB Atlas HDS Compliance

**MongoDB Atlas is HDS-certified** as of 2025:

- MongoDB Atlas has been certified under the HDS framework, enabling organizations to securely store and manage healthcare data in compliance with French regulations.
- Customers can store personal health data collected during health activities in France in MongoDB Atlas.
- Atlas supports HDS-compliant regions on **AWS, Google Cloud Platform (GCP), and Microsoft Azure** -- all of which are themselves HDS-compliant.
- The updated HDS framework requires healthcare data to be hosted within the **European Economic Area (EEA)**, and Atlas supports EU-based regions.
- MongoDB's HDS compliance was updated as recently as **March 6, 2025**.

### Sources

- [MongoDB HDS Certification](https://www.mongodb.com/products/platform/trust/hds)
- [Stay Compliant with MongoDB's Latest Certifications: ISO 9001, TISAX, HDS, and TX-RAMP](https://www.mongodb.com/blog/post/stay-compliant-mongodbs-latest-certifications-iso9001-tisax-hds-tx-ramp)
- [MongoDB Furthers Commitment to Security and Compliance](https://www.mongodb.com/press/mongo-db-furthers-commitment-to-security-and-compliance-with-new-industry-certifications)
- [MongoDB Geospatial Queries Documentation](https://www.mongodb.com/docs/manual/geospatial-queries/)
- [2dsphere Indexes - MongoDB Docs](https://www.mongodb.com/docs/manual/core/indexes/index-types/geospatial/2dsphere/)
- [$nearSphere Operator - MongoDB Docs](https://www.mongodb.com/docs/manual/reference/operator/query/nearsphere/)
- [The Dual Journey: Healthcare Interoperability and Modernization](https://www.mongodb.com/company/blog/innovation/dual-journey-healthcare-interoperability-modernization)
- [How MongoDB Helps Reduce Data Fragmentation For Healthcare Data](https://www.mongodb.com/company/blog/innovation/healthcare-data-interoperability)
- [MongoDB For Healthcare Data Interoperability](https://www.mongodb.com/solutions/industries/healthcare/interoperability)

---

## 3. Redis for Healthcare Caching

### Session Management

Redis is the industry-standard solution for healthcare session management:

- **In-memory design** guarantees near-instant access to session data.
- **TTL-based expiration** natively supported -- critical for healthcare session timeouts (e.g., automatic logout after inactivity per security policy).
- Can handle **thousands of session operations per second**.
- Supports session storage with ElastiCache Redis or Redis Cloud for managed infrastructure.

### Healthcare-Specific Use Cases

Redis enhances healthcare applications by:
- **Patient/Provider Portal Optimization**: Cache management keeps user interactions seamless and responsive.
- **Real-time Workflows**: Redis Streams message broker enables quick, accurate event processing.
- **AI Analytics**: Can support AI-driven matching and fraud detection pipelines.

### Redis 8 & Redis Stack (2025-2026)

**Major evolution**: With Redis 8.0, the formerly separate modules (RediSearch, RedisJSON, RedisTimeSeries, RedisBloom) are now **integrated directly into Redis core**:

- **Redis Query Engine** (formerly RediSearch): Full-text search, secondary indexing, numeric filtering, aggregation, and **geo-filtering** -- all built into Redis. Supports queries with multiple fields, exact phrase matching, and geospatial queries.
- **RedisJSON** (now native): Native JSON storage with JSONPath queries and atomic operations. Ideal for caching complex physiotherapist profile objects.
- **RedisTimeSeries** (now native): Time-series data support for metrics and monitoring.
- **RedisBloom** (now native): Probabilistic data structures.

### Pub/Sub for Real-Time Notifications

Redis Pub/Sub is ideal for JIM's real-time notification needs:

- **Lightweight, high-performance messaging** for real-time communication.
- At-most-once delivery semantics (suitable for notifications where occasional missed messages are acceptable).
- Combined with WebSockets, enables **instant push notifications** to users (e.g., new replacement request, contract signed, message received).
- **Redis Streams** provides stronger guarantees (at-least-once delivery, consumer groups) for critical event processing.

### Licensing Update (2025)

Redis transitioned back to open-source in 2025, now **tri-licensed** under AGPLv3, making it more accessible for self-hosted deployments.

### JIM Relevance

- **Session management**: User sessions with automatic timeout
- **Caching layer**: Profile search results, frequently accessed reference data
- **Real-time notifications**: Pub/Sub for new replacement requests, messages, contract updates
- **Rate limiting**: API rate limiting for security
- **Geospatial caching**: Cache nearby physiotherapist results with Redis geo commands

### Sources

- [Redis for Healthcare](https://redis.io/industries/healthcare/)
- [Redis Session Management](https://redis.io/solutions/session-management/)
- [About Redis Stack](https://redis.io/about/about-stack/)
- [Redis Open Source 8.0 Release Notes](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/redisce/redisos-8.0-release-notes/)
- [Redis Open Source 8.2 Release Notes](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/redisce/redisos-8.2-release-notes/)
- [Complete Guide to Redis in 2026](https://www.dragonflydb.io/guides/complete-guide-to-redis-architecture-use-cases-and-more)
- [Mastering Redis Cache 2026 Guide](https://www.dragonflydb.io/guides/mastering-redis-cache-from-basic-to-advanced)
- [Building Real-Time Notification System with Redis Pub/Sub and WebSockets](https://binaryscripts.com/redis/2025/05/05/building-a-real-time-notification-system-with-redis-pubsub-and-websockets.html)
- [Implementing Real-Time Notifications Using Redis Pub/Sub](https://arnab2001.hashnode.dev/implementing-real-time-notifications-using-redis-pubsub)
- [Redis Cache Optimization With RedisJSON and RediSearch](https://medium.com/@kendevs/redis-cache-optimization-with-redisjson-and-redisearch-cc028ea22825)
- [Redis Caching Strategies 2026](https://miracl.in/blog/redis-caching-strategies-2026/)

---

## 4. Elasticsearch / OpenSearch for Professional Search

### Elasticsearch for Healthcare

Elastic Search Platform enables healthcare organizations to create search experiences and observe/protect their ecosystems. Notable healthcare use case: **CTcue** built a privacy-by-design platform to help healthcare professionals find information in EHRs using the Elastic Stack.

### Geospatial Search Capabilities

Both Elasticsearch and OpenSearch support robust geospatial search:

- **Data Types**: `geo_point` (lat/lon pairs) and `geo_shape` (points, lines, circles, polygons, multi-polygons).
- **Query Types**: `geo_distance` (find within radius), `geo_bounding_box` (find within rectangle), `geo_polygon`, and `geo_shape` queries.
- **Distance-based scoring**: Use distance in relevance scoring to rank closer physiotherapists higher.
- **Aggregations**: Geohash grid aggregation for visualizing distribution of professionals across regions.

### Elasticsearch vs OpenSearch in 2025

As of 2025, these are diverging platforms:

| Feature | Elasticsearch | OpenSearch |
|---------|--------------|------------|
| **Licensing** | SSPL + Elastic License 2.0 | Apache 2.0 (fully open source) |
| **Geospatial** | Full geo queries | Geo + XY searches |
| **ML/AI** | Commercial-grade ML features | Community-driven ML |
| **Healthcare** | HIPAA-eligible on Elastic Cloud | Available on AWS (HDS-eligible) |
| **Best for** | Vendor-managed, advanced search | Cloud-native, community-driven |

**Recommendation for JIM**: If using a polyglot architecture, Elasticsearch/OpenSearch is valuable for advanced professional search with faceted filtering, fuzzy matching, and geolocation. However, for a simpler deployment, PostgreSQL's built-in FTS + MongoDB's geospatial queries may suffice initially, deferring Elasticsearch to a later phase.

### Sources

- [Elastic Healthcare Solutions](https://www.elastic.co/industries/healthcare)
- [CTcue: Making Electronic Health Records Searchable with Elastic](https://www.elastic.co/blog/ctcue-making-electronic-health-records-more-searchable-with-elastic)
- [Elasticsearch Geo Queries Reference](https://www.elastic.co/docs/reference/query-languages/query-dsl/geo-queries)
- [Geospatial Search in Elasticsearch | Baeldung](https://www.baeldung.com/elasticsearch-geo-spatial)
- [How to Set Up Geolocation Search with Elasticsearch | freeCodeCamp](https://www.freecodecamp.org/news/geolocation-search-elasticsearch/)
- [OpenSearch vs Elasticsearch in 2025: What's Changed](https://dattell.com/data-architecture-blog/opensearch-vs-elasticsearch-in-2025-whats-changed-and-what-hasnt/)
- [Elasticsearch vs OpenSearch in 2025: What the Fork?](https://pureinsights.com/blog/2025/elasticsearch-vs-opensearch-in-2025-what-the-fork/)
- [OpenSearch in 2025: Much More Than an Elasticsearch Fork | InfoWorld](https://www.infoworld.com/article/3971473/opensearch-in-2025-much-more-than-an-elasticsearch-fork.html)

---

## 5. Database Encryption at Rest

### PostgreSQL TDE (Transparent Data Encryption)

Multiple TDE solutions exist for PostgreSQL in 2025-2026:

**Percona pg_tde** (Open Source):
- Open source, community-driven PostgreSQL extension providing TDE.
- Packaged with **Percona Distribution for PostgreSQL 17+**.
- Encrypts all database files on disk (tables, indexes, WAL files).
- Centralized Key Management with integrations to **HashiCorp Vault, Thales, Fortanix, and OpenBao** KMS providers.
- No application modifications required.

**EDB TDE** (Enterprise):
- Available from EDB Postgres Advanced Server and EDB Postgres Extended Server (version 15+).
- Enterprise-grade with commercial support.

**AWS RDS / Aurora**:
- Built-in encryption at rest using AWS KMS for PostgreSQL instances.
- Transparent to the application.

**Core PostgreSQL** (upcoming):
- As of July 2025, on-disk database encryption is being developed for core PostgreSQL, indicating future native support.

### MongoDB Encryption

MongoDB provides multiple encryption layers:

**Encryption at Rest**:
- Uses **AES-256** encryption.
- MongoDB Enterprise Advanced supports KMIP-enabled key providers.
- Available on Atlas with all cloud providers.

**Client-Side Field-Level Encryption (CSFLE)**:
- Selectively encrypts sensitive fields (e.g., patient SSN, health data).
- Each field can be secured with its own encryption key.
- Data is encrypted on the client side using customer-managed keys **before it reaches the database**.

**Queryable Encryption** (latest):
- Encrypted fields cannot be decrypted by the server.
- Data remains protected **in transit, at rest, AND in use** (including during query execution).
- Enables compliance with GDPR, HIPAA, CCPA.
- Particularly relevant for HDS compliance where health data must remain confidential even from infrastructure administrators.

### HDS Encryption Requirements

Under HDS 2.0:
- **Encryption at rest and in transit** is mandatory.
- Strict access controls required.
- Regular compliance security audits within three years of certification.
- Personal health data must be stored exclusively within the **EEA**.

### Sources

- [Percona pg_tde - GitHub](https://github.com/percona/pg_tde)
- [Percona Brings TDE to Postgres | The New Stack](https://thenewstack.io/percona-brings-transparent-data-encryption-to-postgres/)
- [Percona TDE for PostgreSQL Documentation](https://docs.percona.com/pg-tde/)
- [EDB Transparent Data Encryption](https://www.enterprisedb.com/docs/tde/latest/)
- [Everything You Need to Know About Postgres Data Encryption | EDB](https://www.enterprisedb.com/blog/everything-need-know-postgres-data-encryption)
- [Coming to PostgreSQL: On-Disk Database Encryption | The Register](https://www.theregister.com/2025/07/02/postgresql_ondisk_database_encryption/)
- [PostgreSQL TDE Wiki](https://wiki.postgresql.org/wiki/Transparent_Data_Encryption)
- [MongoDB Data Encryption](https://www.mongodb.com/products/capabilities/security/encryption)
- [Encryption at Rest - MongoDB Docs](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)
- [MongoDB Queryable Encryption](https://www.mongodb.com/blog/post/strengthen-data-security-mongodb-queryable-encryption)
- [MongoDB Encryption Techniques](https://www.datasunrise.com/knowledge-center/mongodb-encryption/)

---

## 6. Multi-Database Architecture Patterns

### Polyglot Persistence for Healthcare

Polyglot persistence is the strategic use of multiple database technologies within a single system, where each microservice is matched to the most appropriate database for its data model and access patterns.

**Key Principles**:
- Each database model (relational, document, key-value, column family, graph, search) has its own advantages; there is no universal solution.
- Microservices architecture enables compartmentalized data storage in independently manageable modules.
- Benefits: increased adaptability, performance, and domain alignment.
- Trade-offs: increased governance and operational complexity.

### When to Use Which Database (JIM Application)

| Data Type | Recommended DB | Rationale |
|-----------|---------------|-----------|
| **User accounts, auth** | PostgreSQL | ACID transactions, relational integrity |
| **Contracts, invoices** | PostgreSQL | Legal documents need transactional guarantees |
| **Professional profiles** | MongoDB | Flexible schema, embedded documents for varying specialties |
| **Geolocation matching** | MongoDB (2dsphere) | Native geospatial indexes, proximity queries |
| **Full-text search** | PostgreSQL FTS (basic) or Elasticsearch (advanced) | Depends on complexity requirements |
| **Session data** | Redis | Sub-millisecond access, TTL expiration |
| **Caching** | Redis | In-memory speed, JSON support |
| **Real-time notifications** | Redis Pub/Sub + Streams | Low-latency messaging, WebSocket integration |
| **Audit logs** | TimescaleDB (PostgreSQL extension) | Time-series optimization, compression, retention policies |
| **Messaging/chat** | MongoDB or PostgreSQL | Depends on message structure and query patterns |
| **File storage** | Object Storage (S3-compatible) | Contract PDFs, profile photos, medical documents |
| **Analytics/reporting** | PostgreSQL + TimescaleDB | SQL-based analytics with time-series optimization |

### Architectural Patterns for Data Consistency

- **Saga Workflows**: Manage distributed transactions across multiple databases.
- **Event Sourcing**: Capture all changes as a sequence of events.
- **Outbox Pattern**: Ensure reliable event publishing alongside database writes.
- **CQRS (Command Query Responsibility Segregation)**: Separate read and write models.

### Emerging Trends (2025-2026)

- **Multi-Model Databases**: ArangoDB and CosmosDB offer multiple data models within a single system.
- **Serverless Database Services**: Reduce operational overhead (e.g., MongoDB Atlas Serverless, Aurora Serverless).
- **AI-Driven Database Selection**: ML models to recommend optimal database technologies.
- **Unified Query Languages**: GraphQL and Presto enable querying across heterogeneous databases.

### Sources

- [How to Maintain Polyglot Persistence for Microservices | TechTarget](https://www.techtarget.com/searchapparchitecture/tip/The-basics-of-polyglot-persistence-for-microservices-data)
- [Polyglot Persistence: A Strategic Approach to Modern Data Architecture | Medium](https://medium.com/@rachoork/polyglot-persistence-a-strategic-approach-to-modern-data-architecture-e2a4f957f50b)
- [Polyglot Persistence in Microservices: Managing Data Diversity | arXiv](https://arxiv.org/abs/2509.08014)
- [Polyglot Persistence Powering Microservices | InfoQ](https://www.infoq.com/articles/polyglot-persistence-microservices/)
- [Polyglot Persistence: A Comprehensive Guide | The Developer Space](https://thedeveloperspace.com/polyglot-persistence/)
- [A Framework Model for Supporting Transparent Polyglot Persistence | SciTePress](https://www.scitepress.org/Papers/2025/133693/133693.pdf)

---

## 7. TimescaleDB for Audit Logs & Compliance Tracking

### Why TimescaleDB for Audit Logs

TimescaleDB is a PostgreSQL extension optimized for time-series data, making it ideal for healthcare audit logs and compliance tracking:

**Performance vs. Plain PostgreSQL**:
- **Time-based aggregations**: TimescaleDB is **61% faster** (170.9ms vs 443.2ms).
- **Time-ordered queries**: **450x to 14,000x faster** due to chunk-based architecture.
- **Insert rates at scale**: **20x higher** (111K rows/sec vs 30K rows/sec at 200M+ rows).
- **Storage efficiency**: Up to **90% reduction** in storage utilization through native compression.
- **Simple queries**: ~few ms slower due to slightly larger planning time overhead (acceptable trade-off).

**Architecture Advantage**:
- **Hypertable architecture** automatically partitions time-series data into chunks based on time intervals.
- Queries only scan relevant chunks instead of the entire dataset, dramatically reducing I/O.
- Native **data retention policies** allow automatic deletion of old audit data (e.g., keep 6+ years per HIPAA/HDS requirements).
- **Continuous aggregates** for pre-computed compliance reports.

### Healthcare Compliance Features

- **pgAudit Extension**: Supported in TimescaleDB Cloud, provides detailed session and object audit logging.
- **HIPAA Compliance**: Timescale Cloud Enterprise plan is HIPAA-compliant.
- **Audit Requirements**: HDS/GDPR require audit trails of all data access and modifications -- TimescaleDB's time-series optimization handles this efficiently at scale.

### JIM Use Cases

- **User activity audit logs**: Track every login, profile view, contract action.
- **Data access logs**: Record who accessed what health data and when (HDS requirement).
- **API request logging**: Time-series metrics for monitoring and compliance.
- **Compliance reporting**: Pre-computed aggregates for regulatory audits.
- **System metrics**: Application performance monitoring.

### Sources

- [TimescaleDB - GitHub](https://github.com/timescale/timescaledb)
- [TimescaleDB vs PostgreSQL for Time-Series](https://www.timescale.com/blog/timescaledb-vs-6a696248104e/)
- [Managing Time-Series Data: Why TimescaleDB Beats PostgreSQL](https://maddevs.io/writeups/time-series-data-management-with-timescaledb/)
- [PostgreSQL vs TimescaleDB | InfluxData](https://www.influxdata.com/comparison/postgres-vs-timescaledb)
- [PostgreSQL vs TimescaleDB Comparison 2025](https://pgbench.com/comparisons/postgres-vs-timescaledb/)
- [Tiger Data / TimescaleDB Documentation](https://docs.tigerdata.com/about/latest/changelog/)
- [Installing TimescaleDB for Storing Audit Data | SecureAuth](https://docs.secureauth.com/ciam/en/installing-and-configuring-timescaledb-for-storing-audit-data.html)
- [HIPAA Audit Log Requirements 2025 | Kiteworks](https://www.kiteworks.com/hipaa-compliance/hipaa-audit-log-requirements/)
- [What Is Audit Logging in PostgreSQL | Tiger Data](https://www.tigerdata.com/learn/what-is-audit-logging-and-how-to-enable-it-in-postgresql)

---

## 8. HDS 2.0 Compliance & Hosting Providers

### HDS 2.0 Framework (Updated 2024-2025)

HDS (Hebergeur de Donnees de Sante) is a French regulatory certification mandated by the French Public Health Code for all organizations hosting personal health data collected during health activities in France.

**HDS v2.0 Key Requirements**:
- **Data sovereignty**: Personal health data must be stored exclusively within the **European Economic Area (EEA)**.
- **Encryption**: Both at rest and in transit is mandatory.
- **Access controls**: Strict identity and access management.
- **Security audits**: Regular compliance audits required.
- **Mandatory contract terms**: Specific sovereignty and transparency obligations.
- **Deadline**: After **May 16, 2026**, only HDS v2.0 certified actors can legally host health data for third parties. No exemptions or extensions.

### HDS-Certified Cloud Providers (as of 2025)

**Hyperscale Providers**:

| Provider | HDS Status | PostgreSQL | MongoDB | Redis | Notes |
|----------|-----------|------------|---------|-------|-------|
| **Google Cloud** | HDS v2.0 (July 2025) | Cloud SQL | MongoDB Atlas | Memorystore | First hyperscaler with v2.0 |
| **AWS** | HDS certified (Jan 2025) | RDS/Aurora | MongoDB Atlas | ElastiCache | 24 AWS regions certified |
| **Microsoft Azure** | HDS certified | Azure DB for PostgreSQL | MongoDB Atlas | Azure Cache for Redis | Dynamics 365 & M365 also certified |

**French/European Providers (sovereign options)**:

| Provider | HDS Status | Key Offerings | Notes |
|----------|-----------|---------------|-------|
| **Scalingo** | HDS + ISO 27001 | Managed PostgreSQL, MongoDB, Redis, Elasticsearch | French PaaS, datacenters in Paris |
| **Clever Cloud** | HDS + ISO 27001 | Managed PostgreSQL, MongoDB, Redis | French PaaS, Gravelines HDS region, EU-only hosting |
| **OVHcloud** | HDS certified (since 2016) | Managed PostgreSQL, Kubernetes | Major French cloud player, sovereign cloud option |

**MongoDB Atlas on HDS Infrastructure**:
- MongoDB Atlas is directly HDS-certified.
- Deployable on HDS-compliant regions of AWS, GCP, or Azure within the EEA.
- Updated compliance as of March 2025.

### Recommendation for JIM

For maximum sovereignty and HDS v2.0 compliance:
1. **Option A (Sovereign)**: Use Scalingo or Clever Cloud for managed PostgreSQL + MongoDB + Redis -- all French-hosted, HDS-certified, GDPR-compliant by design.
2. **Option B (Hybrid)**: Use a French PaaS for PostgreSQL/Redis + MongoDB Atlas (HDS-certified) on an EU region.
3. **Option C (Hyperscale)**: Use AWS/GCP/Azure EU regions -- all HDS-certified, but with potential sovereignty concerns under HDS v2.0's stricter requirements.

### Sources

- [Liste des hebergeurs certifies HDS | esante.gouv.fr](https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies)
- [Certification HDS - Tout savoir | esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)
- [HDS & ASIP Sante - Google Cloud Compliance](https://cloud.google.com/security/compliance/hds)
- [Health Data Hosting (HDS) France - Microsoft Compliance](https://learn.microsoft.com/en-us/compliance/regulatory/offering-hds-france)
- [AWS Achieves HDS Certification for 24 Regions](https://aws.amazon.com/blogs/security/aws-achieves-hds-certification-for-24-aws-regions/)
- [HDS Cloud: Secure Hosting with Clever Cloud](https://www.clever.cloud/blog/features/2025/03/19/hds-cloud-secure-hosting-of-healthcare-data-with-clever-cloud/)
- [Health Data Hosting | Clever Cloud](https://www.clever.cloud/health-data-hosting/)
- [Clever Cloud Opens Gravelines HDS Region](https://www.clever.cloud/blog/company/2024/02/14/clever-cloud-opens-a-new-gravelines-hds-region/)
- [HDS Certification Explained: Scalingo's Guide](https://scalingo.com/blog/health-data-hosting)
- [OVHcloud HDS Certification](https://www.ovhcloud.com/en/compliance/hds/)
- [MongoDB HDS Certification](https://www.mongodb.com/products/platform/trust/hds)
- [Evolution of the HDS Framework - Wavestone RiskInsight](https://www.riskinsight-wavestone.com/en/2025/05/evolution-of-the-hds-framework-towards-enhanced-security-and-sovereignty/)
- [HDS Certification Requirements | Qualysec](https://qualysec.com/hds-certification-requirements/)
- [France Publishes Updated HDS Certification Standard | Inside Privacy](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)
- [Certification HDS v2.0 | DSIH](https://dsih.fr/articles/6084/certification-hebergeur-de-donnees-de-sante-hds-version-20-six-mois-pour-etre-pret)

---

## 9. Recommended Architecture for JIM

Based on this research, the following polyglot persistence architecture is recommended for the JIM application:

### Primary Stack

```
+------------------------------------------------------------------+
|                        JIM Application                            |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+    +---------------+ |
|  |   PostgreSQL 17+ |    |    MongoDB       |    |    Redis 8    | |
|  |   (+ TimescaleDB)|    |    Atlas (HDS)   |    |               | |
|  +------------------+    +------------------+    +---------------+ |
|  | - User accounts  |    | - Professional   |    | - Sessions    | |
|  | - Contracts      |    |   profiles       |    | - Caching     | |
|  | - Invoices       |    | - Geospatial     |    | - Pub/Sub     | |
|  | - Reference data |    |   matching       |    | - Rate limits | |
|  | - Audit logs     |    | - Availability   |    | - Geo cache   | |
|  |   (TimescaleDB)  |    |   calendars      |    |               | |
|  | - Full-text      |    | - Messages       |    |               | |
|  |   search (basic) |    |                  |    |               | |
|  +------------------+    +------------------+    +---------------+ |
|                                                                    |
|  +------------------+    +------------------+                      |
|  | Object Storage   |    | Elasticsearch    |                      |
|  | (S3-compatible)  |    | (Phase 2)        |                      |
|  +------------------+    +------------------+                      |
|  | - Contract PDFs  |    | - Advanced search|                      |
|  | - Medical docs   |    | - Fuzzy matching |                      |
|  | - Profile photos |    | - Analytics      |                      |
|  +------------------+    +------------------+                      |
+------------------------------------------------------------------+
```

### Encryption Strategy

| Layer | Technology | Notes |
|-------|-----------|-------|
| **PostgreSQL at rest** | Percona pg_tde or cloud-native encryption | AES-256, KMIP integration |
| **MongoDB at rest** | Atlas built-in encryption (AES-256) | Automatic on Atlas |
| **MongoDB field-level** | Client-Side Field-Level Encryption | For PHI fields (SSN, health data) |
| **MongoDB queryable** | Queryable Encryption | Encrypted even during queries |
| **Redis** | TLS in transit + encrypted storage | Redis Enterprise or cloud-managed |
| **In transit** | TLS 1.3 everywhere | Mandatory under HDS |
| **Key management** | HashiCorp Vault or cloud KMS | Centralized key management |

### Hosting Recommendation

For a French healthcare startup building JIM:

1. **Start with Scalingo or Clever Cloud** (French PaaS, HDS-certified) for PostgreSQL and Redis.
2. **Use MongoDB Atlas** (HDS-certified) on an EU region (Paris preferred) for profile/matching data.
3. **Add Elasticsearch/OpenSearch** in Phase 2 if PostgreSQL FTS proves insufficient for advanced professional search.
4. **Use S3-compatible object storage** (OVHcloud Object Storage or Scaleway) for document storage.
5. **Ensure HDS v2.0 compliance before May 16, 2026 deadline**.

### Key Compliance Dates

- **NOW (Feb 2026)**: HDS v2.0 transition period ending soon.
- **May 16, 2026**: Only HDS v2.0 certified hosts can legally continue hosting health data.
- **Ongoing**: Regular security audits, encryption at rest + in transit, access logging, data sovereignty within EEA.

---

*Research compiled from web searches conducted 2026-02-24. All source URLs verified at time of research.*
