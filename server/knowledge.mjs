export const profile = {
  person: {
    name: "Sri Akash Kadali",
    headline: "Machine Learning Engineer at Parspec",
    location: "San Francisco Bay Area",
    summary:
      "Machine learning engineer building end-to-end AI systems across data pipelines, model development, backend services, computer vision, NLP, generative AI, and scalable inference.",
    links: {
      github: "https://github.com/Akash-Kadali",
      linkedin: "https://www.linkedin.com/in/sri-akash-kadali",
    },
  },
  skills: [
    "Python",
    "Machine Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Deep Learning",
    "Generative AI",
    "LLM integration",
    "REST APIs",
    "Docker",
    "Experiment tracking",
    "Scalable inference",
    "Transformers",
    "PyTorch",
    "Graph neural networks",
  ],
  experience: [
    {
      organization: "Parspec",
      role: "Machine Learning Engineer",
      period: "Jun 2026 – Present",
      location: "San Mateo, California",
      scope: [
        "Applied machine learning",
        "Natural language generation",
        "Production AI systems",
      ],
    },
    {
      organization: "SnugFit Solutions",
      role: "Computer Vision Engineer Intern",
      period: "Jun 2026",
      location: "McLean, Virginia",
      scope: ["Computer vision", "Mobile 3D imaging"],
    },
    {
      organization: "Ayar Labs",
      role: "Machine Learning Engineer Intern",
      period: "May 2025 – Aug 2025",
      location: "San Jose, California",
      scope: ["Machine learning", "Visual inspection", "Production research"],
    },
    {
      organization: "IIT Indore",
      role: "Machine Learning / AI Intern",
      period: "Jun 2024 – Aug 2024",
      location: "Remote",
      scope: ["Machine learning", "Research engineering"],
    },
    {
      organization: "MNIT Jaipur",
      role: "Machine Learning / AI Intern",
      period: "Jan 2024 – Jun 2024",
      location: "Jaipur, India",
      scope: ["Computer vision", "Vision transformers", "Research"],
    },
  ],
  education: [
    {
      institution: "University of Maryland, College Park",
      degree: "MS in Applied Machine Learning",
      period: "Aug 2024 – May 2026",
    },
    {
      institution: "IIIT Vadodara",
      degree: "B.Tech in Computer Science and Engineering",
      period: "Dec 2020 – Jun 2024",
    },
  ],
  publications: [
    {
      title:
        "CaDT-Net: A Cascaded Deformable Transformer Network for Multiclass Breast Cancer Histopathological Image Classification",
      venue: "ICONIP 2024 · Springer LNCS Volume 15292",
      topics: [
        "Medical imaging",
        "Vision transformers",
        "Deformable attention",
        "Histopathology",
      ],
      url: "https://lnkd.in/dZ7Ptmpa",
    },
  ],
  projects: [
    {
      title: "CaDT-Net",
      summary:
        "Transformer architecture for breast cancer histopathology classification using deformable attention.",
      topics: ["PyTorch", "Medical imaging", "Vision transformers"],
      url: "https://github.com/Akash-Kadali/CaDT-Net-A-Cascaded-Deformable-Transformer-Network",
    },
    {
      title: "Conversational AI",
      summary:
        "Speech and vision assistant using Whisper, LLaMA 3, and medical image analysis.",
      topics: ["Voice AI", "LLaMA", "Computer vision"],
      url: "https://github.com/Akash-Kadali/Conversational-AI-with-Voice-and-Visual-Capabilities",
    },
    {
      title: "Graph-Based User Modeling",
      summary:
        "Contextual user embeddings and feature modeling with GraphSAGE.",
      topics: ["Graph neural networks", "Embeddings", "GraphSAGE"],
      url: "https://github.com/Akash-Kadali/A-Graph-Based-Framework-for-User-Level-Feature-Modeling-with-Contextual-Embeddings",
    },
    {
      title: "Hate Speech Detection",
      summary:
        "Emotion-aware supervised contrastive learning for implicit hate speech detection.",
      topics: ["NLP", "Contrastive learning", "Attention"],
      url: "https://github.com/Akash-Kadali/Supervised-Contrastive-Learning-with-Attention-Emotion-Synthesis-for-Implicit-Hate-Speech-Detection",
    },
    {
      title: "Image Segmentation",
      summary: "Semantic segmentation of chip imagery for defect analysis.",
      topics: ["U-Net", "Computer vision", "Inspection"],
      url: "https://github.com/Akash-Kadali/Image-Segmentation",
    },
    {
      title: "Image Captioning",
      summary:
        "Vision-to-language caption generation trained on the Flickr dataset.",
      topics: ["Computer vision", "NLP", "Deep learning"],
      url: "https://github.com/Akash-Kadali/Employing-advanced-computer-vision-an-image-caption-generator-utilizes-the-expansive-Flickr-Dataset",
    },
  ],
};

const normalize = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim();
const tokens = (value) => [
  ...new Set(
    normalize(value)
      .split(/\s+/)
      .filter((token) => token.length > 1),
  ),
];

export function searchKnowledge(query) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return [];
  const records = [
    ...profile.experience.map((item) => ({
      type: "experience",
      title: `${item.role} · ${item.organization}`,
      summary: `${item.period} · ${item.location} · ${item.scope.join(" · ")}`,
      url: "#trajectory",
      keywords: [item.role, item.organization, item.location, ...item.scope],
    })),
    ...profile.education.map((item) => ({
      type: "education",
      title: item.degree,
      summary: `${item.institution} · ${item.period}`,
      url: "#trajectory",
      keywords: [item.degree, item.institution],
    })),
    ...profile.publications.map((item) => ({
      type: "publication",
      title: item.title,
      summary: `${item.venue} · ${item.topics.join(" · ")}`,
      url: item.url,
      keywords: [item.title, item.venue, ...item.topics],
    })),
    ...profile.projects.map((item) => ({
      type: "project",
      title: item.title,
      summary: item.summary,
      url: item.url,
      keywords: [item.title, item.summary, ...item.topics],
    })),
  ];
  return records
    .map((record) => {
      const haystack = normalize(
        [record.title, record.summary, ...record.keywords].join(" "),
      );
      const matched = queryTokens.filter((token) => haystack.includes(token));
      const title = normalize(record.title);
      const score =
        matched.reduce(
          (sum, token) => sum + (title.includes(token) ? 3 : 1),
          0,
        ) / queryTokens.length;
      return {
        ...record,
        score: Number(score.toFixed(2)),
        matchedTerms: matched,
      };
    })
    .filter((item) => item.matchedTerms.length)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

const skillAliases = {
  Python: ["python"],
  "Machine Learning": ["machine learning", "ml"],
  "Computer Vision": ["computer vision", "vision", "opencv"],
  "Natural Language Processing": ["natural language processing", "nlp"],
  "Deep Learning": ["deep learning", "neural network"],
  "Generative AI": ["generative ai", "genai"],
  "LLM integration": ["llm", "large language model", "rag"],
  "REST APIs": ["rest", "api", "fastapi"],
  Docker: ["docker", "container"],
  "Experiment tracking": ["experiment tracking", "mlflow", "wandb"],
  "Scalable inference": ["inference", "serving", "scalable"],
  Transformers: ["transformer", "attention"],
  PyTorch: ["pytorch"],
  "Graph neural networks": ["graph neural", "gnn", "graphsage"],
  Kubernetes: ["kubernetes", "k8s"],
  AWS: ["aws", "amazon web services"],
  GCP: ["gcp", "google cloud"],
  Azure: ["azure"],
  SQL: ["sql", "postgres", "postgresql", "mysql"],
  Spark: ["spark", "pyspark"],
  Terraform: ["terraform", "infrastructure as code"],
  TensorFlow: ["tensorflow", "keras"],
  Java: ["java"],
  "C++": ["c++"],
  Go: ["golang"],
};

export function matchJob(description) {
  const text = normalize(description);
  const requested = Object.entries(skillAliases)
    .filter(([, aliases]) =>
      aliases.some((alias) => text.includes(normalize(alias))),
    )
    .map(([skill]) => skill);
  const owned = new Set(profile.skills);
  const matched = requested.filter((skill) => owned.has(skill));
  const missing = requested.filter((skill) => !owned.has(skill));
  const evidence = searchKnowledge(matched.join(" ")).slice(0, 5);
  return {
    score: requested.length
      ? Math.round((matched.length / requested.length) * 100)
      : 0,
    requested,
    matched,
    missing,
    evidence,
    note: requested.length
      ? "Deterministic match against verified portfolio evidence; not a hiring recommendation."
      : "No supported skill terms were detected in the description.",
  };
}
