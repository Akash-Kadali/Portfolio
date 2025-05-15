import {
  portfolio,
  Store,
  Weather,
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  meta,
  starbucks,
  tesla,
  iiitvicd,
  umd,
  shopify,
  carrent,
  threejs,
  azure,
  cadnet,
  diagnosys,
  conversationalai,
  graphsage,
  nagendra,
  deepak,
  jignesh,
  hatespeech,
  document,
  imagesegmentation,
  imgcap,
  nlp
} from "../assets";
export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "education",
    title: "Education",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "ML Engineer",
    icon: web,
  },
  {
    title: "Computer Vision Engineer",
    icon: mobile,
  },
  {
    title: "NLP Specialist",
    icon: backend,
  },
  {
    title: "LLM Engineer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "meta",
    icon: meta,
  },
  {
    name: "starbucks",
    icon: starbucks,
  },
  {
    name: "tesla",
    icon: tesla,
  },
];

const experiences = [
  // {
  //   title: "Incoming Machine Learning Intern",
  //   company_name: "Ayar Labs",
  //   icon: azure, // Replace with actual import like ayarlabs
  //   iconBg: "#003049",
  //   date: "May 2025 – Aug 2025",
  //   points: [],
  // },
  {
    title: "Machine Learning Intern",
    company_name: "IIT Indore",
    icon: docker,
    iconBg: "#1c274c",
    date: "Jul 2024 – Dec 2024",
    points: [
      "Automated defect classification in photonic chips with AI models.",
      "Engineered optical I/O pipelines using statistical modeling tools.",
      "Worked on silicon photonics systems with industry collaborators.",
    ],
  },
  {
    title: "Machine Learning Intern",
    company_name: "NIT Jaipur",
    icon: mongodb,
    iconBg: "#2d3a65",
    date: "Jan 2024 – Jun 2024",
    points: [
      "Built AI-based chip inspection system using deep segmentation models.",
      "Improved automation with ViTs + U-Net architecture for photonics data.",
      "Accelerated real-time inspection via GPU and model quantization.",
    ],
  },
  {
    title: "Machine Learning Intern",
    company_name: "IIT Indore",
    icon: docker,
    iconBg: "#1c274c",
    date: "May 2023 – Dec 2023",
    points: [
      "Developed AI-based visual inspection system for chip defect detection.",
      "Enhanced image classification using CNNs and transfer learning.",
      "Used TensorFlow, PyTorch, and OpenCV for optical I/O analysis.",
      "Integrated statistical analysis via SciPy to improve pipeline efficiency.",
    ],
  },
];
const educations = [
  {
    degree: "MS in Applied Machine Learning",
    school_name: "University of Maryland, College Park",
    icon: umd,
    iconBg: "#003049",
    date: "Aug 2024 – May 2026",
    points: [
      "Focused on optimization, computer vision, NLP, and scalable ML systems.",
      "Working on LLM-based applications and applied deep learning projects.",
      "Developing AI-powered visual inspection systems for semiconductor analysis."
    ]
  },
  {
    degree: "B.Tech in Computer Science and Engineering",
    school_name: "IIIT Vadodara",
    icon: iiitvicd,
    iconBg: "#1c274c",
    date: "Dec 2020 – June 2024",
    points: [
      "Graduated with 8.78/10 GPA, with strong performance in ML, CV, DSA, OS, and DBMS.",
      "Held leadership roles: 3-year Student Representative, Secretary – Technical Committee, Core Member – Coding Club.",
      "Achieved top grades: DSA (AA), Prob & Stats (AA), OOP (AA), DBMS (AB), OS (AB), ML (AB), Image Processing (AA), Deep Learning (AB), AI (BB)."
    ]
  },
];

const testimonials = [
  {
    testimonial:
      "You are very sincere and hardworking. I am proud of you and grateful that I have you in my journey.",
    name: "Dr. Nagendra Kumar",
    designation: "Assistant Professor",
    company: "IIT Indore",
    image: nagendra,
  },
  {
    testimonial:
      "You are one of the students whom I still recall in class as an example.",
    name: "Dr. Jignesh Patel",
    designation: "Assistant Professor",
    company: "IIIT Vadodara",
    image: jignesh,
  },
  {
    testimonial:
      "You are one of our successful Interns. All the Best for your future",
    name: "Dr. Deepak Ranjan Nayak",
    designation: "Assistant Professor",
    company: "MNIT Jaipur",
    image: deepak,
  },
];

const projects = [
  {
    name: "CaDT-Net",
    description: "Transformer-based model for breast tumor segmentation.",
    tags: [
      { name: "PyTorch", color: "blue-text-gradient" },
      { name: "Medical Imaging", color: "green-text-gradient" },
    ],
    image: cadnet,
    website_link: "https://github.com/Akash-Kadali/CaDT-Net-A-Cascaded-Deformable-Transformer-Network",
    source_code_link: "https://github.com/Akash-Kadali/CaDT-Net-A-Cascaded-Deformable-Transformer-Network",
  },
  // {
  //   name: "DiagnoSys",
  //   description: "Full-stack AI system for medical diagnosis using CNNs and FastAPI.",
  //   tags: [
  //     { name: "React", color: "blue-text-gradient" },
  //     { name: "FastAPI", color: "green-text-gradient" },
  //     { name: "ML", color: "pink-text-gradient" },
  //   ],
  //   image: diagnosys,
  //   website_link: "https://github.com/Akash-Kadali/DiagnoSys",
  //   source_code_link: "https://github.com/Akash-Kadali/DiagnoSys",
  // },
  // {
  //   name: "NLP Summarizer",
  //   description: "Automated document summarization using Hugging Face and cloud deployment.",
  //   tags: [
  //     { name: "NLP", color: "blue-text-gradient" },
  //     { name: "Transformers", color: "green-text-gradient" },
  //   ],
  //   image: nlp,
  //   website_link: "https://github.com/Akash-Kadali/Cloud-Based-NLP-Model-for-Automated-Document-Summarization",
  //   source_code_link: "https://github.com/Akash-Kadali/Cloud-Based-NLP-Model-for-Automated-Document-Summarization",
  // },
  {
    name: "Conversational AI",
    description: "Speech + Vision chatbot using Whisper, LLaMA 3, and medical image analysis.",
    tags: [
      { name: "Voice AI", color: "blue-text-gradient" },
      { name: "LLaMA", color: "green-text-gradient" },
      { name: "Vision", color: "pink-text-gradient" },
    ],
    image: conversationalai,
    website_link: "https://github.com/Akash-Kadali/Conversational-AI-with-Voice-and-Visual-Capabilities",
    source_code_link: "https://github.com/Akash-Kadali/Conversational-AI-with-Voice-and-Visual-Capabilities",
  },
  {
    name: "Graph-Based User Modeling",
    description: "User-level feature extraction with contextual embeddings using GraphSAGE.",
    tags: [
      { name: "Graphs", color: "blue-text-gradient" },
      { name: "Embeddings", color: "green-text-gradient" },
    ],
    image: graphsage,
    website_link: "https://github.com/Akash-Kadali/A-Graph-Based-Framework-for-User-Level-Feature-Modeling-with-Contextual-Embeddings",
    source_code_link: "https://github.com/Akash-Kadali/A-Graph-Based-Framework-for-User-Level-Feature-Modeling-with-Contextual-Embeddings",
  },
  {
    name: "Hate Speech Detection",
    description: "Emotion-aware contrastive learning model for detecting implicit hate speech.",
    tags: [
      { name: "Contrastive Learning", color: "blue-text-gradient" },
      { name: "NLP", color: "green-text-gradient" },
    ],
    image: hatespeech,
    website_link: "https://github.com/Akash-Kadali/Supervised-Contrastive-Learning-with-Attention-Emotion-Synthesis-for-Implicit-Hate-Speech-Detection",
    source_code_link: "https://github.com/Akash-Kadali/Supervised-Contrastive-Learning-with-Attention-Emotion-Synthesis-for-Implicit-Hate-Speech-Detection",
  },
  {
    name: "Image Segmentation",
    description: "Applied semantic segmentation on chip images for defect analysis.",
    tags: [
      { name: "U-Net", color: "blue-text-gradient" },
      { name: "Computer Vision", color: "green-text-gradient" },
    ],
    image: imagesegmentation,
    website_link: "https://github.com/Akash-Kadali/Image-Segmentation",
    source_code_link: "https://github.com/Akash-Kadali/Image-Segmentation",
  },
  {
    name: "Image Captioning",
    description: "Caption generation model trained on the Flickr dataset.",
    tags: [
      { name: "Vision", color: "blue-text-gradient" },
      { name: "Text", color: "green-text-gradient" },
      { name: "Deep Learning", color: "pink-text-gradient" },
    ],
    image: imgcap,
    website_link: "https://github.com/Akash-Kadali/Employing-advanced-computer-vision-an-image-caption-generator-utilizes-the-expansive-Flickr-Dataset",
    source_code_link: "https://github.com/Akash-Kadali/Employing-advanced-computer-vision-an-image-caption-generator-utilizes-the-expansive-Flickr-Dataset",
  },
  // {
  //   name: "Document AI",
  //   description: "Document classification and OCR preprocessing using OpenCV.",
  //   tags: [
  //     { name: "OCR", color: "blue-text-gradient" },
  //     { name: "Document AI", color: "green-text-gradient" },
  //   ],
  //   image: document,
  //   website_link: "https://github.com/Akash-Kadali/Document-Image-Understanding",
  //   source_code_link: "https://github.com/Akash-Kadali/Document-Image-Understanding",
  // },
];


export { services, technologies, experiences, testimonials, projects, educations };
