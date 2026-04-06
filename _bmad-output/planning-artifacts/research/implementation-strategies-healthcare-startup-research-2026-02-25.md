# Practical Implementation Strategies for Healthcare Startup Applications
## Research Findings (2025-2026)
### Date: 2026-02-25

---

## Table of Contents

1. [Testing Strategies for Healthcare Apps](#1-testing-strategies-for-healthcare-apps)
2. [Team Composition for a Healthcare Startup](#2-team-composition-for-a-healthcare-startup)
3. [Cost Optimization for Healthcare Startups](#3-cost-optimization-for-healthcare-startups)
4. [Development Environment Setup](#4-development-environment-setup)
5. [Monorepo Strategies for NestJS Microservices](#5-monorepo-strategies-for-nestjs-microservices)
6. [React Native Testing](#6-react-native-testing)
7. [Healthcare App Launch Checklist (France)](#7-healthcare-app-launch-checklist-france)

---

## 1. Testing Strategies for Healthcare Apps

### 1.1 Testing Pyramid for Healthcare Microservices

The healthcare testing pyramid follows the standard pattern but with regulatory compliance layers added at each level:

**Layer 1 - Unit Tests (70% of tests)**
- Business logic validation (clinical calculations, dosage checks, scheduling algorithms)
- FHIR resource serialization/deserialization
- Data transformation and mapping functions
- Tools: Jest (for NestJS), with React Native Testing Library for mobile
- Target: >80% code coverage on critical clinical pathways

**Layer 2 - Integration Tests (20% of tests)**
- Database interaction testing (PostgreSQL queries, data integrity)
- Message broker integration (RabbitMQ/Kafka consumer/producer)
- External API integration (FHIR servers, authentication providers)
- Contract testing between microservices (see Pact section below)
- Tools: Supertest for HTTP, Testcontainers for database/broker dependencies

**Layer 3 - E2E Tests (5-10% of tests)**
- 3-5 critical user flows (registration, login, core clinical workflow)
- Cross-service workflow validation
- Mobile app E2E with Maestro or Detox (see Section 6)
- Tools: Maestro for mobile, Playwright for web admin panels

**Layer 4 - Compliance & Security Tests (continuous)**
- SAST/DAST automated scanning in CI/CD
- FHIR conformance validation
- GDPR/HDS compliance verification
- Penetration testing (quarterly)

**Sources:**
- [Healthcare Application Testing: All You Need to Know in 2026 (Binariks)](https://binariks.com/blog/5-essentials-of-healthcare-application-testing-an-overview/)
- [Healthcare Application Testing (KMS Technology)](https://kms-technology.com/blog/healthcare-application-testing/)
- [Testing in 2026: Jest, React Testing Library, and Full Stack Testing Strategies](https://www.nucamp.co/blog/testing-in-2026-jest-react-testing-library-and-full-stack-testing-strategies)

### 1.2 Contract Testing with Pact

Pact is a consumer-driven contract testing tool that verifies whether two services can interact correctly based on a predefined service contract. It is considered the "killer app for microservice development and deployment."

**How it works:**
1. The **consumer** (e.g., mobile app or API gateway) writes a unit test specifying expected API interactions
2. Pact generates a **JSON contract file** (the "pact")
3. The **provider** (e.g., NestJS microservice) runs the pact against its API to verify compliance
4. Results are shared via a **Pact Broker** (self-hosted or PactFlow SaaS)

**Implementation for healthcare microservices:**
- Define contracts between API Gateway and each microservice
- Define contracts between mobile app (React Native) and API Gateway
- Run provider verification in CI/CD pipeline on every PR
- Use PactFlow for centralized contract management and "can-i-deploy" checks

**2025 Updates:**
- PactFlow AI can generate Pact tests using OpenAPI descriptions, code, or request-response pairs with customizable prompts
- Pact is available in JavaScript/TypeScript (ideal for NestJS), Java, Ruby, Go, and more
- Works across polyglot microservice architectures

**Concrete NestJS example pattern:**
```typescript
// Consumer test (API Gateway -> User Service)
const interaction = {
  state: 'user exists',
  uponReceiving: 'a request for user profile',
  withRequest: { method: 'GET', path: '/api/users/123' },
  willRespondWith: {
    status: 200,
    body: { id: '123', name: string(), role: 'practitioner' }
  }
};
```

**Sources:**
- [Pact Documentation](https://docs.pact.io/)
- [Pact Open Source Update - May 2025](https://docs.pact.io/blog/2025/05/28/pact-open-source-update-may-2025)
- [Contract Testing: The Missing Link in Your Microservices Strategy (Gravitee)](https://www.gravitee.io/blog/contract-testing-microservices-strategy)
- [Contract Testing: An Introduction and Complete 2025 Guide](https://www.testingmind.com/contract-testing-an-introduction-and-guide/)
- [PACT Contract Testing (Microsoft ISE)](https://devblogs.microsoft.com/ise/pact-contract-testing-because-not-everything-needs-full-integration-tests/)
- [PactFlow Contract Testing Platform](https://pactflow.io/)

### 1.3 E2E Testing for Mobile Health Apps (Detox vs Maestro)

See detailed comparison in [Section 6](#6-react-native-testing). Summary:
- **Maestro** is recommended for its zero-project-dependency approach, YAML-based tests, and fast setup
- **Detox** remains viable but requires native build configuration changes
- **Expo integration**: EAS Workflows natively supports Maestro for E2E testing

### 1.4 FHIR Validation Testing

**Context:** FHIR R6 is in development and could arrive as soon as 2026. Certified health IT must accommodate USCDI v3 data using FHIR US Core profiles by January 1, 2026. The industry is shifting from static checklists to continuous assurance.

**Open Source Tools:**
- **HAPI FHIR Validator**: The reference validator for checking resource conformance to FHIR profiles, StructureDefinitions, and terminology. Available as:
  - Java library (embed in test suites)
  - Standalone CLI tool
  - Web interface at https://validator.fhir.org/
- **HL7 FHIR Validator**: Open-source core from `hapifhir/org.hl7.fhir.core` GitHub repository

**Implementation strategy:**
1. **Unit-level**: Validate FHIR resource serialization with HAPI validator in unit tests
2. **Integration-level**: Test HL7/FHIR data exchange between services
3. **Conformance-level**: Validate against specific FHIR Implementation Guides (IGs)
4. **Interoperability-level**: Test real-world data exchanges with external systems

**For French healthcare specifically:**
- Validate against French FHIR profiles (ANS/Interop'Sante profiles)
- Test DMP (Dossier Medical Partage) integration via Mon espace sante APIs
- Validate against CI-SIS (Cadre d'Interoperabilite des Systemes d'Information de Sante)

**Sources:**
- [HAPI FHIR - Instance Validator Documentation](https://hapifhir.io/hapi-fhir/docs/validation/instance_validator.html)
- [FHIR Conformance Testing](https://www.fhir.org/conformance-testing/)
- [Increased FHIR Adoption Requires a New Testing Strategy (Drummond Group)](https://www.drummondgroup.com/blog/increased-fhir-adoption-requires-a-new-testing-strategy/)
- [WEDI Blog: Increased FHIR Adoption Requires a New Testing Strategy](https://www.wedi.org/2025/09/21/wedi-blog-increased-fhir-adoption-requires-a-new-testing-strategy-sponsored-by-drummond-group/)
- [FHIR Healthcare Interoperability Guide 2025](https://www.sprypt.com/blog/fhir-guide)

### 1.5 Load Testing

**Recommended Tool: Grafana k6**

k6 1.0 was released at GrafanaCON 2025 (May 2025), marking its maturity as a production-ready load testing framework. It combines JavaScript scripting with Go performance.

**Key features for healthcare APIs:**
- JavaScript/TypeScript test scripts (familiar to NestJS developers)
- Built-in support for REST, gRPC, and WebSocket protocols
- Integration with Grafana dashboards for visualization
- Cloud execution via Grafana Cloud k6 for distributed load tests
- New in k6 1.0: AI-based performance analysis, enhanced browser testing, chaos engineering capabilities

**Implementation pattern:**
```javascript
// k6 load test for healthcare API
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // ramp to 100 users
    { duration: '5m', target: 100 },  // hold steady
    { duration: '2m', target: 200 },  // peak load
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95th percentile < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};
```

**Healthcare-specific scenarios:**
- Concurrent appointment booking (race conditions)
- Patient record retrieval under load
- FHIR API burst patterns (morning shift start)
- Push notification delivery under load

**Other tools considered:**
- Apache JMeter: More traditional, GUI-based, widely used in healthcare QA
- Postman: Useful for manual API testing and simple load scenarios

**Sources:**
- [Grafana k6 - Load testing for engineering teams](https://k6.io/)
- [k6 Complete Guide: The Modern Load Testing Tool](https://agmazon.com/blog/articles/technology/202602/k6-load-testing-complete-guide-en.html)
- [Grafana k6 Documentation](https://grafana.com/docs/k6/latest/)
- [API Load Testing with k6](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/)

### 1.6 Security Testing Automation

**SAST (Static Application Security Testing):**
- Analyze source code before execution
- Top tools for 2026: SonarQube (open-source community edition), Semgrep, Snyk Code, GitHub CodeQL
- Integration: Run in CI/CD on every PR

**DAST (Dynamic Application Security Testing):**
- Test running applications from the outside
- Top tools for 2026: OWASP ZAP (free/open-source), Burp Suite Enterprise, StackHawk
- Integration: Run against staging environment in CI/CD pipeline

**SCA (Software Composition Analysis):**
- Scan dependencies for known vulnerabilities
- Tools: Snyk, npm audit, Trivy (container scanning)
- Critical for healthcare: Over 23,667 CVEs were disclosed in the first half of 2025 alone (16% increase YoY)

**Recommended pipeline integration:**
```
PR Created -> SAST (SonarQube/Semgrep) -> Unit Tests -> Build
           -> SCA (Snyk/Trivy)
Staging Deploy -> DAST (OWASP ZAP) -> E2E Tests -> Performance Tests
Production -> Runtime monitoring -> Quarterly penetration testing
```

**Healthcare-specific security testing:**
- OWASP Top 10 compliance validation
- Authentication/authorization testing (Pro Sante Connect integration)
- Data encryption verification (at rest and in transit)
- Audit logging completeness checks
- Session management testing

**Sources:**
- [Top 5 DAST Tools in 2026 (OX Security)](https://www.ox.security/blog/dynamic-app-security-testing-tools-in-2026/)
- [Top 10 SAST Tools in 2025 (OX Security)](https://www.ox.security/blog/static-application-security-sast-tools/)
- [The 6 Best OWASP Security Testing Tools in 2026](https://beaglesecurity.com/blog/article/best-owasp-security-testing-tools.html)
- [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools)

---

## 2. Team Composition for a Healthcare Startup

### 2.1 Ideal Team Size and Roles for MVP

Based on aggregated industry guidance for healthcare mobile app MVPs in 2025-2026:

**Core Team (8-10 people for MVP phase):**

| Role | Count | Justification |
|------|-------|---------------|
| **Product Owner / Project Manager** | 1 | Oversees timelines, coordinates teams, ensures milestones. Must understand healthcare domain. |
| **UX/UI Designer** | 1 | Creates accessible, clinically-meaningful interfaces. Healthcare UX requires domain expertise. |
| **Backend Developer (NestJS)** | 2 | Build microservices, APIs, FHIR integration, business logic. |
| **Mobile Developer (React Native)** | 1-2 | Cross-platform development. 1 if experienced, 2 for faster velocity. |
| **DevOps / SRE Engineer** | 1 | CI/CD, Kubernetes, HDS-compliant infrastructure, monitoring. |
| **QA Engineer** | 1 | Manual + automated testing, compliance verification. |
| **DPO / Compliance Specialist** | 0.5-1 | GDPR/CNIL compliance, HDS oversight, DPIA authoring. Can be part-time or shared. |

**Extended team (as you scale beyond MVP):**
- Frontend Developer (web admin panel)
- Data Engineer (analytics, reporting)
- Security Engineer (dedicated security focus)
- Clinical Advisor / Medical Consultant (part-time, domain validation)

### 2.2 Full-Stack vs Specialized Developers

**Recommendation for healthcare MVP: Specialized developers with T-shaped skills**

- **Why not pure full-stack:** Healthcare compliance requirements mean deep backend security knowledge and mobile-specific testing expertise are critical. A "jack of all trades" approach risks compliance gaps.
- **Why not fully siloed:** At MVP stage, team members need to collaborate across boundaries. A React Native developer who understands the API contract, or a backend developer who can review mobile PRs, accelerates delivery.
- **Optimal approach:** Backend specialists (NestJS/TypeScript) + Mobile specialists (React Native/TypeScript). The shared TypeScript language enables cross-pollination. Shared libraries in the monorepo (types, validation schemas) bridge the gap.

### 2.3 DevOps/SRE Needs

**MVP Phase (1 person):**
- Set up CI/CD pipeline (GitHub Actions or GitLab CI)
- Configure Kubernetes cluster on HDS-compliant provider
- Implement Infrastructure as Code (Terraform/OpenTofu)
- Set up monitoring stack (Prometheus + Grafana or Grafana Cloud)
- Manage secrets, certificates, and HDS compliance tooling

**Scaling Phase (2+ people):**
- At 50 people, stretching one DevOps engineer across 5+ squads leads to bottlenecks and burnout
- Platform engineering team needed for developer self-service
- Dedicated SRE for incident response and reliability

**Key insight from 2025 research:** "In regulated industries like finance and healthcare, the DevSecOps/compliance role combines deep technical knowledge with compliance expertise, making it both critical and well-compensated."

### 2.4 DPO Requirements

**Legal obligation in France:**
- Organizations whose core business involves large-scale processing of sensitive health data **must** appoint a DPO (Article 37 GDPR)
- For a healthcare startup processing patient data, a DPO is **mandatory**
- The DPO must have "skills, knowledge and absence of conflict of interest"

**Practical options for startups:**
1. **Internal DPO** (part-time role combined with compliance): Most cost-effective for small teams
2. **External DPO service**: Available from specialized firms; provides expertise without full-time cost
3. **Shared DPO**: One DPO serving multiple entities (allowed under GDPR)

**DPO responsibilities:**
- Maintain records of processing activities (Article 30 GDPR)
- Conduct and manage Data Protection Impact Assessments (DPIAs)
- Serve as contact point with CNIL
- Monitor GDPR compliance across the organization
- Advise on data protection matters during development

### 2.5 Cost Estimates and Timeline

**MVP Development Cost:** $50,000 - $250,000+ depending on complexity, team location, and compliance requirements

**Timeline:** 4-6 months for MVP development

**Ongoing costs:** Marketing, user acquisition, HDS hosting, and maintenance must be budgeted separately

**Sources:**
- [MVP for Healthcare in 2026: What You MUST Include (CHILLICODE)](https://medium.com/@CHILLICODE/mvp-for-healthcare-in-2026-what-you-must-include-and-what-you-can-skip-dfbf34c79803)
- [How to Build an MVP for Healthcare (TATEEDA)](https://tateeda.com/blog/how-to-build-an-mvp-for-a-healthcare-product)
- [MVP in Healthcare: How to Execute (Onix Systems)](https://onix-systems.com/blog/how-to-build-a-healthcare-mvp)
- [Scalable DevOps Setup for 50-Person Health Tech Teams](https://deployflow.co/blog/scalable-devops-setup-50-person-health-tech-team-checklist/)
- [DevOps in Healthcare: A Strategic Approach (KMS Technology)](https://kms-technology.com/blog/devops-in-healthcare/)
- [MVP Validation Playbook 2025 (Momentum)](https://www.themomentum.ai/resources/mvp-development-in-healthcare-playbook)
- [DPOs and Notification Requirements France (Baker McKenzie)](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/emea/france/topics/dpos-and-notification-requirements)
- [CNIL Guide for DPOs](https://www.cnil.fr/en/cnil-publishes-guide-dpos)

---

## 3. Cost Optimization for Healthcare Startups

### 3.1 FinOps on Kubernetes

**Core principle:** Right-sizing requests and limits is the #1 savings lever. Audits in 2026 routinely find 80-90% of pods with inflated CPU/memory requests. Even 5-15% per-pod reductions compound to **30-60% cluster savings** through better bin-packing.

**Combined strategies can achieve 40-70% cost reduction** on EKS/AKS/GKE deployments without sacrificing performance.

**Key FinOps tools for startups (2026):**

| Tool | Type | Best For |
|------|------|----------|
| **Kubecost** | Open-source | Entry-point for K8s cost monitoring, built on Prometheus |
| **OpenCost** | Open-source (CNCF) | Vendor-neutral cost allocation |
| **Goldilocks** | Open-source | VPA-based right-sizing recommendations |
| **Grafana + Prometheus** | Open-source | Custom dashboards, resource monitoring |
| **Vertical Pod Autoscaler (VPA)** | Built-in K8s | Automatic resource right-sizing |

### 3.2 Right-Sizing Pods

**Implementation steps:**
1. Deploy Prometheus + Grafana for resource monitoring
2. Install Goldilocks (or VPA in recommendation mode) to analyze actual CPU/memory usage over 2+ weeks
3. Set requests close to **average usage** (not peak) for better scheduler bin-packing
4. Set limits at **2-3x requests** to handle bursts without OOM kills
5. Review and update resource definitions **iteratively** (monthly cadence)

**Example right-sizing pattern:**
```yaml
# Before (over-provisioned - common default)
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "1000m"
    memory: "1Gi"

# After right-sizing (based on actual usage data)
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "300m"
    memory: "384Mi"
```

### 3.3 Spot/Preemptible Instances for Non-Production

**Cost savings:**
- Theoretical maximum: 70-90% discount vs on-demand
- Realistic average: ~50% (varies by region and instance type)
- 2025 Kubernetes Cost Benchmark: clusters with mixed Spot/On-Demand averaged 59% savings; Spot-only clusters achieved 77% reduction

**Recommended architecture:**

| Environment | Strategy | Expected Savings |
|-------------|----------|-----------------|
| **Development** | 100% spot instances | 70-90% |
| **CI/CD runners** | 100% spot instances | 70-90% |
| **Staging** | 80% spot / 20% on-demand | 50-70% |
| **Production** | 20-30% spot (non-critical) / 70-80% on-demand | 15-25% |

**Implementation with taints/tolerations:**
```yaml
# Taint spot nodes
kubectl taint nodes <spot-node> spot-instance=true:NoSchedule

# Pod tolerations for non-critical workloads
tolerations:
  - key: "spot-instance"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

**Best practices:**
- Use multiple instance types and availability zones (at least 3 pools)
- Deploy AWS Node Termination Handler (or equivalent) for 2-minute termination warnings
- Configure Pod Disruption Budgets for graceful handling
- Use Cluster Autoscaler to prioritize spot instances during scale-down

### 3.4 Scaleway/OVHcloud Startup Programs

**Scaleway Startup Program:**
- **Founders Program**: EUR 1,000 credits over 12 months (very early stage)
- **Higher tiers**: Up to EUR 36,000 in credits
- **Scaleups (Series A+)**: Up to 80% coverage of spending over 24 months
- Includes free consulting support and startup community access
- **HDS-certified infrastructure available** (critical for French healthcare)

**OVHcloud Startup Program:**
- Up to **EUR 100,000 in free cloud credits**
- Personalized technical guidance
- Full access to Europe's sovereign cloud infrastructure
- **Healthcare & MedTech explicitly supported**: AI-driven medical solutions, health analytics, telemedicine platforms
- Data sovereignty: hosting within EEA guaranteed

**Recommendation for a French healthcare startup:**
- Apply to both programs simultaneously
- OVHcloud offers higher credit amounts (EUR 100K vs EUR 36K)
- Both are HDS-certified and EEA-compliant
- Scaleway has stronger Kubernetes managed service (Kapsule)
- OVHcloud has broader bare-metal and dedicated server options

### 3.5 Open-Source vs Paid Tools Trade-Offs

| Category | Open-Source Option | Paid Alternative | Recommendation for MVP |
|----------|-------------------|------------------|----------------------|
| **Observability** | Prometheus + Grafana + Loki | Datadog, New Relic | Open-source (save $500-2000+/mo) |
| **CI/CD** | GitHub Actions (free tier) / GitLab CI | CircleCI, Buildkite | GitHub Actions (sufficient for MVP) |
| **Secret Management** | Vault (self-hosted) | HashiCorp Cloud, AWS Secrets Manager | Cloud provider native (simpler) |
| **Container Registry** | Harbor (self-hosted) | Docker Hub Pro, ECR | Cloud provider native |
| **SAST** | SonarQube Community, Semgrep | Snyk, Checkmarx | Open-source (adequate for MVP) |
| **DAST** | OWASP ZAP | Burp Suite Enterprise | OWASP ZAP (free and comprehensive) |
| **Load Testing** | Grafana k6 | LoadRunner, BlazeMeter | k6 (open-source, excellent quality) |
| **Contract Testing** | Pact (open-source) | PactFlow (SaaS) | Pact OSS, upgrade to PactFlow at scale |
| **Cost Monitoring** | Kubecost/OpenCost | Finout, Cast.ai | Open-source initially |

**Key insight:** "In 2025, open source observability tools have matured beyond basic monitoring and now rival and often outperform commercial SaaS platforms in scalability, flexibility, and interoperability." The trade-off is **operational overhead** of self-hosting vs **cost predictability** of SaaS.

**Sources:**
- [Kubernetes Cost Optimization 2026: Complete Guide (CloudMonitor)](https://cloudmonitor.ai/2026/02/kubernetes-cost-optimization-2026/)
- [Top 18 Kubernetes Cost Optimization Strategies in 2026 (Finout)](https://www.finout.io/blog/top-18-kubernetes-cost-optimization-strategies-in-2026)
- [9 FinOps Tools for Kubernetes Cost Management in 2026 (Amnic)](https://amnic.com/blogs/finops-tools-for-kubernetes-cost-management)
- [Kubernetes Cost Optimization: 10 Proven Strategies (N-iX)](https://www.n-ix.com/kubernetes-cost-optimization/)
- [Spot Instances in Kubernetes: Architecture & Cost Guide 2026 (Sedai)](https://sedai.io/blog/spot-instances-in-k8s-strategy)
- [How to Reduce Kubernetes Costs with Spot and Preemptible Nodes](https://oneuptime.com/blog/post/2026-01-19-kubernetes-spot-preemptible-nodes-cost/view)
- [Spot Instances: Reduce Costs By Up to 90% (Cast.ai)](https://cast.ai/blog/reduce-cloud-costs-with-spot-instances/)
- [Scaleway Startup Program](https://www.scaleway.com/en/startup-program/)
- [OVHcloud Startup Program](https://us.ovhcloud.com/startup-program/)
- [OVHcloud Startup Program 2025 (StartUs)](https://magazine.startus.cc/ovhcloud-startup-program-2025/)
- [Scaleway Credits for Startups](https://aureliaventures.com/partners/scaleway)
- [Top 10 Open Source Observability Tools in 2026](https://openobserve.ai/blog/top-10-open-source-observability-tools/)
- [Open-source vs Managed Observability Platforms (Middleware)](https://middleware.io/blog/open-source-vs-managed-observability-platforms/)

---

## 4. Development Environment Setup

### 4.1 Docker Compose for Local Development Mirroring K8s Production

**The problem:** Running microservices locally with Docker Compose is simple but creates environment parity issues with Kubernetes production. "If you're developing apps that run in Kubernetes, running them locally with Docker Compose may seem like a simple solution, but it can cause problems, as your local environment will be very different from how your apps run in production."

**Recommended hybrid approach:**

**Phase 1 - Docker Compose for rapid development:**
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  api-gateway:
    build: ./apps/api-gateway
    ports: ["3000:3000"]
    volumes: ["./apps/api-gateway/src:/app/src"]  # hot-reload
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/jim
      - REDIS_URL=redis://redis:6379
    depends_on: [postgres, redis, rabbitmq]

  user-service:
    build: ./apps/user-service
    volumes: ["./apps/user-service/src:/app/src"]
    depends_on: [postgres, rabbitmq]

  matching-service:
    build: ./apps/matching-service
    volumes: ["./apps/matching-service/src:/app/src"]
    depends_on: [postgres, rabbitmq]

  postgres:
    image: postgres:16-alpine
    volumes: ["postgres_data:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: jim
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass

  redis:
    image: redis:7-alpine

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["15672:15672"]  # management UI

  mailhog:
    image: mailhog/mailhog  # local email testing
    ports: ["8025:8025"]
```

**Phase 2 - Tilt/Skaffold for K8s parity (when needed):**
- Transition individual services to Tilt/Skaffold as complexity grows
- Use for testing K8s-specific features (ConfigMaps, Secrets, Ingress, NetworkPolicies)

### 4.2 Dev Containers

**devcontainer.json** provides reproducible development environments across the team:

```json
{
  "name": "Healthcare App Dev",
  "dockerComposeFile": "docker-compose.dev.yml",
  "service": "api-gateway",
  "workspaceFolder": "/workspace",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker"
      ]
    }
  },
  "postCreateCommand": "pnpm install"
}
```

**Key benefits:**
- "A devcontainer.json file tells VS Code how to access (or create) a development container with a well-defined tool and runtime stack"
- Supports Docker Compose for multi-service orchestration
- "Since Dev Containers are Docker-based, transitioning to production via Kubernetes is seamless"
- Works with VS Code, GitHub Codespaces, and DevPod

### 4.3 Tilt vs Skaffold for K8s Dev Workflow

| Feature | Tilt | Skaffold |
|---------|------|----------|
| **UI** | Rich web-based dashboard | CLI-focused (some UI) |
| **Hot reload** | Excellent, live_update feature | Good, file sync support |
| **Config language** | Tiltfile (Starlark/Python-like) | skaffold.yaml (YAML) |
| **Docker Compose support** | Can read docker-compose files | Can use Docker Compose as deployer |
| **Learning curve** | Moderate | Lower |
| **Best for** | Teams wanting visual debugging | Teams preferring CLI workflows |
| **Maintained by** | Docker (acquired 2023) | Google |

**Recommendation for a startup:**

1. **Start with Docker Compose** for local development (simplest, fastest iteration)
2. **Add Tilt** when you need K8s-specific testing or when services exceed 5-6:
   - Tilt can read existing docker-compose files for a smooth transition
   - Web UI helps debug multi-service issues
   - `live_update` enables sub-second rebuild cycles

**Tiltfile example:**
```python
# Tiltfile
docker_compose('docker-compose.dev.yml')

# Or for K8s deployment:
k8s_yaml('k8s/dev/')
docker_build('registry/api-gateway', './apps/api-gateway',
  live_update=[
    sync('./apps/api-gateway/src', '/app/src'),
    run('cd /app && pnpm install', trigger=['./apps/api-gateway/package.json']),
  ]
)
```

### 4.4 Environment Parity Best Practices

1. **Same container images** across dev/staging/production (only config changes via env vars)
2. **Same database version** (PostgreSQL 16) in Docker Compose and K8s
3. **Same message broker** (RabbitMQ) version across environments
4. **Use ConfigMaps/Secrets pattern** even in Docker Compose (env files matching K8s patterns)
5. **Network policies**: Simulate K8s network isolation using Docker Compose network segmentation
6. **Health checks**: Same `/health` endpoints in Docker Compose and K8s readiness/liveness probes

**Sources:**
- [Docker Compose Alternatives for Kubernetes: Skaffold (vCluster)](https://www.vcluster.com/blog/docker-compose-alternatives-for-kubernetes-skaffold)
- [Skaffold vs Tilt: Guide to Local Kubernetes Development (Wallarm)](https://www.wallarm.com/cloud-native-products-101/skaffold-vs-tilt-local-kubernetes-development)
- [Kubernetes Tools: Minikube, kind, skaffold, tilt, devspace (Cloudomation)](https://cloudomation.com/cloudomation-blog/kubernetes-tools/)
- [Simplifying Kubernetes Development: Tools Guide (Semaphore)](https://semaphore.io/blog/kubernetes-development-tools)
- [Dev Container JSON Reference](https://containers.dev/implementors/json_reference/)
- [Developing inside a Container (VS Code)](https://code.visualstudio.com/docs/devcontainers/containers)
- [Create a Dev Container (VS Code)](https://code.visualstudio.com/docs/devcontainers/create-dev-container)
- [DevPod - devcontainer.json](https://devpod.sh/docs/developing-in-workspaces/devcontainer-json)
- [Container Development Tools (HackerNoon)](https://hackernoon.com/container-development-tools-and-configurations-for-an-effortless-workflow-in-docker-and-kubernetes)

---

## 5. Monorepo Strategies for NestJS Microservices

### 5.1 Nx vs Turborepo for NestJS Monorepo

**Turborepo (by Vercel):**
- Philosophy: Minimalism and pure speed; high-performance task runner
- Setup: "Add it to your package.json, create a turbo.json config file, and you're running cached builds in 15 minutes"
- Small projects (2-5 packages): ~3x faster (2.8s vs 8.3s in benchmarks)
- NestJS support: No native generators, requires manual setup or community templates
- Caching: Environment-aware with task inputs and environment variables
- Remote caching: Free via Vercel Remote Cache
- 2025 update: Turborepo 2.x series with Rust-based hashing and graph traversal, Composable Configuration (v2.7, Dec 2025)

**Nx (by Nrwl):**
- Philosophy: "Build Intelligence Platform" - comprehensive monorepo management
- Setup: 30-60 minutes initial setup but provides generators, dependency enforcement, visualization
- Large projects (50+ packages): ~7x better performance than Turborepo
- NestJS support: **First-class support** with `@nx/nest` plugin, project generators, and library generators
- Code generation: Built-in generators for NestJS apps, libraries, services, controllers
- Dependency analysis: Fine-grained file-level tracking (not just package.json-level)
- 2025 update: Migrating core to Rust, "Build Intelligence Platform" with AI integration, self-healing CI

**Recommendation for NestJS microservices: Nx**

Rationale:
1. First-class NestJS plugin (`@nx/nest`) with code generators
2. Fine-grained dependency analysis prevents unnecessary rebuilds
3. DDD-friendly library organization with module boundaries
4. Better suited for microservices architecture with many shared libraries
5. Interactive dependency graph visualization (`nx graph`)
6. nx-nest-ddd plugin available for Domain-Driven Design code generation

### 5.2 Shared Libraries Architecture

**Recommended monorepo structure (Nx + NestJS):**

```
/
├── apps/
│   ├── api-gateway/          # NestJS API Gateway
│   ├── user-service/         # NestJS microservice
│   ├── matching-service/     # NestJS microservice
│   ├── notification-service/ # NestJS microservice
│   └── mobile/               # React Native (Expo)
├── libs/
│   ├── shared/
│   │   ├── types/            # Shared TypeScript interfaces/types
│   │   ├── utils/            # Shared utility functions
│   │   ├── constants/        # Shared constants and enums
│   │   └── validation/       # Shared Zod/class-validator schemas
│   ├── domain/
│   │   ├── user/             # User domain models & interfaces
│   │   ├── matching/         # Matching domain logic
│   │   └── notification/     # Notification domain types
│   ├── infrastructure/
│   │   ├── database/         # Prisma/TypeORM shared config & migrations
│   │   ├── messaging/        # RabbitMQ/Kafka shared modules
│   │   ├── auth/             # PSC authentication module
│   │   └── logging/          # Structured logging module
│   ├── api-contracts/        # Pact contracts, OpenAPI schemas
│   └── testing/              # Shared test utilities, factories, mocks
├── tools/
│   ├── generators/           # Custom Nx generators
│   └── scripts/              # Build and deployment scripts
├── nx.json
├── tsconfig.base.json
└── package.json
```

**Key principles:**
- Feature-based or domain-driven folder structure preferred over technical folders
- "Bounded contexts can be organized as a set of libraries using Nx, gaining microservices' autonomy while maintaining a modular monolith"
- Shared TypeScript types between backend and mobile (major monorepo advantage)
- Validation schemas shared between frontend and backend (e.g., Zod)

### 5.3 Code Generation

**Nx built-in generators:**
```bash
# Generate a new NestJS microservice
nx generate @nx/nest:application matching-service

# Generate a shared library
nx generate @nx/js:library shared-types --directory=libs/shared/types

# Generate a NestJS module within a service
nx generate @nx/nest:module matching --project=matching-service

# Generate a NestJS service
nx generate @nx/nest:service matching --project=matching-service
```

**nx-nest-ddd plugin for DDD code generation:**
- Automatically generates boilerplate for DDD layers (domain, application, infrastructure)
- Creates clean architecture scaffolding
- Repository: https://github.com/thinhkhang97/nx-nest-ddd

**Custom generators (recommended for healthcare startups):**
- Generate new microservice with standard health checks, logging, and auth
- Generate new FHIR resource handler with validation
- Generate new domain entity with repository pattern

### 5.4 Build Optimization

**Nx caching and affected commands:**
```bash
# Only build/test affected projects (based on file-level dependency graph)
nx affected:build
nx affected:test
nx affected:lint

# Visualize dependency graph
nx graph

# Distributed task execution (for CI)
nx run-many --target=build --all --parallel=5
```

**Remote caching options:**
- **Nx Cloud**: Free tier for open-source, paid for private repos
- **Self-hosted**: Nx supports custom remote cache backends

**Turborepo equivalent (if chosen instead):**
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

**Sources:**
- [Turborepo, Nx, and Lerna: The Truth about Monorepo Tooling in 2026](https://dev.to/dataformathub/turborepo-nx-and-lerna-the-truth-about-monorepo-tooling-in-2026-71)
- [2025 NestJS + React 19 + Turborepo Architecture Decision Record](https://dev.to/xiunotes/2025-nestjs-react-19-drizzle-orm-turborepo-architecture-decision-record-3o1k)
- [Nx vs Turborepo: Which Monorepo Tool for Your Startup?](https://nextbuild.co/blog/nx-vs-turborepo-monorepo-startups)
- [Nx vs Turborepo: Integrated Ecosystem or High-Speed Task Runner?](https://dev.to/thedavestack/nx-vs-turborepo-integrated-ecosystem-or-high-speed-task-runner-the-key-decision-for-your-monorepo-279)
- [NestJS | Nx Official Documentation](https://nx.dev/nx-api/nest)
- [Practical Nx + NestJS Monorepo Boilerplate](https://arg-software.medium.com/scaling-with-confidence-a-practical-nx-nestjs-monorepo-boilerplate-b30b9266f6ba)
- [Creating Scalable NestJS Microservices with Nx Monorepo](https://medium.com/@viacheslav.klavdiiev/creating-scalable-nestjs-microservices-with-nx-monorepo-a-minimal-and-clean-configuration-77213723b66a)
- [Deep Dive into Nx Monorepo with React, Node.js, and Shared Libraries](https://techwithsadaru.blogspot.com/2025/05/deep-dive-into-nx-monorepo-organizing.html)
- [nx-nest-ddd - NestJS generators with DDD approach](https://github.com/thinhkhang97/nx-nest-ddd)
- [Boost Domain-Driven Architecture with Nx, Angular, and NestJS (Bitovi)](https://www.bitovi.com/blog/boost-domain-driven-architecture-with-nx-angular-and-nestjs)
- [nest-turbo-starter (GitHub)](https://github.com/typv/nest-turbo-starter)
- [NestJS Turborepo starter (vndevteam)](https://github.com/vndevteam/nestjs-turbo)

---

## 6. React Native Testing

### 6.1 Jest for Unit Testing

**Setup:** Jest ships as the default testing framework for React Native projects (CLI and Expo). Jest 30 (released mid-2025) improved performance and TypeScript 5.4+ support.

**Best practices for healthcare apps:**
- Use `getByRole`, `getByText`, or `getByPlaceholderText` to select elements like a real user would
- Use `waitFor` or `findByText` for async updates (never `setTimeout`)
- Keep tests small and focused: one behavior per test
- Mock external dependencies (APIs, animations, native modules)

**Essential test targets for healthcare:**
- Clinical data display accuracy
- Input validation (medical data formats)
- Accessibility compliance (screen readers, contrast)
- Offline behavior and data sync
- Authentication flow (PSC integration)

### 6.2 React Native Testing Library (RNTL)

**Core library for component testing.** Tests components the way users interact with them.

**Key matchers (via `@testing-library/jest-native`):**
- `toBeVisible()` - element visibility
- `toHaveTextContent()` - text content validation
- `toBeDisabled()` / `toBeEnabled()` - form state
- `toHaveProp()` - component prop validation

**Example pattern for healthcare component:**
```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppointmentBooking } from './AppointmentBooking';

describe('AppointmentBooking', () => {
  it('shows confirmation when appointment is booked', async () => {
    const { getByText, getByRole } = render(<AppointmentBooking />);

    fireEvent.press(getByText('Select Date'));
    fireEvent.press(getByText('15 Mars'));
    fireEvent.press(getByRole('button', { name: 'Confirmer' }));

    await waitFor(() => {
      expect(getByText('Rendez-vous confirme')).toBeVisible();
    });
  });
});
```

### 6.3 Detox vs Maestro for E2E Testing

**Maestro (Recommended):**

Advantages:
- **Zero project impact**: "No native dependencies, no build configuration changes, no faffing about"
- Installed as standalone CLI (external to codebase)
- YAML-based tests: human-readable, no JS runner needed
- **Cross-platform**: Identical YAML files work on iOS and Android
- **Reusable flows**: Login, navigation written once and shared across tests (DRY)
- **Maestro Studio**: Visual tool for building tests
- **Maestro Cloud**: Cloud-based test execution
- **Expo EAS Workflows integration**: Native support for running Maestro in CI

Disadvantages (from real-world usage, Feb 2026):
- Element selection issues with absolute positioning and high z-index (workaround: positional taps)
- Virtual keyboard quirks (requires explicit keyboard dismissal between steps)
- React Native LogBox interference (solution: `react-native-launch-arguments` to disable LogBox during tests)

**Example Maestro test (YAML):**
```yaml
appId: com.jim.app
---
- launchApp
- tapOn: "Se connecter"
- tapOn:
    id: "email-input"
- inputText: "test@example.com"
- tapOn:
    id: "password-input"
- inputText: "SecureP@ss123"
- tapOn: "Connexion"
- assertVisible: "Tableau de bord"
```

**Detox:**

Advantages:
- Deep React Native integration (gray-box testing)
- Synchronization with React Native bridge (waits for animations, network)
- Mature ecosystem, well-documented
- Strong TypeScript support

Disadvantages:
- Requires native build configuration modifications
- Package installation in project (native dependencies)
- Significant upfront setup effort
- Heavier maintenance burden

**Recommendation:** Start with **Maestro** for faster E2E setup and iteration. Consider Detox only if you need deep React Native bridge synchronization for complex animation-heavy flows.

### 6.4 Testing with Expo

**Unit testing setup (Expo + Jest):**
```json
// package.json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*)"
    ]
  }
}
```

**E2E with Expo + Maestro (EAS Workflows):**
- EAS Workflows natively supports Maestro for E2E testing
- Build development client with `eas build --profile development`
- Run Maestro tests against the dev client
- Integrated into EAS CI/CD pipeline

**Testing pyramid for React Native healthcare app:**
```
         /\
        /  \  E2E Tests (Maestro): 5-15 tests
       /    \  covering 3-5 critical flows
      /------\  (login, appointment booking, patient record view)
     /        \
    / Integration \ Component integration tests (RNTL)
   /    Tests     \  API mocking with MSW
  /----------------\  Navigation flow tests
 /                  \
/    Unit Tests      \  Business logic, validation
/  (Jest + RNTL)      \  Data formatting, calculations
/______________________\  80% of test suite
```

**Sources:**
- [Mastering React Native Testing with Jest and RTL 2025 (Creole Studios)](https://www.creolestudios.com/react-native-testing-with-jest-and-rtl/)
- [Unit Testing with Jest - Expo Documentation](https://docs.expo.dev/develop/unit-testing/)
- [Run E2E tests on EAS Workflows and Maestro - Expo Documentation](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)
- [Our Experience Adding E2E Testing to React Native with Maestro (AddJam, Feb 2026)](https://addjam.com/blog/2026-02-18/our-experience-adding-e2e-testing-react-native-maestro/)
- [Maestro & Expo: Crafting the Future of Efficient E2E Testing](https://gitnation.com/contents/maestro-and-expo-crafting-the-future-of-efficient-e2e-testing)
- [Native E2E Testing with Expo, React-Native and Maestro (Lingvano)](https://medium.com/lingvano/native-e2e-testing-with-maestro-and-expo-14e9e9b0f0fe)
- [Simple Step-by-Step Setup Detox for React Native Android E2E Testing 2026](https://medium.com/@svbala99/simple-step-by-step-setup-detox-for-react-native-android-e2e-testing-2026-ed497fd9d301)
- [Testing Overview - React Native](https://reactnative.dev/docs/testing-overview)
- [From Unit to E2E: A Guide to Testing React Native TV in 2026 (Callstack)](https://www.callstack.com/blog/testing-react-native-tv-apps)
- [Top Testing Libraries for React in 2026 (BrowserStack)](https://www.browserstack.com/guide/top-react-testing-libraries)

---

## 7. Healthcare App Launch Checklist (France)

### 7.1 Pre-Launch Compliance Checklist

**A. Data Protection & GDPR/CNIL**

- [ ] **Register processing activities** with CNIL via declaration of conformity with standard references (referentiels). If conformity cannot be demonstrated, obtain CNIL's prior authorization
- [ ] **Appoint a DPO** (mandatory for large-scale health data processing under Article 37 GDPR)
- [ ] **Complete DPIA** (Data Protection Impact Assessment) - required for health data processing
- [ ] **Maintain records of processing activities** (Article 30 GDPR - Record of Processing Activities / Registre des traitements)
- [ ] **Implement privacy-by-design**: Minimal data collection, purpose limitation, storage limitation
- [ ] **Obtain valid consent mechanisms**: Personal health data falls under GDPR Article 9 (sensitive data). Data may be processed without patient consent only for treatment, diagnosis, or public health activities
- [ ] **Implement strong authentication**: CNIL requires that patient access to personal health data uses strong authentication (not limited to login/password)
- [ ] **Data subject rights**: Implement mechanisms for access, rectification, erasure, portability
- [ ] **Data breach notification procedure**: 72-hour notification to CNIL, patient notification if high risk

**B. HDS (Hebergement de Donnees de Sante) Certification**

- [ ] **Verify hosting provider is HDS-certified**: Mandatory for any organization hosting personal health data collected in France
- [ ] **New HDS standard compliance** (effective Nov 16, 2024; transition deadline **May 16, 2026**):
  - Reduced from 44 to 31 requirements across 4 chapters + transparency chapter
  - Heavier integration with ISO 27001 (15 requirements in Chapter 5)
  - ISO 20000-1 references removed entirely
  - Most ISO 27018 requirements removed
- [ ] **EEA data localization**: Physical hosting must be exclusively within the European Economic Area
- [ ] **Public transparency**: Create a public mapping of any data transfers outside the EEA via specific webpage
- [ ] **Third-party disclosure** (new Chapter 8): Disclose all third-party involvement in data hosting

**HDS-certified providers suitable for French healthcare startups:**
- OVHcloud (HDS-certified, up to EUR 100K startup credits)
- Scaleway (HDS-certified, up to EUR 36K startup credits)
- Clever Cloud (HDS-certified, French)
- Outscale (HDS-certified, Dassault Systemes subsidiary)

**C. Pro Sante Connect (PSC) Validation**

- [ ] **Integrate PSC authentication** for healthcare professional access: PSC is the sectoral identity provider federation of reference for healthcare professionals
- [ ] **Register with PSC Espace de Confiance (EDC)**: The PSC EDC window on the Convergence platform is active as of May 5, 2025
- [ ] **Implement PSC-compliant authentication flow**: PSC enables authentication to all connected e-health services with secure methods
- [ ] **Future-proof for FIDO security keys**: Planned compatibility with FIDO standards
- [ ] **Validate with compliance API**: Use the compliance API to verify that information management meets requirements

**D. Medical Device Regulation (if applicable)**

- [ ] **Assess medical device classification**: Does the app qualify as a medical device under EU MDR 2017/745?
- [ ] **If yes - ANSM authorization**: National Agency for Medicines and Health Products authorization required
- [ ] **CE marking**: Required for medical devices in the EU
- [ ] **Clinical validation data**: Required for higher-risk device classifications

**E. Mon Espace Sante / DMP Integration (if applicable)**

- [ ] **Validate against French FHIR profiles** (ANS/Interop'Sante)
- [ ] **DMP integration testing**: Test shared medical record access via Mon espace sante APIs
- [ ] **e-Prescription compatibility**: If handling prescriptions
- [ ] **INSi teleservice**: National identity integration

### 7.2 CNIL Declaration Details

**Declaration process (2025):**
1. If your processing conforms to a CNIL standard reference (referentiel): File a **declaration of conformity**
2. If your processing does not conform: Submit for **prior authorization** from CNIL
3. For health research/studies: Separate reference methodologies (MR) apply
4. For National Health Data System (SNDS) data: CNIL-adopted reference methodology for research/evaluation

**Key CNIL requirements for health apps:**
- Strong authentication for patient data access
- Encryption at rest and in transit
- Access logging and audit trails
- Data minimization
- Purpose limitation documentation
- Regular security audits

### 7.3 HDS Verification Steps

1. **Select an HDS-certified hosting provider** (check official ANS list)
2. **Verify certification scope** covers your specific use case (IaaS, PaaS, SaaS)
3. **Confirm EEA-only data residence**
4. **Review provider's ISO 27001 certification** (prerequisite for HDS)
5. **Audit third-party sub-processors** disclosed by the provider
6. **Document everything** for potential CNIL audit

**Audit duration for HDS certification:** Initial certification audits require 2-5 days for most organizations.

### 7.4 App Store Review for Health Apps

**Apple App Store:**
- [ ] Health-related apps undergo additional review
- [ ] Must clearly describe data handling practices in App Privacy section
- [ ] HealthKit integration (if applicable) must follow Apple's Health guidelines
- [ ] Accessibility compliance (VoiceOver support mandatory)

**Google Play Store:**
- [ ] Health app policy compliance (declared health claims must be substantiated)
- [ ] Data Safety section must accurately reflect data collection and handling
- [ ] Target API level compliance (latest Android requirements)

**Both stores:**
- [ ] Clear privacy policy accessible within the app
- [ ] Consent mechanisms before any data collection
- [ ] Age-gating if applicable (health apps may interact with minors)
- [ ] Accurate medical disclaimers (app is not a substitute for medical advice, unless certified as medical device)

### 7.5 Enforcement and Penalties

Non-compliance with French health data regulations is subject to:
- **Administrative sanctions** from CNIL (up to EUR 20M or 4% global turnover under GDPR)
- **Civil sanctions** (damages to affected individuals)
- **Criminal sanctions** (for severe violations of health data protection)

**Sources:**
- [Digital Health Laws and Regulations 2025-2026 France (ICLG)](https://iclg.com/practice-areas/digital-health-laws-and-regulations/france)
- [French Health Data Compliance (InCountry)](https://incountry.com/blog/french-health-data-compliance-and-how-to-achieve-it/)
- [The New HDS Framework Explained (Schellman)](https://www.schellman.com/blog/compliance/new-hds-framework-2024)
- [France Publishes Updated HDS Certification Standard (Inside Privacy)](https://www.insideprivacy.com/health-privacy/france-publishes-updated-certification-standard-for-the-hosting-of-health-data/)
- [Health Data Hosting: New French HDS Certification (Hogan Lovells)](https://www.hoganlovells.com/en/publications/health-data-hosting-the-new-french-hds-certification-has-been-released)
- [HDS Certification Requirements (Qualysec)](https://qualysec.com/hds-certification-requirements/)
- [Pro Sante Connect (ANS)](https://esante.gouv.fr/produits-services/pro-sante-connect)
- [Doctrine Numerique Sante 2025: PSC et iGC Sante](https://esante.gouv.fr/doctrine/pro-sante-connect-igc-sante)
- [PSC Espace de Confiance (Portail Industriels)](https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/espace-de-confiance-api-pro-sante-connectees)
- [Legal Guide: Digital Health Apps in France (CMS)](https://cms.law/en/int/expert-guides/cms-expert-guide-to-digital-health-apps-and-telemedicine/france)
- [DPOs and Notification Requirements France (Baker McKenzie)](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/emea/france/topics/dpos-and-notification-requirements)
- [Data Protection Laws 2025-2026 France (ICLG)](https://iclg.com/practice-areas/data-protection-laws-and-regulations/france)
- [CNIL Practice Guide for Security of Personal Data 2024](https://www.cnil.fr/en/practice-guide-security-personal-data-2024-edition)
- [FAQ about Health Data Hosting (Euris)](https://www.euris.com/health-data-hosting/faq/)

---

## Summary of Key Recommendations

| Area | Primary Recommendation | Key Tool/Approach |
|------|----------------------|-------------------|
| **Testing Pyramid** | 70/20/10 split with compliance layer | Jest + Supertest + Maestro + OWASP ZAP |
| **Contract Testing** | Consumer-driven contracts | Pact (OSS) -> PactFlow at scale |
| **FHIR Validation** | Automated validation in CI | HAPI FHIR Validator |
| **Load Testing** | Developer-friendly scripting | Grafana k6 1.0 |
| **Security Testing** | Shift-left with CI integration | SonarQube + OWASP ZAP + Trivy |
| **Team Size (MVP)** | 8-10 people | Specialized with T-shaped skills |
| **DPO** | Mandatory for health data | Internal part-time or external service |
| **K8s Cost Optimization** | Right-sizing + spot instances | Kubecost + Goldilocks + VPA |
| **Cloud Provider** | Apply to both programs | OVHcloud (EUR 100K) + Scaleway (EUR 36K) |
| **Local Dev** | Docker Compose first, Tilt later | devcontainer.json + docker-compose.yml |
| **Monorepo** | Nx for NestJS microservices | @nx/nest + DDD library structure |
| **Mobile E2E** | External, zero-dependency testing | Maestro (YAML-based) |
| **France Compliance** | Start compliance from day one | HDS + CNIL + PSC + DPO |
