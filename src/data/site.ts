/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the portfolio — no component changes needed.
 *
 * Entries marked `REVIEW:` need checking before publishing — mostly exact
 * months on recent roles, and details inferred from screenshots.
 */

export const CAREER_START_YEAR = 2019;

export const yearsOfExperience = (): number =>
  new Date().getFullYear() - CAREER_START_YEAR;

export const person = {
  firstName: "Vithurushan",
  lastName: "Meeneswaran",
  fullName: "Vithurushan Meeneswaran",
  role: "AI Tech Lead",
  company: "GenZ Innovations (Pvt) Ltd",
  shortBio:
    "AI Tech Lead building agentic systems — LLM orchestration, multi-agent runtimes and the platform engineering that keeps them safe in production.",
  origin: "Sri Lanka",
  location: "Potters Bar, London",
  country: "United Kingdom",
  addressLines: ["1 Coopers Road", "Potters Bar, London EN6 1JG", "United Kingdom"],
  email: "vithurushan@gmail.com",
  phone: "+44 7774 946384",
  phoneHref: "+447774946384",
  available: true,
  availabilityNote: "Open to AI leadership & consulting work",
} as const;

export const socials = [
  {
    label: "LinkedIn",
    handle: "vithurushan",
    href: "https://www.linkedin.com/in/vithurushan",
  },
  {
    label: "GitHub",
    handle: "Siva130497",
    href: "https://github.com/Siva130497",
  },
  {
    label: "Email",
    handle: person.email,
    href: `mailto:${person.email}`,
  },
] as const;

export const nav = [
  { label: "About", href: "#about", index: "01" },
  { label: "Experience", href: "#experience", index: "02" },
  { label: "Stack", href: "#skills", index: "03" },
  { label: "Work", href: "#work", index: "04" },
  { label: "Services", href: "#services", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
] as const;

export const about = {
  lead: "Anyone can get a model to answer. The engineering is in what happens when it's wrong, expensive, or being manipulated.",
  paragraphs: [
    "I'm an AI Tech Lead based just outside London, and the founder of GenZ Innovations. I spent seven years shipping web and mobile products — intern to senior to tech lead — before starting my own company to build AI systems full time.",
    "My current work is Velaris, an AI operating system. Every model call, agent run and channel message passes through one spine that enforces permission, cost and audit before anything leaves the network. It spans four runtimes — a Rust kernel, a Bun LLM router, Python agent and evaluation services, and a Next.js OS shell — and reaches users across nine channels.",
    "The part I care most about is the unglamorous half of agentic systems: least-privilege tool scopes, human approval bound to exactly what was approved, untrusted third-party content fenced so it can't reach instruction position, and deterministic checks running before any model is asked to judge. Autonomy is easy to demo and hard to make safe.",
    "Before this I ran two remote roles in parallel — tech lead at Prodigit in India, where my team built Skillety, an AI recruiter now matching candidates to thousands of live jobs; and senior engineer at DigiFront in Norway. I still write the product code, not just the architecture docs.",
  ],
} as const;

/** `value` is counted up from 1 on scroll; `suffix` is appended once it lands. */
export const stats = [
  { value: 7, suffix: "+", label: "Years building software" },
  { value: 4, suffix: "", label: "Runtimes in one platform" },
  { value: 9, suffix: "", label: "Channels one agent reaches" },
  { value: 4, suffix: "", label: "Countries worked across" }, // SL, Norway, India, UK
] as const;

export type Experience = {
  role: string;
  /** Short label for the career-ladder graphic in the About section. */
  shortRole: string;
  startYear: number;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  /** Ran at the same time as another role — surfaced as a badge on the card. */
  concurrent?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

/**
 * Seniority ladder: Software Engineer through the F11 years, Senior from
 * DigiFront onward, then tech lead and founder.
 *
 * Prodigit and DigiFront overlap deliberately — both were remote, one in India
 * and one in Norway. `concurrent` marks them so the overlap reads as intended
 * rather than as a typo.
 *
 * REVIEW: end months on Prodigit and DigiFront, and the GenZ start month.
 */
export const experience: Experience[] = [
  {
    role: "Founder & AI Tech Lead",
    shortRole: "Founder",
    startYear: 2025,
    company: "GenZ Innovations (Pvt) Ltd",
    location: "London, UK",
    period: "2025 — Present",
    current: true,
    summary:
      "Started my own company to build AI products full time. Velaris — an AI operating system — is the flagship.",
    highlights: [
      "Architect and build a kernel-mediated AI platform across Rust, Bun, Python and Next.js",
      "Design the agent supervision layer: planning, risk scoring, human approval and verification",
      "Own the safety model — least-privilege tool scopes, prompt-injection defence, audited tool calls",
      "Run LLM cost and quality observability across OpenAI, Anthropic, Google and fal.ai",
    ],
    stack: ["LangGraph", "Rust", "TypeScript", "Python", "Next.js", "Supabase"],
  },
  {
    role: "MERN Stack Tech Lead",
    shortRole: "Tech Lead",
    startYear: 2023,
    company: "Prodigit",
    location: "India · Remote",
    period: "Jun 2023 — 2025",
    concurrent: true,
    summary:
      "Led MERN delivery for a distributed product team, including Skillety — an AI-driven recruitment platform now live across India.",
    highlights: [
      "Led the team building Skillety, an AI recruitment platform matching CVs to live openings",
      "Set the architecture and code standards for React and Node.js delivery",
      "Ran review, release and production support across a distributed team",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    role: "Senior Software Engineer",
    shortRole: "Senior Engineer",
    startYear: 2023,
    company: "DigiFront AS",
    location: "Norway · Remote",
    period: "Mar 2023 — 2025",
    concurrent: true,
    summary:
      "Built and maintained production web applications for a Norwegian product team, working remotely across time zones.",
    highlights: [
      "Owned end-to-end delivery across the React front end and Node.js services",
      "Worked asynchronously with a distributed team, from spec through review to release",
      "Maintained and extended existing codebases alongside greenfield work",
    ],
    stack: ["React", "Node.js", "TypeScript", "MongoDB", "REST APIs"],
  },
  {
    role: "Software Engineer",
    shortRole: "Software Engineer",
    startYear: 2020,
    company: "F11 Software Labs",
    location: "Colombo, Sri Lanka",
    period: "Nov 2020 — Mar 2023",
    summary:
      "Shipped full-stack features across booking platforms, e-commerce storefronts and their admin dashboards — and mentored the engineers coming up behind me.",
    highlights: [
      "Built customer-facing booking flows and the admin tooling behind them",
      "Designed and integrated REST APIs against MySQL and MongoDB",
      "Delivered cross-platform mobile features with Flutter",
      "Reviewed code and mentored junior and associate engineers",
    ],
    stack: ["React", "Node.js", "Laravel", "Flutter", "MongoDB", "Figma"],
  },
  {
    role: "Associate Software Engineer",
    shortRole: "Associate Engineer",
    startYear: 2019,
    company: "F11 Software Labs",
    location: "Colombo, Sri Lanka",
    period: "Sep 2019 — Oct 2020",
    summary:
      "Moved from supporting features to owning them, across both front-end and back-end work.",
    highlights: [
      "Implemented UI components and pages from design handoff",
      "Wrote back-end endpoints and database queries under senior review",
      "Fixed defects and improved performance on live client applications",
    ],
    stack: ["JavaScript", "React", "PHP", "MySQL"],
  },
  {
    role: "Intern Software Engineer",
    shortRole: "Intern",
    startYear: 2019,
    company: "F11 Software Labs",
    location: "Colombo, Sri Lanka",
    period: "Mar 2019 — Aug 2019",
    summary:
      "First professional role — learning the fundamentals of shipping software with a team.",
    highlights: [
      "Built static and dynamic pages with HTML, CSS and JavaScript",
      "Learned version control, code review and agile delivery in practice",
    ],
    stack: ["HTML", "CSS", "JavaScript", "MySQL"],
  },
];

export type Education = {
  qualification: string;
  institution: string;
  location: string;
  period: string;
};

/** REVIEW: years for the diploma and the two school qualifications. */
export const education: Education[] = [
  {
    qualification: "MSc Artificial Intelligence and Robotics",
    institution: "University of Hertfordshire",
    location: "Hatfield, United Kingdom",
    period: "2025 — 2026",
  },
  {
    qualification: "BSc (Hons) Software Engineering",
    institution: "Solent University",
    location: "Southampton, United Kingdom",
    period: "2022 — 2023",
  },
  {
    qualification: "Higher National Diploma in Information Technology",
    institution: "Advance Institute of Technology",
    location: "Jaffna, Sri Lanka",
    period: "2019 — 2021",
  },
  {
    qualification: "Diploma in Hardware, Mobile & CCTV",
    institution: "Edhat International",
    location: "Sri Lanka",
    period: "—",
  },
  {
    qualification: "G.C.E. Advanced Level — Biology stream",
    institution: "Victoria College",
    location: "Sri Lanka",
    period: "—",
  },
  {
    qualification: "G.C.E. Ordinary Level — 9A passes",
    institution: "Victoria College",
    location: "Sri Lanka",
    period: "—",
  },
];

/** Spoken languages, from the CV. */
export const languages = ["English", "Tamil"] as const;

export type SkillGroup = { title: string; items: string[] };

/** Every entry below is something in production use in Velaris or an earlier role. */
export const skillGroups: SkillGroup[] = [
  {
    title: "AI orchestration",
    items: [
      "LangGraph",
      "LangChain",
      "DeepAgents",
      "MCP",
      "Vercel AI SDK",
      "Multi-agent systems",
      "Tool calling",
      "Human-in-the-loop",
    ],
  },
  {
    title: "Models & inference",
    items: [
      "OpenAI",
      "Anthropic",
      "Google",
      "OpenRouter",
      "fal.ai",
      "Hugging Face",
      "ONNX Runtime",
      "Streaming / SSE",
    ],
  },
  {
    title: "AI safety & evaluation",
    items: [
      "Prompt-injection defence",
      "Least-privilege tool scopes",
      "Approval binding",
      "Eval pipelines",
      "LLM-as-judge",
      "Guardrails",
    ],
  },
  {
    title: "LLM observability",
    items: ["Langfuse", "OpenTelemetry", "Sentry", "Cost attribution", "Tracing"],
  },
  {
    title: "Platform & backend",
    items: [
      "Rust",
      "Node.js",
      "Bun",
      "NestJS",
      "Hono",
      "FastAPI",
      "Laravel",
      "Livewire",
      "gRPC",
      "BullMQ",
    ],
  },
  {
    title: "Front end",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Astro",
      "Tailwind CSS",
      "GSAP",
      "React Three Fiber",
    ],
  },
  {
    title: "Data & infra",
    items: [
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "MongoDB",
      "Redis",
      "MySQL",
      "Docker",
      "Turborepo",
    ],
  },
  {
    title: "Systems & hardware",
    items: [
      "Linux",
      "macOS",
      "Windows",
      "Networking",
      "Arduino",
      "Flutter",
      "Kotlin",
    ],
  },
  {
    title: "Ways of working",
    items: [
      "Technical leadership",
      "Architecture & ADRs",
      "Code review",
      "Mentoring",
      "Remote-first delivery",
      "Teaching MERN",
    ],
  },
];

/** Words for the scrolling marquee strip. */
export const marquee = [
  "LangGraph",
  "Agents",
  "Rust",
  "TypeScript",
  "Evals",
  "Python",
  "MCP",
  "Next.js",
  "Guardrails",
  "Postgres",
  "Tracing",
  "Bun",
];

export type ArchitectureLayer = {
  label: string;
  nodes: { name: string; detail: string }[];
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  description: string;
  role: string;
  stack: string[];
  images: string[];
  href?: string;
  repo?: string;
  /** Renders the architecture diagram instead of a screenshot. */
  featured?: boolean;
  architecture?: ArchitectureLayer[];
  notes?: string[];
};

/**
 * REVIEW: the four 2021–2023 client projects were read off screenshots from the
 * old portfolio — stacks are best guesses, and none have live links except
 * Airwing. Velaris detail is deliberately architecture-only: no cost model,
 * no pricing tiers, no roadmap.
 */
export const projects: Project[] = [
  {
    slug: "velaris",
    name: "Velaris",
    year: "2026 — ongoing",
    category: "AI operating system",
    summary:
      "A kernel-mediated AI OS where every model call, agent run and message passes one audited spine.",
    description:
      "Chat is the front door, not the product. Velaris treats AI as an operating system: apps, files, agents, skills, workflows and memory as first-class primitives, reachable from nine channels. A single spine sits between the user and every external call, enforcing permission, cost and audit before anything leaves the network — so autonomy scales without the blast radius scaling with it.",
    role: "Architecture & full-stack engineering",
    stack: [
      "Rust",
      "TypeScript",
      "Python",
      "LangGraph",
      "Next.js",
      "Supabase",
      "gRPC",
    ],
    images: [],
    featured: true,
    architecture: [
      {
        label: "Surface",
        nodes: [
          { name: "OS shell", detail: "Next.js · workspace-scoped apps" },
          { name: "Channels", detail: "Slack · Teams · WhatsApp · Voice · +5" },
        ],
      },
      {
        label: "Seam",
        nodes: [
          { name: "api-gateway", detail: "NestJS · auth, billing, typed contract" },
        ],
      },
      {
        label: "Spine",
        nodes: [
          { name: "Kernel", detail: "Rust · permission · cost · audit" },
        ],
      },
      {
        label: "Runtime",
        nodes: [
          { name: "stream-engine", detail: "Bun · LLM router, 5 providers" },
          { name: "langgraph-runner", detail: "Python · stateful agents, MCP tools" },
          { name: "evaluator", detail: "Python · safety & quality gates" },
        ],
      },
      {
        label: "Data",
        nodes: [
          { name: "State", detail: "Postgres · Prisma · Redis · agent memory" },
          { name: "Telemetry", detail: "Langfuse · OpenTelemetry · Sentry" },
        ],
      },
    ],
    notes: [
      "Agent runs are planned before they execute — risk, scopes and cost are derived from a registry, not guessed by a model, and ceremony scales with the consequence of the action.",
      "Human approval is cryptographically bound to the exact plan approved, so a tampered payload can't reuse someone's consent.",
      "Third-party content is fenced as untrusted data with the instruction kept outside the fence, closing the obvious prompt-injection path.",
      "Verification runs deterministic checks first; a model verdict is only ever allowed to veto, never to pass something on its own.",
    ],
  },
  {
    slug: "greencore-order-planner",
    name: "Greencore Order Planner",
    year: "2026",
    category: "Retail operations tool",
    summary:
      "Turns a weekly stock-wastage PDF into next week's order list, entirely in the browser.",
    description:
      "Ordering for a Shell forecourt store meant reading a wastage report against six planogram PDFs by hand. This does it from one upload: the report is parsed client-side — nothing is sent anywhere — and matched against 358 product lines extracted from 366 planogram placements. A bad upload is rejected with a specific reason and never clears what's already loaded.",
    role: "Design & build",
    stack: ["React", "pdf.js", "Vite"],
    images: [],
    notes: [
      "Planogram extraction used word-level bounding boxes rather than plain text: the shelf graphic shares vertical bands with the table beside it, so a line-based parse silently chains unrelated rows. 366 of 366 lines parsed, none dropped.",
    ],
  },
  {
    slug: "greyskull",
    name: "GREYSKULL",
    year: "2025",
    category: "Operations PWA",
    summary:
      "Installable shift-management app for forecourt staff — diary, stock, staffing and issue logging.",
    description:
      "A mobile-first PWA for running a fuel-station shift: a station diary on a date carousel, essential-stock lists, staff and issue-type management, a Costa service guide and a live weather banner. Built as a layered Express API with schema validation at the boundary, and a React front end designed to be used one-handed behind a counter.",
    role: "Full-stack development",
    stack: ["React", "Express", "MongoDB", "Zod", "Tailwind CSS", "PWA"],
    images: [],
  },
  {
    slug: "skillety",
    name: "Skillety",
    year: "2023 — 2025",
    category: "AI recruitment platform",
    summary:
      "Recruitment-as-a-service built around Lety, an AI recruiter that reads a CV and finds the jobs that fit.",
    description:
      "Candidates upload a CV instead of typing search filters, and Lety matches them against live openings — 2,400+ across India, from 140+ registered companies — then generates an ATS-ready CV for the application. Employers get the other half: posting, CV search and a candidate pipeline. I led the team that built it at Prodigit.",
    role: "Team lead · full-stack",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    images: ["/img/projects/skillety-1.png", "/img/projects/skillety-jobs.png"],
    href: "https://skillety.com",
  },
  {
    slug: "the-parking-deals",
    name: "The Parking Deals",
    year: "2023",
    category: "Booking platform",
    summary:
      "UK airport parking comparison and booking, with a full back-office admin behind it.",
    description:
      "A complete redesign and rebuild of the earlier Airwing Parking platform. Travellers compare meet-and-greet, park-and-ride and long-stay parking across Heathrow, Gatwick and Luton, pick drop-off and pick-up times, apply promo codes and get a live quote before booking. Behind it sits an admin console covering customers, bookings, rates, offers, reviews and complaints.",
    role: "Full-stack development",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    images: ["/img/projects/parkingdeals.png"],
    href: "https://www.theparkingdeals.co.uk/",
  },
  {
    slug: "disney-shuttle-paris",
    name: "Disney Shuttle Paris",
    year: "2022",
    category: "Booking platform",
    summary:
      "Multi-language private shuttle transfer booking for Paris airports and Disneyland.",
    description:
      "Private transfer service with three booking modes — airport, standard and trip — plus a fixed-price fare calculator, free cancellation rules and a name-board option at arrivals. Localised across English, French, Italian, Spanish and German.",
    role: "Full-stack development",
    stack: ["React", "Node.js", "MySQL", "i18n"],
    images: ["/img/projects/project7.jpg"],
  },
  {
    slug: "z-mobiles",
    name: "Z Mobiles",
    year: "2022",
    category: "E-commerce",
    summary:
      "Consumer electronics storefront with a full analytics and operations dashboard.",
    description:
      "A product catalogue with ratings, cart and authentication on the customer side, paired with an admin dashboard for users, products, orders and delivery — revenue charts, six-month trends, transaction tables, system health and logs, with dark mode and language switching.",
    role: "Full-stack development",
    stack: ["React", "Node.js", "MongoDB", "Chart.js"],
    images: ["/img/projects/project6.jpg", "/img/projects/project5.jpg"],
  },
  {
    slug: "stitch-and-style",
    name: "Stitch & Style",
    year: "2021",
    category: "E-commerce",
    summary:
      "Multi-currency fashion retail storefront with women's, men's and children's ranges.",
    description:
      "A clothing retailer front end with region and currency switching, category navigation, search, wishlist, account area and cart — built to feel closer to an editorial lookbook than a template store.",
    role: "Front-end development",
    stack: ["React", "Laravel", "MySQL"],
    images: ["/img/projects/project4.jpg"],
  },
];

export type SideProject = {
  name: string;
  category: string;
  description: string;
  stack: string[];
};

/**
 * Earlier hardware and utility builds. Kept as a compact list rather than full
 * project blocks — they're worth showing, but they aren't the argument the
 * work section is making.
 *
 * REVIEW: years for both, if you want them shown.
 */
export const sideProjects: SideProject[] = [
  {
    name: "CCTV Motion Capture System",
    category: "Hardware · computer vision",
    description:
      "An Arduino security camera that watches a 180° arc with PIR sensors. On detection a servo swings the camera base toward the movement, and LED status lights in the base show which sensor fired.",
    stack: ["Python", "C++", "Arduino", "PIR sensors"],
  },
  {
    name: "Wi-Fi File Transfer",
    category: "Mobile · networking",
    description:
      "Turns an Android phone into an FTP server so its storage mounts on Android, Windows, macOS and iOS over the local network — or remotely, with a forwarded port.",
    stack: ["Kotlin", "Java", "FTP", "Android"],
  },
];

export type Service = { title: string; description: string };

export const services: Service[] = [
  {
    title: "AI systems architecture",
    description:
      "Designing the platform an agent product actually needs — the seam between your app and the models, with permission, cost and audit enforced in one place instead of scattered across call sites.",
  },
  {
    title: "Agent & workflow engineering",
    description:
      "Multi-agent systems in LangGraph with durable state, tool calling over MCP, and human-in-the-loop approvals at the points where being wrong is expensive.",
  },
  {
    title: "AI safety & evaluation",
    description:
      "Prompt-injection defence, least-privilege tool scoping, and evaluation pipelines that gate releases — deterministic checks first, model judgment only where it earns its place.",
  },
  {
    title: "LLM cost & observability",
    description:
      "Tracing every model call to a user, a run and a number. Routing across providers, catching quality regressions, and knowing what a feature costs before the invoice tells you.",
  },
  {
    title: "Full-stack product delivery",
    description:
      "Seven years of shipping the whole thing — React and Next.js front ends, Node, Rust and Python services, Postgres and Mongo underneath.",
  },
  {
    title: "Technical leadership",
    description:
      "Setting architecture, writing the decision records, reviewing the code and bringing engineers up the track. I've led MERN delivery and mentored from intern level upward.",
  },
];

export const interests = [
  "Agentic system design",
  "AI safety & red-teaming",
  "Chess — provincial-level champion",
] as const;

export const siteMeta = {
  title: `${person.fullName} — ${person.role}`,
  description: `${person.role} in ${person.location}, ${person.country}. Founder of GenZ Innovations, building Velaris — a kernel-mediated AI operating system across Rust, TypeScript and Python. ${yearsOfExperience()}+ years in software.`,
  /**
   * Canonical origin — drives metadataBase, OG tags, sitemap and robots.
   * Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash);
   * set it in Netlify once the final domain is attached.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vithurushan.netlify.app",
  keywords: [
    "Vithurushan Meeneswaran",
    "AI Tech Lead",
    "AI Engineer London",
    "LangGraph Developer",
    "Multi-agent systems",
    "LLM orchestration",
    "AI platform architect",
    "GenZ Innovations",
    "Velaris AI OS",
  ],
} as const;
