/**
 * ==============================================================================
 * LOCAL STATIC DATA STORE - MESAM E TAMAAR KHAN
 * ==============================================================================
 * Populated directly from mylife.docx and Mesam E Tamaar - Resume.pdf.
 * All updates here reflect immediately across the portfolio.
 */

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photo_url: string | null;
  location: string;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  resume_url: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  images: string[];
  github_url: string | null;
  demo_url: string | null;
  tag_ids: string[];
  order: number;
  featured: boolean;
  notes?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null; // null represents "Present"
  location: string;
  bullets: string[];
  sort_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  badge_url: string | null;
  sort_order: number;
}

export interface Skill {
  id: string;
  group_name: string;
  name: string;
  sort_order: number;
}

/* -------------------------------------------------------------------------- */
/* 1. PROFILE                                                                 */
/* -------------------------------------------------------------------------- */
export const profileData: Profile = {
  name: 'Mesam E Tamaar Khan',
  title: 'Security Researcher & Penetration Tester',
  tagline: 'Computer Science graduate specializing in offensive security, VAPT, and GRC-aligned risk reporting.',
  bio: 'Computer Science graduate (FAST-NUCES, Islamabad) specializing in offensive security, with hands-on experience conducting client-facing penetration testing engagements across authentication, access control, and injection vulnerabilities. Findings rated using a NIST-aligned risk rating approach and vulnerability management lifecycle, with relevant controls mapped to ISO 27001. Comfortable working across the full offensive lifecycle: reconnaissance, exploitation, network pivoting, and post-exploitation in Linux and Windows environments.',
  photo_url: '/profile.png', // Place a photo in /public (e.g. '/profile.jpg') or set image URL
  location: 'Islamabad, Pakistan',
  email: 'mesamtamaark@gmail.com',
  github_url: 'https://github.com/mesametamaarkhan',
  linkedin_url: 'https://linkedin.com/in/mesam-tamaar-khan',
  twitter_url: null,
  instagram_url: null,
  resume_url: '/resume.pdf',
};

/* -------------------------------------------------------------------------- */
/* 2. TAGS (FILTER CHIPS)                                                     */
/* -------------------------------------------------------------------------- */
export const tagsData: Tag[] = [
  { id: 'sec', name: 'Security' },
  { id: 'attack', name: 'Offensive' },
  { id: 'defense', name: 'Defensive' },
  { id: 'grc', name: 'GRC & Audit' },
  { id: 'tools', name: 'Tooling' },
  { id: 'web', name: 'Web & Mobile' },
  { id: 'research', name: 'Research' },
];

/* -------------------------------------------------------------------------- */
/* 3. PROJECTS                                                                */
/* -------------------------------------------------------------------------- */
export const projectsData: Project[] = [
  {
    id: 'auto-sentry',
    title: 'Auto-Sentry — Agentic NDR Platform',
    description: 'Final Year Project. Designed a multi-agent Network Detection & Response (NDR) platform with planner, detection, and response agents coordinated through a graph-based pipeline. Routes network events through rule-based and ML-oriented anomaly detection, triggering automated containment actions (host isolation, rule updates) to eliminate manual triage for common incidents.',
    tech_stack: ['Python', 'Suricata', 'Wazuh', 'ML Anomaly Detection', 'Graph Pipelines', 'Docker'],
    image_url: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
    images: ['https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['sec', 'defense', 'research'],
    order: 1,
    featured: true,
  },
  {
    id: 'safeharbor',
    title: 'SafeHarbor — Multi-Stage Security Assessment',
    description: 'Conducted a controlled, multi-stage offensive security assessment across containerized systems in an isolated lab, following PTES methodology: reconnaissance, service enumeration, vulnerability analysis, network pivoting between compromised hosts (Metasploit autoroute, Proxychains), and exploitation of internal services including an unauthenticated Docker API, mapped to MITRE ATT&CK.',
    tech_stack: ['Metasploit', 'Burp Suite', 'Proxychains', 'Docker API', 'Nmap', 'PTES', 'MITRE ATT&CK'],
    image_url: 'https://images.pexels.com/photos/60504/security-protection-antivirus-software-60504.jpeg',
    images: ['https://images.pexels.com/photos/60504/security-protection-antivirus-software-60504.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['sec', 'attack', 'research'],
    order: 2,
    featured: true,
  },
  {
    id: 'linux-hardening',
    title: 'Linux System Hardening Lab',
    description: 'Hardened a Linux system end-to-end, including SSH configuration (key-based auth, disabled root login), firewall rules, and privilege management. Applied CIS Benchmark-style controls to lock down services, file permissions, and user privileges, and used auditd logging to verify each hardening step held under simulated attack attempts.',
    tech_stack: ['Linux', 'auditd', 'OpenSSH', 'iptables', 'CIS Benchmarks', 'Bash'],
    image_url: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg',
    images: ['https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['sec', 'defense', 'tools'],
    order: 3,
    featured: true,
  },
  {
    id: 'contapp',
    title: 'Contapp — Mobile Contact System',
    description: 'Built a contact management mobile application solo from end to end using Flutter and Supabase. Features secure authentication, real-time synchronization, and access control. Shipped to production and actively used internally by the Aartec engineering team.',
    tech_stack: ['Flutter', 'Supabase', 'Dart', 'PostgreSQL', 'Mobile'],
    image_url: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    images: ['https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['web', 'tools'],
    order: 4,
    featured: true,
  },
  {
    id: 'rshell',
    title: 'rshell — Unix Command Line Shell',
    description: 'Custom command-line Unix shell implemented in C. Features command parsing, execution via fork/execvp, standard I/O redirection, piping between processes, and signal handling.',
    tech_stack: ['C', 'Unix Systems', 'POSIX', 'Process Control'],
    image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    images: ['https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['tools', 'research'],
    order: 5,
    featured: false,
  },
  {
    id: 'secure-chat',
    title: 'SecureChat — Cryptographic Messaging Protocol',
    description: 'Secure client-server communication application implementing end-to-end cryptographic message confidentiality, session key negotiation, and integrity verification over socket channels.',
    tech_stack: ['TypeScript', 'Node.js', 'WebSockets', 'Cryptography'],
    image_url: 'https://images.pexels.com/photos/270700/pexels-photo-270700.jpeg',
    images: ['https://images.pexels.com/photos/270700/pexels-photo-270700.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['sec', 'web'],
    order: 6,
    featured: false,
  },
  {
    id: 'dynamic-sssp',
    title: 'Dynamic SSSP Parallel Framework',
    description: 'Parallel computation framework for dynamic single-source shortest path (SSSP) updates in C++ on large-scale sparse graphs, utilizing thread synchronization and performance benchmarking.',
    tech_stack: ['C++', 'OpenMP', 'Parallel Algorithms', 'Graph Theory'],
    image_url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    images: ['https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['research', 'tools'],
    order: 7,
    featured: false,
  },
  {
    id: 'supply-chain-dapp',
    title: 'Supply Chain Tracking dApp',
    description: 'Decentralized application with Ethereum smart contracts tracking product provenance, ownership handoffs, and audit logs with frontend state visualization.',
    tech_stack: ['Solidity', 'Hardhat', 'React', 'Ethers.js'],
    image_url: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
    images: ['https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['web', 'tools'],
    order: 8,
    featured: false,
  },
  {
    id: 'ipfs-dht',
    title: 'IPFS Distributed Hash Table Simulation',
    description: 'Simulation of the InterPlanetary File System (IPFS) Kademlia-based Distributed Hash Table (DHT) in C++, exploring peer node routing, bucket maintenance, and content resolution.',
    tech_stack: ['C++', 'Distributed Systems', 'Kademlia DHT', 'P2P'],
    image_url: 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg',
    images: ['https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg'],
    github_url: 'https://github.com/mesametamaarkhan',
    demo_url: null,
    tag_ids: ['research', 'tools'],
    order: 9,
    featured: false,
  },
];

/* -------------------------------------------------------------------------- */
/* 4. WORK EXPERIENCE                                                         */
/* -------------------------------------------------------------------------- */
export const experiencesData: Experience[] = [
  {
    id: 'exp-1',
    company: 'Aartec',
    role: 'Penetration Tester',
    start_date: '2026-07',
    end_date: '2026-08',
    location: 'Islamabad, Pakistan',
    bullets: [
      'Delivered a client engagement penetration testing a production website and the Contapp application, testing authentication and session handling, access control, and injection vulnerabilities using Burp Suite, Nessus, OWASP ZAP, Nmap, and SQLMap.',
      'Rated findings using a NIST-aligned risk rating approach and vulnerability management lifecycle, mapped relevant controls to ISO 27001, and delivered a client-ready report with remediation guidance supporting the application’s compliance posture.',
    ],
    sort_order: 1,
  },
  {
    id: 'exp-2',
    company: 'Aartec',
    role: 'Software Engineer Intern',
    start_date: '2026-05',
    end_date: '2026-07',
    location: 'Islamabad, Pakistan',
    bullets: [
      'Built a contact management mobile application (Contapp) solo, end to end, using Flutter and Supabase.',
      'Shipped to production and actively used internally by the Aartec engineering team.',
    ],
    sort_order: 2,
  },
  {
    id: 'exp-3',
    company: 'Pakistan Software Export Board (PSEB)',
    role: 'Web Development Intern',
    start_date: '2024-11',
    end_date: '2025-01',
    location: 'Islamabad, Pakistan',
    bullets: [
      'Developed full-stack features and integrated REST APIs for a mentorship and freelancing platform in a collaborative, team-based environment.',
    ],
    sort_order: 3,
  },
  {
    id: 'exp-4',
    company: 'Independent / Freelance',
    role: 'Software & Systems Developer',
    start_date: '2023-01',
    end_date: '2024-10',
    location: 'Remote',
    bullets: [
      'Developed 2D game systems and simulations in C++ using SFML and SDL libraries.',
      'Engineered full-stack web applications using C#/.NET and the MERN stack for diverse client requirements.',
    ],
    sort_order: 4,
  },
];

/* -------------------------------------------------------------------------- */
/* 5. CERTIFICATIONS                                                          */
/* -------------------------------------------------------------------------- */
export const certificationsData: Certification[] = [
  {
    id: 'cert-1',
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    issued_date: '2026-09',
    expiry_date: null,
    credential_url: 'https://coursera.org',
    badge_url: null,
    sort_order: 1,
  },
  {
    id: 'cert-2',
    name: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    issued_date: '2026-04',
    expiry_date: null,
    credential_url: 'https://aws.amazon.com/training/',
    badge_url: null,
    sort_order: 2,
  },
  {
    id: 'cert-3',
    name: 'BS Computer Science',
    issuer: 'FAST-NUCES, Islamabad',
    issued_date: '2026-06',
    expiry_date: null,
    credential_url: 'https://nu.edu.pk',
    badge_url: null,
    sort_order: 3,
  },
];

/* -------------------------------------------------------------------------- */
/* 6. SKILLS & TOOLS                                                          */
/* -------------------------------------------------------------------------- */
export const skillsData: Skill[] = [
  // Offensive Security
  { id: 's1', group_name: 'Offensive Security', name: 'Penetration Testing (VAPT)', sort_order: 1 },
  { id: 's2', group_name: 'Offensive Security', name: 'Web & Network Assessment', sort_order: 2 },
  { id: 's3', group_name: 'Offensive Security', name: 'OWASP Top 10 Vulnerabilities', sort_order: 3 },
  { id: 's4', group_name: 'Offensive Security', name: 'Network Pivoting & Proxychains', sort_order: 4 },
  { id: 's5', group_name: 'Offensive Security', name: 'Access Control & Session Flaws', sort_order: 5 },
  { id: 's6', group_name: 'Offensive Security', name: 'Post-Exploitation & Reconnaissance', sort_order: 6 },

  // Security Tools
  { id: 's7', group_name: 'Security Tools', name: 'Burp Suite', sort_order: 7 },
  { id: 's8', group_name: 'Security Tools', name: 'Tenable Nessus', sort_order: 8 },
  { id: 's9', group_name: 'Security Tools', name: 'OWASP ZAP', sort_order: 9 },
  { id: 's10', group_name: 'Security Tools', name: 'Nmap & SQLMap', sort_order: 10 },
  { id: 's11', group_name: 'Security Tools', name: 'Metasploit Framework', sort_order: 11 },
  { id: 's12', group_name: 'Security Tools', name: 'Wireshark & Packet Inspection', sort_order: 12 },
  { id: 's13', group_name: 'Security Tools', name: 'Gobuster & Hydra', sort_order: 13 },
  { id: 's14', group_name: 'Security Tools', name: 'Suricata & Wazuh (NDR)', sort_order: 14 },

  // GRC & Compliance
  { id: 's15', group_name: 'GRC & Frameworks', name: 'NIST Risk Rating', sort_order: 15 },
  { id: 's16', group_name: 'GRC & Frameworks', name: 'ISO 27001 Control Mapping', sort_order: 16 },
  { id: 's17', group_name: 'GRC & Frameworks', name: 'MITRE ATT&CK Framework', sort_order: 17 },
  { id: 's18', group_name: 'GRC & Frameworks', name: 'PTES Standard', sort_order: 18 },
  { id: 's19', group_name: 'GRC & Frameworks', name: 'CIS Benchmarks', sort_order: 19 },
  { id: 's20', group_name: 'GRC & Frameworks', name: 'Audit & Remediation Reporting', sort_order: 20 },

  // Languages & Engineering
  { id: 's21', group_name: 'Dev & Systems', name: 'Python', sort_order: 21 },
  { id: 's22', group_name: 'Dev & Systems', name: 'C / C++', sort_order: 22 },
  { id: 's23', group_name: 'Dev & Systems', name: 'Bash & Linux Hardening', sort_order: 23 },
  { id: 's24', group_name: 'Dev & Systems', name: 'JavaScript & TypeScript', sort_order: 24 },
  { id: 's25', group_name: 'Dev & Systems', name: 'SQL', sort_order: 25 },
  { id: 's26', group_name: 'Dev & Systems', name: 'Go & Rust (Familiar)', sort_order: 26 },
  { id: 's27', group_name: 'Dev & Systems', name: 'Flutter & Supabase', sort_order: 27 },
  { id: 's28', group_name: 'Dev & Systems', name: 'Docker & Git', sort_order: 28 },
];
