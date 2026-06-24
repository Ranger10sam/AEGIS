import type { ConceptCategory, StudyPhase } from "../lib/database.types";

export interface SpringConceptSeed {
  id: string;
  category: ConceptCategory;
  title: string;
  phase: StudyPhase;
  /** The exact place in TaskFlow this concept lives (CLAUDE.md §7). */
  taskflowAnchor: string;
  description: string;
}

/**
 * The Spring Boot master list (CLAUDE.md §7). Seeded into spring_concepts for
 * every user. Order within the array becomes sort_order at seed time.
 */
export const SPRING_CONCEPTS: SpringConceptSeed[] = [
  // ── Phase 1 — Core Foundation ────────────────────────────────────────────
  {
    id: "spring-ioc",
    category: "core",
    title: "IoC Container & ApplicationContext",
    phase: 1,
    taskflowAnchor: "Application.java — SpringApplication.run()",
    description:
      "Spring's Inversion of Control container creates, wires, and manages your beans for you. The ApplicationContext is that container — it owns the lifecycle and hands dependencies to objects instead of them constructing their own.",
  },
  {
    id: "spring-di-types",
    category: "core",
    title: "DI: Constructor vs Field vs Setter",
    phase: 1,
    taskflowAnchor: "UserService.java — constructor injection",
    description:
      "The three ways Spring injects dependencies. Constructor injection is preferred: it makes dependencies explicit and final, enables testing without the container, and fails fast on missing or circular dependencies.",
  },
  {
    id: "spring-bean-lifecycle",
    category: "core",
    title: "Bean lifecycle, scope, init/destroy",
    phase: 1,
    taskflowAnchor: "@Bean config methods",
    description:
      "The stages a bean passes through: instantiation, dependency injection, @PostConstruct, ready-to-use, then @PreDestroy on shutdown. Knowing the order explains when your initialization code can safely run.",
  },
  {
    id: "spring-annotations-core",
    category: "core",
    title: "@Component / @Service / @Repository / @Controller",
    phase: 1,
    taskflowAnchor: "Every layer",
    description:
      "Stereotype annotations that mark a class as a Spring-managed bean and signal its role. They are all @Component under the hood; @Repository also translates persistence exceptions and the others aid component scanning and intent.",
  },
  {
    id: "spring-auto-config",
    category: "core",
    title: "@SpringBootApplication & auto-configuration",
    phase: 1,
    taskflowAnchor: "Application.java",
    description:
      "@SpringBootApplication bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan. Auto-configuration wires sensible defaults based on what's on the classpath, which you can override with your own beans or properties.",
  },
  {
    id: "spring-properties",
    category: "core",
    title: "application.yml, @Value, @ConfigurationProperties",
    phase: 1,
    taskflowAnchor: "DB + JWT config",
    description:
      "Externalized configuration. @Value injects a single property; @ConfigurationProperties binds a whole group of properties to a typed, validated object — the cleaner choice for related settings like datasource or JWT config.",
  },
  {
    id: "spring-rest-basics",
    category: "web",
    title: "@RestController, @RequestMapping, @PathVariable, @RequestBody",
    phase: 1,
    taskflowAnchor: "TaskController.java",
    description:
      "The building blocks of a REST endpoint. @RestController combines @Controller and @ResponseBody; the mapping annotations route HTTP verbs, @PathVariable reads URL segments, and @RequestBody deserializes the JSON payload.",
  },
  {
    id: "spring-response-entity",
    category: "web",
    title: "ResponseEntity & HTTP status codes",
    phase: 1,
    taskflowAnchor: "Controller return types",
    description:
      "ResponseEntity gives you full control over the response — status code, headers, and body — instead of always returning 200. Use it to send 201 Created with a Location header, 404, or 204 No Content deliberately.",
  },

  // ── Phase 2 — Depth ────────────────────────────────────────────────────────
  {
    id: "spring-data-jpa",
    category: "data",
    title: "Spring Data JPA, @Entity, @Repository",
    phase: 2,
    taskflowAnchor: "Task.java, TaskRepository.java",
    description:
      "JPA maps @Entity classes to tables, and Spring Data generates repository implementations from interfaces. Derived query methods like findByStatus are parsed from the method name into JPQL at runtime — no SQL to write.",
  },
  {
    id: "spring-transactions",
    category: "data",
    title: "@Transactional: propagation, isolation, rollback",
    phase: 2,
    taskflowAnchor: "TaskService.java",
    description:
      "@Transactional wraps a method in a database transaction via an AOP proxy. Propagation controls joining vs starting a new transaction (REQUIRED vs REQUIRES_NEW), isolation controls visibility of concurrent changes, and by default only unchecked exceptions roll back.",
  },
  {
    id: "spring-jpql",
    category: "data",
    title: "JPQL vs native, @Query",
    phase: 2,
    taskflowAnchor: "TaskRepository custom queries",
    description:
      "When derived methods aren't enough, @Query lets you write JPQL (entity-oriented, portable) or native SQL. JPQL queries entities and their fields; native runs raw SQL when you need database-specific features.",
  },
  {
    id: "spring-exception-handling",
    category: "web",
    title: "@ControllerAdvice, @ExceptionHandler, ProblemDetail",
    phase: 2,
    taskflowAnchor: "GlobalExceptionHandler.java",
    description:
      "Centralized error handling. @ControllerAdvice with @ExceptionHandler methods turns exceptions into clean HTTP responses across all controllers, and ProblemDetail (RFC 9457) gives a standard machine-readable error body.",
  },
  {
    id: "spring-validation",
    category: "web",
    title: "@Valid, constraint annotations, BindingResult",
    phase: 2,
    taskflowAnchor: "DTO classes",
    description:
      "Bean Validation declares rules on DTO fields (@NotNull, @Size, @Email). @Valid triggers validation on a request body, and a failure raises MethodArgumentNotValidException — caught by your handler to return a 400 with field errors.",
  },
  {
    id: "spring-security-basics",
    category: "security",
    title: "SecurityFilterChain, authN vs authZ",
    phase: 2,
    taskflowAnchor: "SecurityConfig.java",
    description:
      "Spring Security is a chain of servlet filters. Authentication establishes who you are; authorization decides what you may do. The modern SecurityFilterChain bean configures which endpoints are public, which need a role, and how login works.",
  },
  {
    id: "spring-jwt",
    category: "security",
    title: "JWT filter & auth token flow",
    phase: 2,
    taskflowAnchor: "JwtFilter.java",
    description:
      "Stateless auth: the server issues a signed JWT on login, the client sends it as a Bearer token, and a OncePerRequestFilter validates the signature and populates the SecurityContext on each request — no server session.",
  },
  {
    id: "spring-dto-pattern",
    category: "patterns",
    title: "DTO vs Entity separation, mapping",
    phase: 2,
    taskflowAnchor: "Request/Response DTOs",
    description:
      "DTOs decouple your API contract from your persistence model. Exposing entities leaks the schema, risks lazy-loading issues, and over-shares fields; mapping to request/response DTOs keeps the API stable and intentional.",
  },
  {
    id: "spring-service-layer",
    category: "patterns",
    title: "Service responsibilities, transaction boundaries",
    phase: 2,
    taskflowAnchor: "TaskService.java",
    description:
      "The service layer holds business logic and owns the transaction boundary. Controllers stay thin (HTTP concerns) and repositories stay focused on persistence, so the rules live in one testable place.",
  },
  {
    id: "spring-layered-arch",
    category: "patterns",
    title: "Controller → Service → Repository",
    phase: 2,
    taskflowAnchor: "Whole structure",
    description:
      "The standard layering: controllers handle HTTP, services hold logic and transactions, repositories handle data. Each layer depends only on the one below, which keeps responsibilities clear and the app easy to test and change.",
  },
  {
    id: "spring-testing-unit",
    category: "testing",
    title: "Mockito, @Mock, @InjectMocks",
    phase: 2,
    taskflowAnchor: "TaskServiceTest.java",
    description:
      "Fast unit tests that isolate one class. Mockito stubs collaborators with @Mock, @InjectMocks builds the class under test with those mocks, and you assert behavior without a database or Spring context.",
  },
  {
    id: "spring-testing-integration",
    category: "testing",
    title: "@SpringBootTest, MockMvc, @DataJpaTest",
    phase: 2,
    taskflowAnchor: "Integration tests",
    description:
      "Tests that wire real Spring beans. @SpringBootTest loads the context, MockMvc exercises controllers without a running server, and @DataJpaTest spins up a focused slice with an in-memory database for repository tests.",
  },

  // ── Phase 3 — Advanced & Interview-Critical ────────────────────────────────
  {
    id: "spring-aop",
    category: "advanced",
    title: "AOP, @Aspect, @Around, cross-cutting concerns",
    phase: 3,
    taskflowAnchor: "Logging aspect (to build)",
    description:
      "Aspect-Oriented Programming factors out cross-cutting concerns like logging, timing, or security. An @Aspect with advice such as @Around runs around matched join points via a proxy — the same mechanism behind @Transactional.",
  },
  {
    id: "spring-caching",
    category: "advanced",
    title: "@Cacheable, @CacheEvict, strategies",
    phase: 3,
    taskflowAnchor: "To add to TaskFlow",
    description:
      "Declarative caching. @Cacheable stores a method's result keyed by its arguments and returns it on the next call; @CacheEvict clears stale entries on writes. Watch the key strategy and when to evict to avoid serving stale data.",
  },
  {
    id: "spring-async",
    category: "advanced",
    title: "@Async, @EnableAsync, thread pools",
    phase: 3,
    taskflowAnchor: "Background tasks",
    description:
      "@Async runs a method on a separate thread so the caller doesn't block — good for emails or background work. It needs @EnableAsync and a configured Executor; self-invocation bypasses the proxy and won't be async.",
  },
  {
    id: "spring-actuator",
    category: "advanced",
    title: "Actuator, health checks, metrics",
    phase: 3,
    taskflowAnchor: "pom.xml actuator dep",
    description:
      "Spring Boot Actuator exposes production-ready endpoints like /health, /info, and /metrics. It's how orchestrators check liveness/readiness and how you surface metrics to monitoring — expose only what you need.",
  },
  {
    id: "spring-profiles",
    category: "advanced",
    title: "@Profile, environment-specific config",
    phase: 3,
    taskflowAnchor: "application-dev.yml",
    description:
      "Profiles let beans and properties differ per environment. @Profile(\"dev\") activates a bean only under that profile, and application-{profile}.yml overrides settings, so dev, test, and prod stay cleanly separated.",
  },
  {
    id: "spring-event-driven",
    category: "advanced",
    title: "ApplicationEvent, @EventListener",
    phase: 3,
    taskflowAnchor: "To add (decoupling)",
    description:
      "Spring's in-process publish/subscribe. Publish an event and let @EventListener beans react, decoupling the trigger from the side effects. Listeners can run synchronously or, with @Async, off the publishing thread.",
  },
  {
    id: "spring-n-plus-one",
    category: "data",
    title: "N+1 problem, @EntityGraph, fetch strategy",
    phase: 3,
    taskflowAnchor: "TaskRepository.java",
    description:
      "The classic JPA performance trap: loading a list, then firing one query per row for a lazy association (1 + N queries). Fix it with a fetch join, @EntityGraph, or batch fetching so the data loads in one or a few queries.",
  },
  {
    id: "spring-bean-scopes",
    category: "core",
    title: "Singleton vs Prototype vs Request",
    phase: 3,
    taskflowAnchor: "Config classes",
    description:
      "Bean scope controls how many instances exist. Singleton (the default) is one per container; prototype is a new instance per lookup; request/session are web-scoped. Injecting a prototype into a singleton needs care (e.g. a provider).",
  },
  {
    id: "spring-circular-deps",
    category: "core",
    title: "Circular dependencies & fixes",
    phase: 3,
    taskflowAnchor: "Architecture decisions",
    description:
      "When bean A needs B and B needs A. Constructor injection surfaces the cycle at startup (a feature, not a bug); the real fix is usually to rethink the design or extract a third bean, not to paper over it with @Lazy.",
  },
  {
    id: "spring-filter-interceptor",
    category: "web",
    title: "OncePerRequestFilter vs HandlerInterceptor",
    phase: 3,
    taskflowAnchor: "JwtFilter.java",
    description:
      "Two ways to run logic around requests. Servlet filters sit at the container level (before Spring MVC) and suit auth and CORS; HandlerInterceptors run inside MVC with access to the handler, suiting logging or model tweaks.",
  },
];
