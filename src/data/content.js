import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';

export const content = {
    hero: {
        title: "EUPH",
        subtitle: "今夜 あの空で合流して",
        description: "朝が満たすまで それぞれの星を探そう",
        logoAlt: "Logo"
    },
    about: {
        heading: "About Me",
        bio1: "I'm a passionate developer who loves to build immersive digital experiences. My journey started with a curiosity for how things work on the web, and it has evolved into a career of crafting high-performance applications.",
        bio2: "When I'm not coding, you can find me exploring new technologies, contributing to open source, or gaming.",
        skillsHeading: "Skills",
        skillsDescription: "I specialize in the modern JavaScript stack, with a focus on React, Node.js, and Three.js. I believe in writing clean, maintainable code and designing interfaces that are intuitive and accessible.",
        skills: ['React / Next.js', 'TypeScript', 'Three.js / R3F', 'Node.js', 'Tailwind / CSS', 'PostgreSQL']
    },
    projects: {
        heading: "Selected Works",
        list: [
            {
                id: 1,
                title: "Nebula Dashboard",
                category: "Data Visualization"
            },
            {
                id: 2,
                title: "Quantum E-Commerce",
                category: "Web Application"
            },
            {
                id: 3,
                title: "Stellar Portfolio",
                category: "Creative Design"
            },
            {
                id: 4,
                title: "Void Chat",
                category: "Real-time Communication"
            }
        ]
    },
    social: {
        heading: "Get in Touch",
        links: [
            { icon: Github, href: 'https://github.com', label: 'GitHub' },
            { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
            { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
            { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
            { icon: Globe, href: 'https://example.com', label: 'Website' },
        ]
    }
};
