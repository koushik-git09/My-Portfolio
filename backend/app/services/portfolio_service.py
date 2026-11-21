import logging
from typing import Any, Dict
from app.core.database import (
    ensure_mongo_connected,
    get_portfolio_collection,
    is_database_connected,
)
from app.schemas.portfolio import PortfolioResponse, ProfileSchema

logger = logging.getLogger("uvicorn.error")

FALLBACK_PORTFOLIO_DATA: Dict[str, Any] = {
    "profile": {
        "initials": "KG",
        "displayName": "Ediga Laxmi Koushik Goud",
        "shortLabel": "B.Tech CSE (AI & ML) · AI/ML & Full-Stack Developer",
        "email": "koushikgoud912@gmail.com",
        "githubHandle": "koushik-git09",
        "linkedinHandle": "koushik-goud-33ba18325",
        "linkedinUrl": "https://www.linkedin.com/in/koushik-goud-33ba18325",
        "location": "Madurai / Hyderabad, India",
        "availability": "Available for AI/ML & Software Engineering Internships",
        "heroHeadline": "Applying Technology to Solve Real-World Problems.",
        "heroSupport": "I'm a 3rd-year B.Tech CSE (AI & ML) student passionate about applying technology to real-world problems. I continuously enhance my skills in programming, problem-solving, and innovation through internships, open-source, and industry learning.",
        "animatedRoles": [
            "AI & Machine Learning Developer",
            "Computer Vision Specialist",
            "Full-Stack Web Developer",
            "B.Tech CSE (AI & ML) Student",
        ],
        "portraitImage": "/src/assets/images/koushik_goud_portrait.jpg",
        "resumeUrl": "/Ediga_Laxmi_Koushik_Goud_Resume.pdf",
    },
    "about": {
        "introduction": "I'm a 3rd-year B.Tech Computer Science and Engineering (AI & ML) student at Kalasalingam Academy of Research and Education. Passionate about applying technology to real-world problems, I continuously enhance my skills in programming, problem-solving, and innovation.",
        "interests": "My work spans artificial intelligence, machine learning, computer vision, and modern full-stack web development. From engineering an AI-powered sign language learning platform at Infosys Springboard to building centralized web systems like BloodBridge and Smart AI job Matching System, I strive to design dependable, high-impact technology.",
        "technicalFocus": "Currently focused on computer vision systems with MediaPipe and OpenCV, deep learning model architectures, Python/FastAPI backend services, and interactive React applications.",
        "careerVision": "Actively participating in technical competitions and hackathons, seeking continuous growth through engineering internships, open-source contributions, and collaborative industry learning.",
    },
    "skills": [
        {
            "id": "languages",
            "title": "Programming Languages",
            "subtitle": "Core systems & development languages",
            "iconName": "code",
            "technologies": [
                {"name": "Python", "context": "AI/ML, Research & Scripting"},
                {"name": "Java", "context": "Object-Oriented Programming"},
                {"name": "C", "context": "Systems & Algorithms"},
                {"name": "SQL", "context": "Relational Database Queries"},
            ],
        },
        {
            "id": "web",
            "title": "Web Development",
            "subtitle": "Frontend, backend & API architectures",
            "iconName": "layout",
            "technologies": [
                {"name": "JavaScript", "context": "Frontend Logic & Scripting"},
                {"name": "React.js", "context": "Interactive Component UI"},
                {"name": "Vite", "context": "Modern Frontend Tooling"},
                {"name": "Node.js", "context": "Backend Runtime"},
                {"name": "FastAPI", "context": "High-Performance Python APIs"},
                {"name": "REST APIs", "context": "API Architecture & Endpoints"},
            ],
        },
        {
            "id": "databases",
            "title": "Databases",
            "subtitle": "Document, relational & cloud storage",
            "iconName": "database",
            "technologies": [
                {"name": "MongoDB", "context": "NoSQL Document Store"},
                {"name": "PostgreSQL", "context": "Relational Database Management"},
                {"name": "Firebase", "context": "Realtime Cloud Database"},
            ],
        },
        {
            "id": "tools",
            "title": "Developer Tools",
            "subtitle": "Version control, IDEs & workflows",
            "iconName": "terminal",
            "technologies": [
                {"name": "Git", "context": "Distributed Version Control"},
                {"name": "GitHub", "context": "Collaboration & Repositories"},
                {"name": "VS Code", "context": "Primary Development Environment"},
                {"name": "Postman", "context": "API Testing & Inspection"},
                {"name": "Antigravity", "context": "Agentic Development Platform"},
                {"name": "Colab", "context": "Cloud GPU Computing & Notebooks"},
            ],
        },
        {
            "id": "aiml",
            "title": "AI/ML and Computer Vision",
            "subtitle": "Machine learning, neural networks & perception",
            "iconName": "brain",
            "technologies": [
                {"name": "Machine Learning", "context": "Supervised & Unsupervised Learning"},
                {"name": "Deep Learning", "context": "Neural Network Architectures"},
                {"name": "Computer Vision", "context": "Visual Recognition & Processing"},
                {"name": "MediaPipe", "context": "Real-Time Hand Landmark Extraction"},
                {"name": "OpenCV", "context": "Image & Video Analysis"},
                {"name": "Scikit-learn", "context": "Classical ML Algorithms"},
                {"name": "XGBoost", "context": "Gradient Boosted Decision Trees"},
                {"name": "TensorFlow / Keras", "context": "Deep Learning Model Development"},
            ],
        },
        {
            "id": "core_cs",
            "title": "Core Computer Science",
            "subtitle": "Algorithmic thinking & computing foundations",
            "iconName": "layers",
            "technologies": [
                {"name": "Data Structures & Algorithms", "context": "Problem Solving & Optimization"},
                {"name": "Object-Oriented Programming", "context": "Software Engineering Principles"},
                {"name": "DBMS", "context": "Database Management Systems"},
                {"name": "Operating Systems", "context": "Process, Memory & Concurrency"},
                {"name": "Computer Networks", "context": "Protocols & Network Architecture"},
            ],
        },
    ],
    "experience": [
        {
            "id": "exp-1",
            "organization": "Infosys Springboard",
            "position": "AI/ML Intern",
            "duration": "Internship",
            "location": "Virtual / Remote",
            "description": "Developed an AI-powered Sign Language Learning and Assessment Platform using computer vision and machine learning to recognize hand gestures and assess learner performance.",
            "technologies": ["Python", "Computer Vision", "MediaPipe", "OpenCV", "Scikit-learn", "Machine Learning"],
            "contributions": [
                "Developed an AI-powered Sign Language Learning and Assessment Platform using computer vision and machine learning to recognize hand gestures and assess learner performance.",
                "Implemented hand-landmark extraction and ML-based sign classification, contributing to the project’s selection for the Final Jury Presentation.",
            ],
        },
        {
            "id": "exp-2",
            "organization": "CODING BLOCKS KARE STUDENT CHAPTER",
            "position": "Treasurer",
            "duration": "Leadership Role",
            "location": "Kalasalingam Academy of Research and Education",
            "description": "Served as Treasurer of Coding Blocks, managing the club’s financial records, budgeting, and expense tracking for technical events and activities.",
            "technologies": ["Budgeting", "Financial Tracking", "Team Coordination", "Event Planning"],
            "contributions": [
                "Served as Treasurer of Coding Blocks, managing the club’s financial records, budgeting, and expense tracking for technical events and activities.",
                "Coordinated with the organizing team to plan event budgets, allocate resources, and ensure transparent and efficient utilization of funds.",
            ],
        },
    ],
    "projects": [
        {
            "id": "proj-bloodbridge",
            "tier": "featured",
            "name": "BloodBridge — Emergency Blood Bank & Donor Matching System",
            "kicker": "Healthcare Platform · Emergency Donor Matching",
            "tagline": "Emergency matching platform connecting blood donors with patients and hospitals based on blood-group requirements with real-time availability tracking.",
            "description": "Developed a blood donation and emergency matching platform connecting blood donors with patients and hospitals based on blood-group requirements. Designed features for donor registration, blood requests, and availability tracking to facilitate faster access to required blood during critical emergencies.",
            "image": "/src/assets/images/project_knowledge_graph_1794800617923.jpg",
            "technologies": ["React.js", "FastAPI", "Python", "MongoDB", "REST APIs"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "Full-stack architecture featuring Python FastAPI backend services, donor-patient matching workflows, secure registration, and real-time blood group availability tracking.",
            "highlights": [
                "Connected blood donors directly with patients and hospitals according to blood-group criteria.",
                "Designed responsive donor registration and structured emergency blood request pipelines.",
                "Engineered high-performance Python FastAPI backend services with MongoDB persistence.",
            ],
            "metrics": [{"label": "Domain", "value": "Healthcare"}, {"label": "Matching", "value": "Blood Group"}, {"label": "Platform", "value": "FastAPI + React"}],
        },
        {
            "id": "proj-sign-language",
            "tier": "medium",
            "name": "AI Sign Language Learning & Assessment Platform",
            "kicker": "Infosys Springboard · Computer Vision & ML",
            "tagline": "Real-time sign language recognition and assessment platform using computer vision and MediaPipe hand-landmark extraction.",
            "description": "Developed an AI-powered Sign Language Learning and Assessment Platform using computer vision and machine learning to recognize hand gestures and assess learner performance. Implemented hand-landmark extraction and ML-based sign classification, contributing to the project’s selection for the Final Jury Presentation at Infosys Springboard.",
            "image": "/src/assets/images/project_neural_orchestrator_1794800617726.jpg",
            "technologies": ["Python", "MediaPipe", "OpenCV", "Scikit-learn", "Machine Learning"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "Real-time hand-landmark extraction pipeline coupled with machine learning classifiers for precise sign gesture assessment.",
            "highlights": [
                "Implemented real-time hand gesture tracking and landmark coordinate extraction using MediaPipe and OpenCV.",
                "Engineered ML-based sign classification for accurate learner performance scoring.",
                "Selected for the prestigious Infosys Springboard Final Jury Presentation.",
            ],
            "metrics": [{"label": "Domain", "value": "Computer Vision"}, {"label": "Recognition", "value": "Hand Gestures"}, {"label": "Selection", "value": "Final Jury"}],
        },
        {
            "id": "proj-anjana-connects",
            "tier": "medium",
            "name": "Anjana Connects — Staff & Payroll Management System",
            "kicker": "Staff Management · Facial Recognition Attendance",
            "tagline": "Staff management system enabling business owners to automate attendance tracking and salary payrolls using facial recognition.",
            "description": "A streamlined staff management system where business owners can easily manage employee attendance, track working hours, and calculate salary payrolls. Features an integrated facial recognition attendance system for touchless, tamper-proof check-ins.",
            "image": "/src/assets/images/project_synthetic_audio_1794800619471.jpg",
            "technologies": ["Python", "OpenCV", "Face Recognition", "React.js", "FastAPI", "MongoDB"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "Computer vision facial verification pipeline integrated with attendance records and automated salary payroll calculation.",
            "highlights": [
                "Facial recognition attendance system ensuring seamless, authentic clock-in/clock-out.",
                "Automated payroll generation calculating salaries based on validated attendance records.",
                "Centralized management dashboard for business owners to oversee operations.",
            ],
            "metrics": [{"label": "Domain", "value": "Staff Management"}, {"label": "Security", "value": "Facial Attendance"}, {"label": "Platform", "value": "FastAPI + React"}],
        },
        {
            "id": "proj-court-judgement-ai",
            "tier": "compact",
            "name": "Court Judgement AI — Legal Document Intelligence",
            "kicker": "GovTech & Legal AI · Document Intelligence",
            "tagline": "AI legal intelligence platform analyzing government law documents and generating actionable departmental execution plans.",
            "description": "An AI-powered legal document intelligence platform where government officials can upload judicial and law documents. The system analyzes the legal text, extracts key mandates, and automatically generates structured action plans for officials to execute within their respective departments.",
            "image": "",
            "technologies": ["Python", "NLP", "Document Intelligence", "FastAPI", "React.js"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "Natural language processing pipeline extracting statutory directives and converting complex legal verdicts into actionable steps.",
            "highlights": [
                "Automated ingestion and deep semantic analysis of government law documents.",
                "Department-specific plan generation enabling timely administrative action.",
                "Synthesized summaries highlighting legal compliance requirements and deadlines.",
            ],
            "metrics": [{"label": "Domain", "value": "Legal AI / GovTech"}, {"label": "Engine", "value": "NLP Analysis"}],
        },
        {
            "id": "proj-smart-ai-job-matching",
            "tier": "compact",
            "name": "Smart AI Job Matching System",
            "kicker": "AI Platform · Intelligent Recruitment & Skill Gap Analysis",
            "tagline": "Intelligent career and recruitment platform that analyzes candidate skills to recommend ideal jobs, identifies skill gaps for improvement, and empowers recruiters to find top-matching talent.",
            "description": "An AI-driven recruitment and skill analysis platform. Candidates can evaluate their profile, discover job opportunities matching their actual competencies, and receive actionable insights on skills to develop. Concurrently, recruiters can streamline talent acquisition by identifying and connecting with top-matching candidates based on granular profile analytics.",
            "image": "/src/assets/images/project_vision_spatial_1794800617789.jpg",
            "technologies": ["React.js", "FastAPI", "Python", "Machine Learning", "NLP", "MongoDB"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "AI-powered profile evaluation engine paired with dual candidate and recruiter dashboards for intelligent job-candidate matching.",
            "highlights": [
                "Comprehensive candidate skill analysis with targeted recommendations for skill improvement.",
                "Profile-based matching algorithm connecting candidates to relevant job openings.",
                "Recruiter portal with advanced talent discovery and candidate ranking filters.",
            ],
            "metrics": [{"label": "Domain", "value": "AI Recruitment"}, {"label": "Analytics", "value": "Skill Gap Engine"}],
        },
        {
            "id": "proj-mern-thinkboard",
            "tier": "compact",
            "name": "MERN ThinkBoard — Full-Stack Notepad",
            "kicker": "Full-Stack Web · First Engineering Project",
            "tagline": "My first full-stack web project: an intuitive, responsive notepad built with excitement to master the MERN stack.",
            "description": "My foundational engineering project—a clean, responsive full-stack notepad application built from scratch to explore web development. Features note creation, categorization, persistent cloud storage, and responsive UI design.",
            "image": "",
            "technologies": ["MongoDB", "Express.js", "React.js", "Node.js"],
            "githubUrl": "https://github.com/koushik-git09",
            "liveUrl": "#contact",
            "architectureNote": "RESTful MERN architecture providing CRUD note management, responsive state handling, and persistent MongoDB storage.",
            "highlights": [
                "Engineered complete CRUD operations across frontend and backend services.",
                "Designed a distraction-free notepad interface for quick ideation and note-taking.",
                "Milestone project marking the beginning of full-stack software development journey.",
            ],
            "metrics": [{"label": "Stack", "value": "MERN Stack"}, {"label": "Milestone", "value": "1st Project"}],
        },
    ],
    "achievements": [
        {
            "id": "ach-1",
            "category": "Competition",
            "title": "1st Place — TechnoMasters Project Expo",
            "issuer": "Euphoria College Event",
            "year": "2026 – 2027",
            "summary": "Secured 1st place in the TechnoMasters project expo at the Euphoria college event for presenting an innovative technical project.",
            "credentialCode": "TECHNO-1ST-EUPHORIA",
            "certificateNote": "1st Place recognition awarded at Euphoria for exceptional technical innovation and presentation.",
        },
        {
            "id": "ach-2",
            "category": "Competition",
            "title": "Final Jury Presentation Selection",
            "issuer": "Infosys Springboard",
            "year": "2026 – 2027",
            "summary": "Project selected for the Final Jury Presentation at Infosys Springboard for developing an AI-powered Sign Language Learning and Assessment Platform.",
            "credentialCode": "INFOSYS-FINAL-JURY",
            "certificateNote": "Selected for Final Jury Presentation for outstanding computer vision and machine learning engineering.",
        },
        {
            "id": "ach-3",
            "category": "Competition",
            "title": "1st Place — Puzzle Mystique Aptitude Competition",
            "issuer": "College Intra-Curricular Activities",
            "year": "2024 – 2025",
            "summary": "Secured 1st place in Puzzle Mystique, an aptitude and analytical problem-solving competition held as part of college intra-curricular activities.",
            "credentialCode": "PUZZLEMYSTIQUE-1ST",
            "certificateNote": "1st Place award for excellence in logical reasoning, quantitative analysis, and analytical problem-solving.",
        },
    ],
    "education": [
        {
            "id": "edu-1",
            "degree": "B.Tech in Computer Science & Engineering (AI & ML)",
            "institution": "Kalasalingam Academy of Research and Education",
            "specialization": "Artificial Intelligence & Machine Learning Specialization",
            "duration": "2024 – 2028",
            "standing": "9.13 CGPA · Top Academic Standing",
            "coursework": [
                "Machine Learning & Deep Learning",
                "Computer Vision",
                "Data Structures & Algorithms",
                "Object-Oriented Programming",
                "Database Management Systems (DBMS)",
                "Operating Systems & Computer Networks",
            ],
        },
        {
            "id": "edu-2",
            "degree": "Intermediate (MPC)",
            "institution": "Narayana Junior College",
            "specialization": "Mathematics, Physics & Chemistry",
            "duration": "2022 – 2024",
            "standing": "98.4% · Merit Distinction",
            "coursework": [
                "Mathematics (Calculus & Algebra)",
                "Physics",
                "Chemistry",
            ],
        },
    ],
}


class PortfolioService:
    @staticmethod
    async def get_portfolio_data() -> PortfolioResponse:
        """Retrieves portfolio from MongoDB when connected, or falls back to local data."""
        await ensure_mongo_connected()
        if is_database_connected():
            collection = get_portfolio_collection()
            if collection is not None:
                try:
                    doc = await collection.find_one({}, {"_id": 0})
                    if doc and "profile" in doc:
                        logger.info("Serving portfolio content from MongoDB Atlas")
                        return PortfolioResponse(**doc, source="mongodb")
                except Exception as exc:
                    logger.error(f"Error reading portfolio from MongoDB: {exc}")

        return PortfolioResponse(
            profile=ProfileSchema(**FALLBACK_PORTFOLIO_DATA["profile"]),
            about=FALLBACK_PORTFOLIO_DATA["about"],
            skills=FALLBACK_PORTFOLIO_DATA["skills"],
            experience=FALLBACK_PORTFOLIO_DATA["experience"],
            projects=FALLBACK_PORTFOLIO_DATA["projects"],
            achievements=FALLBACK_PORTFOLIO_DATA["achievements"],
            education=FALLBACK_PORTFOLIO_DATA["education"],
            source="local_fallback",
        )


portfolio_service = PortfolioService()
