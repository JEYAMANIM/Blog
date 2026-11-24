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
        image_url: "https://blog-un30.onrender.com/uploads/Gemini_Generated_Image_4q07yg4q07yg4q07.png",
    },
    {
        id: "138.167.234.167",
        title: "Benchmarking Retrieval Quality for RAG",
        description: "Why standard evaluation metrics undersell real-world retrieval failures.",
        image_url: "https://blog-un30.onrender.com/uploads/Gemini_Generated_Image_lmtx7flmtx7flmtx.png",
    },
    {
        id: "210.14.88.19",
        title: "What Is a Small Language Model (SLM)?",
        description: "Compact models for edge compute, reduced latency, and cost-efficient domain fine-tuning.",
        image_url: "https://blog-un30.onrender.com/uploads/Gemini_Generated_Image_aar1yxaar1yxaar1.png",
    },
    {
        id: "65.188.120.223",
        title: "Reproducible Training Pipelines by Design",
        description: "Experiment tracking and versioning practices that survived contact with production.",
        image_url: "https://blog-un30.onrender.com/uploads/Gemini_Generated_Image_vmxuqvmxuqvmxuqv.png",
    },
    {
        id: "91.1.186.195",
        title: "Autonomous Navigation for Aerial Platforms",
        description: "Perception and path-planning under real-world wind and lighting variance.",
        image_url: "https://blog-un30.onrender.com/uploads/Gemini_Generated_Image_5kmbr25kmbr25kmb.png",
    },
];
