# Backend Technologies for Healthcare Applications - Research Report
## Context: JIM - French Physiotherapist Professional Networking App
**Date:** 2026-02-24
**Scope:** Backend frameworks, API gateways, message queues, API paradigms, microservices patterns for HDS-compliant French healthcare ecosystem

---

## Table of Contents
1. [Node.js/NestJS for Healthcare APIs](#1-nodejsnestjs-for-healthcare-apis)
2. [Go (Golang) for Healthcare Backends](#2-go-golang-for-healthcare-backends)
3. [Python/FastAPI for Healthcare](#3-pythonfastapi-for-healthcare)
4. [API Gateway Solutions](#4-api-gateway-solutions)
5. [Message Queues for Healthcare](#5-message-queues-for-healthcare)
6. [GraphQL vs REST for Mobile Health Apps](#6-graphql-vs-rest-for-mobile-health-apps)
7. [Microservices Patterns for Healthcare](#7-microservices-patterns-for-healthcare)
8. [HDS 2.0 and French Ecosystem Specifics](#8-hds-20-and-french-ecosystem-specifics)
9. [Pro Sante Connect Integration](#9-pro-sante-connect-integration)
10. [Comparative Analysis and Recommendations for JIM](#10-comparative-analysis-and-recommendations-for-jim)

---

## 1. Node.js/NestJS for Healthcare APIs

### Current State (2025-2026)

NestJS has solidified its position as one of the strongest choices for TypeScript-first backend development in 2026. By the mid-2020s, NestJS became a common choice for TypeScript-first organizations wanting predictable architecture in Node backends. It provides an opinionated way of building large-scale applications and is primarily used for enterprise applications with built-in support for microservices, GraphQL, and dependency injection.

**Sources:**
- [What Is NestJS? A Practical 2026 Guide to Building Scalable Node.js Backends](https://thelinuxcode.com/what-is-nestjs-a-practical-2026-guide-to-building-scalable-nodejs-backends/)
- [2025 NestJS BE Roadmap: Beginner to Senior Level](https://dev.to/tak089/nestjs-roadmap-for-2025-5jj)

### TypeScript Ecosystem Maturity

- **FHIR support in TypeScript:** The SMART on FHIR JavaScript library provides TypeScript type definitions. Client libraries are written in TypeScript, supporting integration with NestJS applications. The `fhirclient` npm package offers FHIR capabilities for Node.js.
- **OpenID Connect:** OpenID Connect provider modules are available for the Nest framework, enabling authentication system integration. This is critical for Pro Sante Connect compatibility.
- **Medplum:** An open-source healthcare platform built entirely in TypeScript, demonstrating the ecosystem's maturity for healthcare use cases. Supports SMART on FHIR v1.0 and v2.0, with authentication via OpenID Connect and authorization via OAuth 2.0.

**Sources:**
- [SMART on FHIR JavaScript Library](http://docs.smarthealthit.org/client-js/)
- [GitHub - smart-on-fhir/client-node](https://github.com/smart-on-fhir/client-node)
- [GitHub - medplum/medplum](https://github.com/medplum/medplum)
- [fhirclient - npm](https://www.npmjs.com/package/fhirclient)

### Scalability for Microservices

NestJS provides first-class support for building microservices with its modular architecture, dependency injection, and built-in transport layer abstractions. Key capabilities:

- **Communication protocols:** Out-of-the-box support for TCP, Redis, RabbitMQ, NATS, and gRPC transport layers.
- **Microservice patterns:** Proven NestJS microservices architecture blueprints exist covering service boundaries, RabbitMQ/Kafka/gRPC, API gateway, CQRS, sagas, outbox pattern, and observability.
- **Independent scaling:** Each service can scale independently based on traffic and usage.
- **Technology flexibility:** Teams can choose the most suitable technologies for each microservice within the NestJS ecosystem.

**Sources:**
- [NestJS Microservices Blueprint That Actually Scales (Jan 2026)](https://medium.com/@Modexa/nestjs-microservices-blueprint-that-actually-scales-9ab714f31e72)
- [Microservices | NestJS Official Documentation](https://docs.nestjs.com/microservices/basics)
- [How to Implement Microservices with NestJS (Feb 2026)](https://oneuptime.com/blog/post/2026-02-02-nestjs-microservices/view)
- [Build a Microservice Architecture with NestJS](https://www.telerik.com/blogs/build-microservice-architecture-nestjs)
- [GitHub - nestjs-microservices-example](https://github.com/Denrox/nestjs-microservices-example)

### Relevance for JIM

**Strengths:**
- Native TypeScript provides strong typing for healthcare data models (patient records, professional profiles, contracts)
- Built-in support for OpenID Connect fits Pro Sante Connect integration
- CQRS and saga pattern support out of the box
- Large ecosystem and community support
- Modular architecture maps well to JIM's 6 microservices (Auth, Profiles, Matching, Contracts, Notifications, Messaging)

**Weaknesses:**
- Node.js single-threaded model can be a bottleneck for CPU-intensive operations
- Lower raw throughput compared to Go for high-concurrency scenarios

---

## 2. Go (Golang) for Healthcare Backends

### Performance

Go's compiled nature and lightweight runtime deliver exceptional performance for backend services:

- **Concurrency:** Go's goroutine-based concurrency model allows services to process thousands of requests in parallel without the overhead of traditional threads.
- **Low memory footprint:** Lightweight binaries and minimal runtime overhead make it ideal for microservice architectures.
- **Fast startup times:** Critical for containerized and serverless deployments.
- **Benchmarks:** Go frameworks like Fiber are approximately 7.5x to 11x faster than Express.js and FastAPI respectively for text-serving workloads.

**Sources:**
- [Why You Should Choose Go for Your Next Backend Project in 2026](https://medium.com/@kalyanasundaramthivaharan/why-you-should-choose-go-for-your-next-backend-in-2026-e2210d13f8f0)
- [Why Golang Is Ideal for Microservices Architecture (2026 and Beyond)](https://medium.com/@amin-softtech/why-golang-is-ideal-for-microservices-architecture-2026-and-beyond-fd0775c97d4c)
- [FastAPI vs. Fastify vs. Spring Boot vs. Gin Benchmark](https://www.travisluong.com/fastapi-vs-fastify-vs-spring-boot-vs-gin-benchmark/)

### Adoption in Health Tech

Healthcare systems require processing vast amounts of patient data in real-time without downtime or delays. Go's efficiency in handling concurrent operations makes it ideal for:
- Telemedicine platforms
- Real-time patient monitoring
- Clinical decision support systems (CDSS)
- High-performance service clusters

Tech giants such as Uber, Netflix, and Google rely heavily on Go for microservices-based platforms. The Go ecosystem in 2025 remains healthy, stable, and mature, continuing to be a leading choice for backend, infrastructure, and cloud-native systems.

**Sources:**
- [The Go Ecosystem in 2025: Key Trends (JetBrains)](https://blog.jetbrains.com/go/2025/11/10/go-language-trends-ecosystem-2025/)
- [Golang in 2026: Usage, Trends, and Popularity](https://www.zenrows.com/blog/golang-popularity)
- [The Future of Golang (Go) in 2026](https://www.ksolves.com/blog/golang/trends-shaping-the-next-generation)
- [Building Microservices with Go](https://www.apriorit.com/dev-blog/building-microservices-with-golang)
- [Microservices in Go - Encore Cloud](https://encore.cloud/resources/go-microservices)

### Microservices Patterns

Go is particularly well-suited for microservices due to:
- Built-in concurrency primitives (goroutines, channels)
- Small container images (important for Kubernetes deployments)
- Strong standard library for HTTP, networking, and cryptography
- Excellent support for gRPC inter-service communication
- In 2026, Go continues to be deployed on containers, Kubernetes, serverless, and edge platforms

**Sources:**
- [Golang for Microservices: Top Reasons Developers Choose It](https://multiqos.com/blogs/golang-for-microservices/)
- [Golang vs. Java in 2026: Performance, Scalability](https://graffersid.com/golang-vs-java-what-should-you-choose/)

### Relevance for JIM

**Strengths:**
- Exceptional performance for matching algorithms and real-time messaging
- Ideal for high-throughput notification systems
- Excellent Kubernetes/container support for HDS-certified infrastructure
- Strong cryptography standard library for healthcare security

**Weaknesses:**
- Smaller ecosystem for healthcare-specific libraries (FHIR, HL7) compared to TypeScript/Python
- Less opinionated framework ecosystem; requires more architectural decisions
- Steeper learning curve for teams familiar with JavaScript/TypeScript
- No direct FHIR resource validation libraries as mature as Python's fhir.resources

---

## 3. Python/FastAPI for Healthcare

### FHIR Integration

Python has the most mature FHIR ecosystem:

- **fhir.resources:** The latest version (8.2.0, released February 2, 2026) is powered by Pydantic V2, making it faster in performance. It provides full FHIR data modeling and validation built on modern Python type hints.
- **FHIR Facade pattern:** FastAPI enables building a "FHIR Facade" to bridge legacy systems and modern applications, exposing data through a compliant API without requiring a complete database overhaul.
- **Implementation approach:** FastAPI + Uvicorn (ASGI server) + fhir.resources provides high performance and automatic data validation using Pydantic models. Endpoints can be secured with OAuth2 scopes and JWT-based authentication.
- **SMART on FHIR:** The `client-py` library provides Python client support for SMART on FHIR.

**Sources:**
- [FHIR Integration: Build Modern Healthcare Apps Using Python and FastAPI](https://dev.to/wellallytech/fhir-integration-build-modern-healthcare-apps-using-python-and-fastapi-5cdf)
- [A Developer's Guide to the FHIR Standard with a FastAPI Implementation](https://www.wellally.tech/blog/build-fhir-api-with-fastapi)
- [fhir.resources on PyPI](https://pypi.org/project/fhir.resources/)
- [Building a HIPAA-Compliant FHIR API with FastAPI](https://medium.com/@petercovingtonmitchell/building-a-hipaa-compliant-fhir-api-with-fastapi-a-step-by-step-guide-f6d2897383ee)
- [Healthcare API Interoperability and FHIR Guide 2026](https://www.clindcast.com/healthcare-api-interoperability-and-fhir-guide-2026/)
- [GitHub - smart-on-fhir/client-py](https://github.com/smart-on-fhir/client-py)

### ML/AI Capabilities

FastAPI demand correlates strongly with AI/ML adoption. Python has seen approximately 7% usage growth going into 2025-2026, largely because it remains the default language for machine learning and data pipelines. This is relevant for JIM's potential future features:
- Intelligent matching algorithms for replacement physiotherapist pairing
- Predictive analytics for availability patterns
- NLP for contract analysis or messaging features

**Sources:**
- [FastAPI vs Node.js: Usage, Speed and Popularity in 2026](https://www.secondtalent.com/resources/fastapi-vs-node-js-usage-speed-and-popularity/)
- [12 Best Backend Frameworks to Use in 2026](https://www.index.dev/blog/best-backend-frameworks-ranked)

### Async Performance

- FastAPI is one of the fastest Python frameworks, leveraging Python's async/await syntax and type hints.
- For database-heavy operations (fetch, update, serialize), FastAPI performs faster than NestJS/Express.
- **Critical caveat:** FastAPI is not fast out of the box. Correct async database drivers (e.g., asyncpg) and faster JSON libraries are required to match Node.js performance levels.
- For pure text serving, Go remains 7.5-11x faster.

**Sources:**
- [FastAPI vs. Express.js vs. Flask vs. Nest.js Benchmark](https://www.travisluong.com/fastapi-vs-express-js-vs-flask-vs-nest-js-benchmark/)
- [FastAPI Benchmarks (Official)](https://fastapi.tiangolo.com/benchmarks/)
- [FastAPI vs NestJS: Which One Wins for Modern APIs?](https://medium.com/@kaushalsinh73/fastapi-vs-nestjs-which-one-wins-for-modern-apis-98d9f3242c6b)

### Relevance for JIM

**Strengths:**
- Best FHIR ecosystem maturity (fhir.resources, Pydantic validation)
- Ideal for ML/AI-powered matching algorithms
- Strong async performance for I/O-bound operations
- Excellent data validation through Pydantic

**Weaknesses:**
- GIL limitations for CPU-bound tasks (though mitigated in Python 3.13+ with free-threading)
- Less mature microservices framework ecosystem compared to NestJS
- Requires careful optimization to match Node.js/Go throughput
- Smaller community for enterprise microservices patterns

---

## 4. API Gateway Solutions

### Kong

- **Architecture:** Plugin-based architecture allowing developers to extend functionality by adding custom plugins.
- **Service discovery:** Requires external service discovery mechanism (Consul, etcd).
- **Performance:** Propagates changes in milliseconds.
- **Market share (Jan 2026):** 5.9% mindshare (down from 6.0%).
- **Strengths:** Extensive features for API traffic control and security; strong enterprise features for rate limiting, authentication, and analytics.

**Sources:**
- [Kong and Traefik API Gateway Comparison](https://api7.ai/kong-vs-traefik)
- [Kong Gateway Enterprise vs Traefik Enterprise (2026)](https://www.peerspot.com/products/comparisons/kong-gateway-enterprise_vs_traefik-enterprise)
- [Top 10 API Gateways in 2025](https://nordicapis.com/top-10-api-gateways-in-2025/)

### Traefik

- **Architecture:** Middleware-based architecture with streamlined request processing by chaining middleware functions.
- **Cloud-native:** Designed with cloud-native environments in mind; native integration with Kubernetes and Docker.
- **Service discovery:** Automatic service discovery and dynamic configuration.
- **Market share (Jan 2026):** 1.1% mindshare (up from 1.0%).
- **Strengths:** Simplicity, automatic configuration, particularly suitable for dynamic containerized environments.

**Sources:**
- [Kong and Traefik API Gateway Comparison](https://api7.ai/kong-vs-traefik)
- [Choosing an API Gateway: Kong vs Traefik vs Tyk](https://zuplo.com/learning-center/choosing-an-api-gateway)
- [API gateway framework: The complete 2026 guide for modern microservices](https://www.digitalapi.ai/blogs/api-gateway-framework-the-complete-2026-guide-for-modern-microservices)

### AWS API Gateway

- Fully managed service; no infrastructure to maintain.
- Native integration with AWS services (Lambda, ECS, IAM).
- Strong security features (WAF integration, throttling, API keys).
- **Caveat for HDS compliance:** AWS does not currently hold HDS v2.0 certification in France. Data sovereignty requirements under HDS v2.0 mandate storage within the EEA.

**Sources:**
- [Top 10 API Management Tools for 2026](https://zuplo.com/blog/top-10-api-management-tools-for-2025-a-deep-dive-for-architects)

### Comparison for HDS-Compliant Infrastructure

| Feature | Kong | Traefik | AWS API Gateway |
|---|---|---|---|
| Self-hosted (HDS control) | Yes | Yes | No (managed) |
| Kubernetes native | Via plugin | Native | N/A |
| Dynamic config | Via admin API | Automatic | Console/IaC |
| HDS compatibility | Deployable on HDS infrastructure | Deployable on HDS infrastructure | Requires AWS HDS certification |
| Open source | Yes (Community) | Yes | No |
| Plugin ecosystem | Very large | Moderate | AWS-native |

**Recommendation for JIM:** Traefik is the strongest candidate for HDS-compliant infrastructure due to its native Kubernetes integration, automatic service discovery, and ability to be self-hosted on HDS-certified providers like Scalingo or OVHcloud. Kong is a strong alternative if advanced API management features (rate limiting, analytics, developer portal) are required.

---

## 5. Message Queues for Healthcare

### RabbitMQ

- **Architecture:** General-purpose message broker supporting flexible messaging patterns, multiple protocols, and complex routing.
- **2025 improvements:** Hardened reliability with Quorum Queues, making it more viable for critical data than in the past.
- **Latency:** Sub-millisecond routing between microservices; often faster than Kafka for individual message delivery.
- **Strengths:** Complex message routing, task queues, traditional messaging patterns.
- **Healthcare use:** Practical multi-service healthcare workflows have been implemented using RabbitMQ (e.g., with Go and the Saga pattern for healthcare booking).

**Sources:**
- [Event-Driven Architecture: Kafka vs. RabbitMQ vs. Pulsar (2025 Decision Framework)](https://www.javacodegeeks.com/2025/12/event-driven-architecture-kafka-vs-rabbitmq-vs-pulsar-a-2025-decision-framework.html)
- [RabbitMQ vs. Kafka: Which One to Choose?](https://dev.to/guilhermesiqueira/rabbitmq-vs-kafka-which-one-to-choose-for-your-event-driven-architecture-3enm)
- [Kafka vs RabbitMQ: Key Differences & When to Use Each (DataCamp)](https://www.datacamp.com/blog/kafka-vs-rabbitmq)

### Apache Kafka

- **Architecture:** Event streaming platform designed for massive data ingestion and processing.
- **2025 improvements:** Shed ZooKeeper in favor of KRaft, lowering the barrier to entry. Kafka is now easier to deploy and operate.
- **Throughput:** Can handle millions of messages per second on modest hardware. Sequential I/O patterns allow it to saturate network links.
- **Strengths:** Event streaming, event sourcing, audit trail, multiple consumers reading the same messages, data replay.
- **Healthcare relevance:** Ideal for audit trails (critical in healthcare compliance), event sourcing, and scenarios where multiple services need the same event data.

**Sources:**
- [Apache Kafka vs. RabbitMQ: Comparing architectures](https://quix.io/blog/apache-kafka-vs-rabbitmq-comparison)
- [Event-Driven Architecture with Spring Boot: Kafka vs RabbitMQ (Jan 2026)](https://medium.com/@niteshthakur498/event-driven-architecture-with-spring-boot-kafka-vs-rabbitmq-75e1f2add1f5)
- [Kafka vs RabbitMQ (Jan 2026)](https://oneuptime.com/blog/post/2026-01-21-kafka-vs-rabbitmq/view)

### Redis Streams

- **Architecture:** Data structure within Redis combining message queue functionality with Redis's simplicity and speed.
- **Cost-effectiveness:** More cost-effective than Kafka or RabbitMQ for small to mid-scale deployments.
- **Message persistence:** Unlike Redis Pub/Sub, Streams provide message persistence and replayability.
- **Scale fit:** Best suited for thousands of messages per minute (not millions). For initial and mid-scale microservices architectures, Redis Streams avoids the operational complexity of Kafka.
- **Flexibility:** Allows mixing and matching data structures (caching, queues, streams) in a single system.

**Sources:**
- [Beyond the Hype: Why We Chose Redis Streams Over Kafka for Microservices](https://dev.to/mtk3d/beyond-the-hype-why-we-chose-redis-streams-over-kafka-for-our-microservices-dmc)
- [Kafka vs RabbitMQ vs Redis Streams - Which One Should Developers Choose in 2025?](https://www.javaoneworld.com/2025/10/kafka-vs-rabbitmq-vs-redis-streams.html)
- [Microservices Communication with Redis Streams (Redis official)](https://redis.io/tutorials/howtos/solutions/microservices/interservice-communication/)
- [Event-Driven Architecture Using Redis Streams (Harness)](https://www.harness.io/blog/event-driven-architecture-redis-streams)

### Comparison for JIM's Microservices

| Feature | RabbitMQ | Apache Kafka | Redis Streams |
|---|---|---|---|
| Throughput | Medium (10K-100K msg/s) | Very High (millions msg/s) | Medium (thousands-10K msg/s) |
| Latency | Sub-millisecond | Low milliseconds | Sub-millisecond |
| Message persistence | Configurable | Yes (log-based) | Yes (stream-based) |
| Complex routing | Excellent | Limited | Limited |
| Event replay | No (consumed = removed) | Yes (log retention) | Yes (stream retention) |
| Operational complexity | Moderate | High (improved with KRaft) | Low (part of Redis) |
| Audit trail | Limited | Excellent | Moderate |
| Best for JIM | Notifications, task queues | Event sourcing, audit logs | Lightweight inter-service messaging, caching combo |

**Recommendation for JIM:** A hybrid approach is most suitable:
- **RabbitMQ** for the primary message broker (notifications, contract workflows, matching events) due to complex routing needs and low latency
- **Redis Streams** for lightweight real-time messaging and caching (the Messaging microservice)
- **Consider Kafka** if audit trail requirements (HDS compliance) demand immutable event logs, or if future growth requires high-throughput event streaming

---

## 6. GraphQL vs REST for Mobile Health Apps

### Market Context

The global healthcare API market is projected to reach USD 4.0 billion by 2035, growing at a CAGR of approximately 25.7% from 2025 to 2035, driven by the rising demand for seamless integration of healthcare IT systems and interoperability among healthcare applications.

**Source:** [Healthcare API Market Size, Trends & Forecast 2025-2035](https://coremarketresearch.com/report/healthcare-api)

### GraphQL for Mobile Health Apps

- **Adoption trend:** Enterprise GraphQL usage has grown more than 340% since 2023, and nearly half of new API projects now consider GraphQL first.
- **Mobile advantage:** Returns only the data the client needs, minimizing data transfer over mobile networks and enhancing app performance.
- **Single query:** Unlike REST, which requires multiple requests for related data, GraphQL allows clients to request exactly what they need in a single query - particularly advantageous in healthcare where data is fragmented across various systems.
- **Healthcare suitability:** Gaining traction in healthcare for flexible and efficient data retrieval in mobile health applications and telemedicine platforms.

**Sources:**
- [GraphQL vs REST API: Which is Better for Your Project in 2025?](https://api7.ai/blog/graphql-vs-rest-api-comparison-2025)
- [REST API vs GraphQL: What Enterprises Should Choose in 2026?](https://www.bizdata360.com/rest-api-vs-graphql/)
- [GraphQL vs Rest APIs (Key Differences) 2026](https://www.f22labs.com/blogs/graphql-vs-rest-apis-key-differences-2025/)
- [GraphQL vs REST API 2025: Which One for Your Project?](https://aetherio.tech/en/articles/graphql-vs-rest-api-en-2025)

### REST for Healthcare APIs

- **FHIR standard:** FHIR is inherently REST-based, using RESTful APIs and supporting JSON and XML. REST remains the standard for healthcare data interoperability.
- **Widespread adoption:** REST APIs still lead with widespread use in 2025/2026.
- **Simplicity:** Easier caching, simpler security model, more straightforward compliance documentation.

**Sources:**
- [The Complete Guide to API Types in 2026](https://dev.to/sizan_mahmud0_e7c3fd0cb68/the-complete-guide-to-api-types-in-2026-rest-graphql-grpc-soap-and-beyond-191)
- [API integration guide (2025)](https://www.rudderstack.com/blog/the-definitive-guide-to-api-integrations/)

### Best Practices for 2026

| Aspect | GraphQL | REST |
|---|---|---|
| Mobile data efficiency | Excellent (single query) | Multiple round trips |
| Healthcare standards (FHIR) | Requires adaptation layer | Native fit |
| Caching | Complex (client-side) | Simple (HTTP caching) |
| Real-time (subscriptions) | Built-in | Requires WebSocket/SSE |
| API versioning | No versioning needed | Version management required |
| Security audit | More complex | Straightforward |
| Learning curve | Higher | Lower |

**Recommendation for JIM:** A **hybrid approach** is optimal:
- **REST** for external-facing APIs (Pro Sante Connect integration, FHIR compliance, inter-service communication)
- **GraphQL** for the mobile app BFF (Backend-for-Frontend) layer, optimizing data fetching for the React Native / Flutter app (profiles, matching results, contract details, messaging)
- **gRPC** for high-performance internal inter-service communication between microservices

---

## 7. Microservices Patterns for Healthcare

### Saga Pattern

The Saga pattern manages distributed transactions across multiple microservices by breaking them into a series of local transactions, with compensating transactions for rollback.

**Healthcare-specific implementations:**
- **Appointment scheduling:** Patient Management (verify patient details + insurance) -> Appointment Scheduler (book slot) -> Inventory Management (reserve equipment) -> Billing (process payment)
- **JIM application:** Replacement request -> Profile matching -> Availability verification -> Contract generation -> Notification dispatch

**Two implementation approaches:**
1. **Choreography:** Decentralized; each service listens for events and independently triggers subsequent actions. Better for simple workflows.
2. **Orchestration:** Centralized; a single orchestrator manages the transaction flow. Better for complex, multi-step workflows like JIM's matching-to-contract pipeline.

**Sources:**
- [Saga Design Pattern - A Complete Guide (2025)](https://www.scholarhat.com/tutorial/designpatterns/saga-design-pattern-microservices-guide)
- [Saga Pattern in Microservices: A Mastery Guide (Temporal)](https://temporal.io/blog/mastering-saga-patterns-for-distributed-transactions-in-microservices)
- [Saga Design Pattern - Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga)
- [Microservices Pattern: Saga](https://microservices.io/patterns/data/saga.html)
- [Transactions in Microservices: Part 1 - SAGA Patterns](https://dev.to/federico_bevione/transactions-in-microservices-part-1-saga-patterns-with-choreography-and-orchestration-4an9)

### Event Sourcing

Event sourcing persists the state of a business entity as a sequence of state-changing events. New events are appended to the list whenever state changes occur.

**Healthcare benefits:**
- **Audit trail:** Tracking every state change is critical in healthcare and compliance-heavy industries. This directly supports HDS compliance requirements.
- **Regulatory compliance:** A healthcare provider modernized its patient management system while ensuring regulatory compliance by focusing first on non-critical systems, with granular service boundaries enhancing data security.
- **Data reconstruction:** Complete history of all changes enables full reconstruction of state at any point in time.

**Sources:**
- [Microservices Pattern: Event Sourcing](https://microservices.io/patterns/data/event-sourcing.html)
- [Event Sourcing Pattern in Microservices Architectures](https://medium.com/design-microservices-architecture-with-patterns/event-sourcing-pattern-in-microservices-architectures-e72bf0fc9274)
- [Event-Driven Architecture Done Right (2025)](https://www.growin.com/blog/event-driven-architecture-scale-systems-2025/)

### CQRS (Command Query Responsibility Segregation)

CQRS separates read and write operations into different models and potentially different databases:
- **Command layer:** Separate service, model, and database for insert/update operations
- **Query layer:** Separate service, model, and database for read/query operations

**Combined with Event Sourcing:** The write side handles commands that produce events, while the read side maintains separate materialized views optimized for queries. Events stored in the write database serve as the source-of-truth, while the read database provides denormalized tables for fast queries.

**Sources:**
- [Microservices Pattern: CQRS](https://microservices.io/patterns/data/cqrs.html)
- [Microservices With CQRS and Event Sourcing (DZone)](https://dzone.com/articles/microservices-with-cqrs-and-event-sourcing)
- [Top 10 Microservices Design Patterns You Should Know in 2025](https://medium.com/javaguides/top-10-microservices-design-patterns-you-should-know-in-2025-9f3438e91ac6)

### Application to JIM's Microservices

| JIM Service | Recommended Patterns | Rationale |
|---|---|---|
| **Auth** | OAuth2/OIDC (Pro Sante Connect), Token management | Standard OIDC flow, stateless JWT tokens |
| **Profiles** | CQRS | Read-heavy (profile browsing); write-optimized for profile updates |
| **Matching** | CQRS + Event Sourcing + Saga (orchestration) | Complex matching workflow; audit trail for compliance; separate read model for fast queries |
| **Contracts** | Saga (orchestration) + Event Sourcing | Multi-step contract lifecycle; full audit trail for legal compliance |
| **Notifications** | Event-driven (choreography) | Fire-and-forget notifications triggered by events from other services |
| **Messaging** | Event-driven + CQRS | Real-time messaging requires fast reads; message history for compliance |

---

## 8. HDS 2.0 and French Ecosystem Specifics

### HDS v2.0 Certification Framework

- **Published:** May 2024, replacing the 2018 HDS framework.
- **Transition deadline:** All existing HDS-certified providers must renew under v2.0 by May 16, 2026. Full HDS v2 transition happens in March 2026.
- **Sovereignty requirements:**
  - Health data storage must be restricted to the territory of an EEA member state.
  - Transparency requirements for hosting provider's customers in the event of transfers outside the EEA.
- **Alignment:** ISO 27001, with additional healthcare-specific controls for cybersecurity and digital sovereignty.

**Sources:**
- [France Publishes Updated Certification Standard for the Hosting of Health Data](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)
- [Health data hosting: The new French HDS Certification](https://www.hoganlovells.com/en/publications/health-data-hosting-the-new-french-hds-certification-has-been-released)
- [HDS Certification Requirements & Compliance in France (Qualysec)](https://qualysec.com/hds-certification-requirements/)
- [HDS 2026 : Certification Hebergeur de Donnees de Sante - Guide Complet](https://www.ayinedjimi-consultants.fr/articles/conformite/hds-2026-certification-sante.html)

### HDS-Certified Cloud Providers for JIM

| Provider | HDS Status | Key Features | Relevance for JIM |
|---|---|---|---|
| **Scalingo** | HDS v2.0 certified (Sept 2025, valid until Sept 2028) | PaaS, all 6 HDS scopes, Paris datacenters, SecNumCloud-qualified region on 3DS Outscale | Best fit: managed PaaS simplifies deployment; full HDS v2.0 compliance; French sovereign hosting |
| **OVHcloud** | HDS certified since 2019 | IaaS/PaaS, French datacenters, Kubernetes managed service | Strong alternative: more infrastructure control; robust Kubernetes support |
| **Google Cloud** | HDS v2.0 certified (July 2025) | Full cloud suite, GKE for Kubernetes | Powerful but data sovereignty concerns under HDS v2.0 EEA requirements |
| **Microsoft Azure** | HDS certified | Full cloud suite, AKS for Kubernetes | Similar to Google Cloud; verify EEA data residency guarantees |
| **Clever Cloud** | HDS certified | PaaS, French company, French datacenters | Alternative French PaaS option |

**Sources:**
- [Scalingo - Health Data Hosting](https://doc.scalingo.com/compliance/hds)
- [Scalingo maintains ISO 27001 and HDS certifications](https://scalingo.com/blog/scalingo-iso27001-hds-certifications-next-secnumcloud)
- [OVHcloud HDS certification](https://www.ovhcloud.com/en/compliance/hds/)
- [Google Cloud Achieves HDS v2.0 Certification](https://security.googlecloudcommunity.com/ciso-blog-77/google-cloud-achieves-hds-v2-0-certification-raising-the-bar-for-secure-health-data-hosting-in-france-5906)
- [Liste des hebergeurs certifies HDS (officielle)](https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies)

---

## 9. Pro Sante Connect Integration

### Technical Overview

Pro Sante Connect (PSC) is the French healthcare professional identity provider, operating on the OpenID Connect (OIDC) protocol - an identification layer built on top of OAuth 2.0.

**Key technical characteristics:**
- **Protocol:** OpenID Connect (OIDC) with 3 REST calls and 4 endpoints (1 client-side, 3 provider-side)
- **Encryption:** Asymmetric encryption with 2048-bit RSA key, SHA-256 algorithm for tokens (identification and information tokens)
- **Authentication methods:** CPS card and e-CPS mobile application
- **Architecture:** Identity Provider Federation (FFI) to the OpenID standard

### 2025 Developments

Planned developments from 2025 aim to facilitate PSC use:
- Compatibility with new MIE (Moyens d'Identification Electronique) such as FIDO security keys
- Possibility for certain health establishments to become Pro Sante Connect identity providers themselves

### Integration Requirements

- Integration tests are mandatory on the pre-production environment
- Validation by ANS (Agence du Numerique en Sante) is required before production deployment
- The official technical documentation is available on the industrials portal

**Sources:**
- [Documentation technique Pro Sante Connect | Portail Industriels](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique)
- [API Pro Sante Connect | data.gouv.fr](https://www.data.gouv.fr/dataservices/api-pro-sante-connect)
- [Doctrine Numerique Sante 2025 | Pro Sante Connect](https://esante.gouv.fr/doctrine/pro-sante-connect-igc-sante)
- [Pro Sante Connect | Agence du Numerique en Sante](https://esante.gouv.fr/produits-services/pro-sante-connect)
- [Evolutions de Pro Sante Connect](https://esante.gouv.fr/espace-presse/avec-les-evolutions-de-pro-sante-connect-lidentification-electronique-des-professionnels-franchit-une-nouvelle-etape)
- [Pro Sante Connect - LemonLDAP Documentation](https://lemonldap-ng.org/documentation/2.0/authopenidconnect_prosanteconnect.html)

### Implementation for JIM Auth Microservice

The Auth microservice for JIM needs to:
1. Implement OIDC client flow against PSC endpoints
2. Handle CPS card and e-CPS mobile authentication callbacks
3. Map PSC identity tokens to internal JIM user profiles
4. Manage session tokens (JWT) for the mobile app
5. Support the mandatory pre-production testing and ANS validation process

**NestJS compatibility:** NestJS has OpenID Connect modules (e.g., `@nestjs/passport` with `passport-openidconnect` strategy) that can integrate with Pro Sante Connect. The OIDC flow is standard and well-supported.

---

## 10. Comparative Analysis and Recommendations for JIM

### Framework Comparison Matrix

| Criterion | NestJS (TypeScript) | Go | FastAPI (Python) |
|---|---|---|---|
| **Microservices support** | Excellent (built-in) | Excellent (manual/frameworks) | Good (manual setup) |
| **TypeScript/Type safety** | Native | Static typing (Go) | Type hints + Pydantic |
| **FHIR ecosystem** | Good (npm libraries) | Limited | Excellent (fhir.resources) |
| **OpenID Connect** | Excellent (passport) | Good (libraries exist) | Good (authlib) |
| **Performance (throughput)** | Medium-High | Very High | Medium-High (async) |
| **Developer productivity** | High (opinionated) | Medium (verbose) | High (concise) |
| **CQRS/Saga support** | Built-in patterns | Manual implementation | Manual implementation |
| **Community/ecosystem** | Very large | Large | Growing fast |
| **Healthcare adoption** | Growing | Niche but strong | Strong (ML/data) |
| **HDS deployment** | Easy (Node containers) | Easy (small containers) | Easy (ASGI containers) |
| **Team availability (France)** | High | Medium | High |

### Recommended Architecture for JIM

Based on the comprehensive analysis, the following architecture is recommended:

**Primary Backend Framework: NestJS (TypeScript)**
- Best overall fit for JIM's 6 microservices with built-in support for CQRS, saga orchestration, and multiple transport layers
- Native OpenID Connect support for Pro Sante Connect
- Strong TypeScript ecosystem for healthcare data modeling
- Highest developer availability in the French market
- Modular architecture maps directly to JIM's service boundaries

**Performance-Critical Services: Consider Go**
- The Matching microservice (if algorithm-heavy) could benefit from Go's raw performance
- The Messaging microservice could leverage Go's concurrency for real-time WebSocket handling
- Only recommended if the team has Go expertise

**ML/AI Features: Python/FastAPI as a Sidecar**
- If intelligent matching or predictive analytics are planned, use FastAPI microservices alongside the NestJS core
- Leverage Python's ML ecosystem (scikit-learn, TensorFlow, PyTorch)

**API Layer:**
- REST for external APIs and inter-service communication
- GraphQL BFF for the mobile app (optimized data fetching)
- gRPC for high-performance internal service-to-service calls

**API Gateway: Traefik**
- Native Kubernetes integration for HDS-certified infrastructure
- Automatic service discovery
- Self-hosted on HDS-certified provider

**Message Broker: RabbitMQ (primary) + Redis (caching/lightweight messaging)**
- RabbitMQ for complex routing (notifications, contract workflows, matching events)
- Redis Streams for real-time messaging and caching
- Consider Kafka later for audit trail/event sourcing if compliance demands it

**Infrastructure: Scalingo or OVHcloud**
- Scalingo: PaaS simplicity with full HDS v2.0 certification
- OVHcloud: More control with managed Kubernetes and HDS certification

**Microservices Patterns:**
- CQRS for Profiles (read-heavy) and Matching (separate query optimization)
- Saga orchestration for Contracts and Matching workflows
- Event sourcing for Contracts (full audit trail for legal/HDS compliance)
- Event-driven choreography for Notifications

---

## Summary of All Sources

### NestJS / Node.js
- https://thelinuxcode.com/what-is-nestjs-a-practical-2026-guide-to-building-scalable-nodejs-backends/
- https://dev.to/tak089/nestjs-roadmap-for-2025-5jj
- https://medium.com/@Modexa/nestjs-microservices-blueprint-that-actually-scales-9ab714f31e72
- https://docs.nestjs.com/microservices/basics
- https://oneuptime.com/blog/post/2026-02-02-nestjs-microservices/view
- https://www.telerik.com/blogs/build-microservice-architecture-nestjs
- https://github.com/Denrox/nestjs-microservices-example
- https://thenewstack.io/configure-microservices-in-nestjs-a-beginners-guide/
- https://talent500.com/blog/nestjs-microservices-guide/

### Go (Golang)
- https://medium.com/@kalyanasundaramthivaharan/why-you-should-choose-go-for-your-next-backend-in-2026-e2210d13f8f0
- https://medium.com/@amin-softtech/why-golang-is-ideal-for-microservices-architecture-2026-and-beyond-fd0775c97d4c
- https://blog.jetbrains.com/go/2025/11/10/go-language-trends-ecosystem-2025/
- https://www.zenrows.com/blog/golang-popularity
- https://www.ksolves.com/blog/golang/trends-shaping-the-next-generation
- https://www.apriorit.com/dev-blog/building-microservices-with-golang
- https://encore.cloud/resources/go-microservices
- https://multiqos.com/blogs/golang-for-microservices/
- https://graffersid.com/golang-vs-java-what-should-you-choose/
- https://codewave.com/insights/go-language-ownership-application/

### Python / FastAPI
- https://dev.to/wellallytech/fhir-integration-build-modern-healthcare-apps-using-python-and-fastapi-5cdf
- https://www.wellally.tech/blog/build-fhir-api-with-fastapi
- https://pypi.org/project/fhir.resources/
- https://medium.com/@petercovingtonmitchell/building-a-hipaa-compliant-fhir-api-with-fastapi-a-step-by-step-guide-f6d2897383ee
- https://www.clindcast.com/healthcare-api-interoperability-and-fhir-guide-2026/
- https://github.com/smart-on-fhir/client-py
- https://fastapi.tiangolo.com/benchmarks/
- https://www.travisluong.com/fastapi-vs-express-js-vs-flask-vs-nest-js-benchmark/
- https://www.secondtalent.com/resources/fastapi-vs-node-js-usage-speed-and-popularity/

### API Gateways
- https://api7.ai/kong-vs-traefik
- https://www.peerspot.com/products/comparisons/kong-gateway-enterprise_vs_traefik-enterprise
- https://nordicapis.com/top-10-api-gateways-in-2025/
- https://zuplo.com/learning-center/choosing-an-api-gateway
- https://www.digitalapi.ai/blogs/api-gateway-framework-the-complete-2026-guide-for-modern-microservices
- https://zuplo.com/blog/top-10-api-management-tools-for-2025-a-deep-dive-for-architects
- https://dev.to/mechcloud_academy/kubernetes-gateway-api-in-2026-the-definitive-guide-to-envoy-gateway-istio-cilium-and-kong-2bkl
- https://stackshare.io/stackups/kong-vs-traefik

### Message Queues
- https://www.javacodegeeks.com/2025/12/event-driven-architecture-kafka-vs-rabbitmq-vs-pulsar-a-2025-decision-framework.html
- https://dev.to/guilhermesiqueira/rabbitmq-vs-kafka-which-one-to-choose-for-your-event-driven-architecture-3enm
- https://quix.io/blog/apache-kafka-vs-rabbitmq-comparison
- https://medium.com/@niteshthakur498/event-driven-architecture-with-spring-boot-kafka-vs-rabbitmq-75e1f2add1f5
- https://oneuptime.com/blog/post/2026-01-21-kafka-vs-rabbitmq/view
- https://www.datacamp.com/blog/kafka-vs-rabbitmq
- https://dev.to/mtk3d/beyond-the-hype-why-we-chose-redis-streams-over-kafka-for-our-microservices-dmc
- https://www.javaoneworld.com/2025/10/kafka-vs-rabbitmq-vs-redis-streams.html
- https://redis.io/tutorials/howtos/solutions/microservices/interservice-communication/
- https://www.harness.io/blog/event-driven-architecture-redis-streams

### GraphQL vs REST
- https://api7.ai/blog/graphql-vs-rest-api-comparison-2025
- https://www.bizdata360.com/rest-api-vs-graphql/
- https://www.f22labs.com/blogs/graphql-vs-rest-apis-key-differences-2025/
- https://aetherio.tech/en/articles/graphql-vs-rest-api-en-2025
- https://coremarketresearch.com/report/healthcare-api
- https://dev.to/sizan_mahmud0_e7c3fd0cb68/the-complete-guide-to-api-types-in-2026-rest-graphql-grpc-soap-and-beyond-191

### Microservices Patterns
- https://www.scholarhat.com/tutorial/designpatterns/saga-design-pattern-microservices-guide
- https://temporal.io/blog/mastering-saga-patterns-for-distributed-transactions-in-microservices
- https://learn.microsoft.com/en-us/azure/architecture/patterns/saga
- https://microservices.io/patterns/data/saga.html
- https://microservices.io/patterns/data/event-sourcing.html
- https://microservices.io/patterns/data/cqrs.html
- https://dzone.com/articles/microservices-with-cqrs-and-event-sourcing
- https://medium.com/design-microservices-architecture-with-patterns/event-sourcing-pattern-in-microservices-architectures-e72bf0fc9274
- https://www.growin.com/blog/event-driven-architecture-scale-systems-2025/
- https://medium.com/javaguides/top-10-microservices-design-patterns-you-should-know-in-2025-9f3438e91ac6
- https://dev.to/federico_bevione/transactions-in-microservices-part-1-saga-patterns-with-choreography-and-orchestration-4an9

### HDS France / Healthcare Hosting
- https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/
- https://www.hoganlovells.com/en/publications/health-data-hosting-the-new-french-hds-certification-has-been-released
- https://qualysec.com/hds-certification-requirements/
- https://www.ayinedjimi-consultants.fr/articles/conformite/hds-2026-certification-sante.html
- https://esante.gouv.fr/offres-services/hds/liste-des-herbergeurs-certifies
- https://doc.scalingo.com/compliance/hds
- https://scalingo.com/blog/scalingo-iso27001-hds-certifications-next-secnumcloud
- https://scalingo.com/health-sector
- https://www.ovhcloud.com/en/compliance/hds/
- https://security.googlecloudcommunity.com/ciso-blog-77/google-cloud-achieves-hds-v2-0-certification-raising-the-bar-for-secure-health-data-hosting-in-france-5906
- https://learn.microsoft.com/fr-fr/compliance/regulatory/offering-hds-france

### Pro Sante Connect
- https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/documentation-technique
- https://www.data.gouv.fr/dataservices/api-pro-sante-connect
- https://esante.gouv.fr/doctrine/pro-sante-connect-igc-sante
- https://esante.gouv.fr/produits-services/pro-sante-connect
- https://esante.gouv.fr/espace-presse/avec-les-evolutions-de-pro-sante-connect-lidentification-electronique-des-professionnels-franchit-une-nouvelle-etape
- https://lemonldap-ng.org/documentation/2.0/authopenidconnect_prosanteconnect.html

### Healthcare Ecosystem / TypeScript FHIR
- http://docs.smarthealthit.org/client-js/
- https://github.com/smart-on-fhir/client-node
- https://github.com/medplum/medplum
- https://www.npmjs.com/package/fhirclient
- https://spsoft.com/tech-insights/top-8-fhir-servers-for-healthcare-in-2025/

### Backend Framework Comparisons
- https://tateeda.com/blog/healthcare-mobile-apps-trends
- https://www.hyperlinkinfosystem.com/blog/most-popular-backend-development-frameworks
- https://www.index.dev/blog/best-backend-frameworks-ranked
- https://inveritasoft.com/article-10-most-popular-backend-frameworks
- https://citrusbits.com/programming-languages-healthcare-app-development/
- https://eseospace.com/blog/top-front-end-back-end/
