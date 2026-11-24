export interface Blog {
    id: string;
    title: string;
    description: string;
    image_url: string;
}

export const INITIAL_BLOGS: Blog[] = [
    {
        id: "102.24.125.132",
        title: "On-Chain Provenance for Model Weights",
        description: "Auditable, tamper-evident tracking for models deployed in regulated environments.",
        image_url: "/uploads/Gemini_Generated_Image_4q07yg4q07yg4q07.png",
    },
    {
        id: "138.167.234.167",
        title: "Benchmarking Retrieval Quality for RAG",
        description: "Why standard evaluation metrics undersell real-world retrieval failures.",
        image_url: "/uploads/Gemini_Generated_Image_iau3r6iau3r6iau3.png",
    },
    {
        id: "142.17.78.196",
        title: "Fine-Tuning Domain-Specific LLMs",
        description: "Instruction tuning strategies for regulated industries with limited labeled data.",
        image_url: "/uploads/Gemini_Generated_Image_lmtx7flmtx7flmtx.png",
    },
    {
        id: "148.229.59.148",
        title: "What Is a Small Language Model (SLM)?",
        description: "Compact models for edge compute, reduced latency, and cost-efficient domain fine-tuning.",
        image_url: "/uploads/Gemini_Generated_Image_aar1yxaar1yxaar1.png",
    },
    {
        id: "61.27.116.103",
        title: "Why Agentic AI Is the Future of SaaS (And What It Means for Your Roadmap)",
        description: "Agentic AI is changing SaaS from software people operate into software that plans, decides, and executes work.",
        image_url: "/uploads/Gemini_Generated_Image_aar1yxaar1yxaar1.png",
    },
    {
        id: "65.188.120.223",
        title: "Reproducible Training Pipelines by Design",
        description: "Experiment tracking and versioning practices that survived contact with production.",
        image_url: "/uploads/Gemini_Generated_Image_vmxuqvmxuqvmxuqv.png",
    },
    {
        id: "91.1.186.195",
        title: "Autonomous Navigation for Aerial Platforms",
        description: "Perception and path-planning under real-world wind and lighting variance.",
        image_url: "/uploads/Gemini_Generated_Image_5kmbr25kmbr25kmb.png",
    },
];
