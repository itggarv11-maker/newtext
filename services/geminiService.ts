import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { 
    QuizQuestion, Subject, ClassLevel, MathsSolution, 
    CareerRoadmap, SmartSummary, QuestionPaper, 
    GradedPaper, LabExperiment, LiteraryAnalysis,
    Analogy, RealWorldApplication, LearningPath, GameLevel,
    DebateScorecard, DebateTurn, VisualExplanationScene,
    QuizDifficulty, Flashcard, MindMapNode
} from "../types";

// Lazy-initialize the AI client to prevent top-level crashes
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
    if (!aiInstance) {
        const key = process.env.API_KEY;
        if (!key || key === "undefined") {
            throw new Error("Gemini API Key is missing. Please check your environment variables.");
        }
        aiInstance = new GoogleGenAI({ apiKey: key });
    }
    return aiInstance;
};

const MATHS_SOLVER_PROMPT = `You are STUBRO MATHS BRAHMASTRA v8.0.
ABSOLUTE PEDAGOGICAL COMMANDS:
1. THINKING CORE: Use full thinking budget to simulate math logic. ZERO ERRORS.
2. FORMATTING PURGE: NEVER use dollar signs ($) or LaTeX syntax in text. 
3. VISUAL CLARITY: Use **Bold** for Theorems/Laws and *Italics* for Variables (e.g., **Pythagoras Theorem**, *x* + *y*).
4. OUTPUT FORMAT: Return a JSON object following the schema.
5. STEP-BY-STEP: Concept -> Logic -> Result.
6. NO ALL CAPS.`;

export const solveMathsBrahmastra = async (problem: string, level: ClassLevel, imagePart?: any): Promise<MathsSolution> => {
    const ai = getAI();
    const contents = imagePart 
        ? { parts: [imagePart, { text: `Grade Level: ${level}. Problem Context/Text: ${problem}` }] }
        : `Grade Level: ${level}. Problem: ${problem}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents,
        config: {
            systemInstruction: MATHS_SOLVER_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    concept: { type: Type.STRING },
                    formula: { type: Type.STRING },
                    steps: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                action: { type: Type.STRING },
                                result: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                            required: ["action", "result", "reason"]
                        }
                    },
                    finalAnswer: { type: Type.STRING },
                    recap: { type: Type.STRING },
                    diagram_spec: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER },
                            points: { 
                                type: Type.ARRAY, 
                                items: { 
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        coords: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                                    },
                                    required: ["name", "coords"]
                                }
                            },
                            lines: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        from: { type: Type.STRING },
                                        to: { type: Type.STRING },
                                        label: { type: Type.STRING },
                                        dashed: { type: Type.BOOLEAN }
                                    },
                                    required: ["from", "to"]
                                }
                            }
                        },
                        required: ["type", "width", "height", "points", "lines"]
                    }
                },
                required: ["concept", "steps", "finalAnswer", "recap"]
            },
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    
    try {
        const data = JSON.parse(response.text || "{}");
        let normalizedPoints: Record<string, [number, number]> = {};
        if (data.diagram_spec && Array.isArray(data.diagram_spec.points)) {
            data.diagram_spec.points.forEach((p: any) => {
                if (p.name && Array.isArray(p.coords)) {
                    normalizedPoints[p.name] = [p.coords[0], p.coords[1]];
                }
            });
        }
        return {
            ...data,
            diagram_spec: data.diagram_spec ? { ...data.diagram_spec, points: normalizedPoints } : undefined
        };
    } catch (e) {
        return { concept: "Processing Error", formula: "", steps: [], finalAnswer: "System error.", recap: "" };
    }
};

export const startMathDoubtChat = (solutionContext: MathsSolution): Chat => {
    const ai = getAI();
    const instruction = `You are the STUBRO DOUBT SOLVER. 
    You have access to the solution: ${JSON.stringify(solutionContext)}.
    RULES:
    1. NO DOLLAR SIGNS: Never use $ signs.
    2. MARKDOWN ONLY: Use **Bold** and *Italics* for emphasis.
    3. PATIENT: Use real-world analogies.`;
    
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: instruction }
    });
};

export const generateSmartSummary = async (subject: Subject, classLevel: ClassLevel, sourceText: string): Promise<SmartSummary> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Subject: ${subject}. Level: ${classLevel}. Context: ${sourceText}`,
        config: { 
            systemInstruction: "Create a summary. NO DOLLAR SIGNS. Use **Bold** for terms and *Italics* for variables.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    coreConcepts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } } } },
                    visualAnalogy: { type: Type.OBJECT, properties: { analogy: { type: Type.STRING }, explanation: { type: Type.STRING } } },
                    examSpotlight: { type: Type.ARRAY, items: { type: Type.STRING } },
                    stuBroTip: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const generateQuiz = async (subject: Subject, classLevel: ClassLevel, sourceText: string, num: number = 5, difficulty: QuizDifficulty = 'Medium', typeFilter: 'mcq' | 'written' | 'both' = 'both'): Promise<QuizQuestion[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate ${num} questions. NO DOLLAR SIGNS. Use **Bold** and *Italics* for math/science notation. Context: ${sourceText}`,
        config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(response.text || '{"questions":[]}');
    return data.questions || [];
};

export const fetchYouTubeTranscript = async (url: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze media link: ${url}. Perform deep transcription.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
};

export const fetchChapterContent = async (level: ClassLevel, subject: Subject, chapter: string, details: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `NCERT content for ${level} ${subject}, Chapter: ${chapter}. ${details}`,
        config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
};

export const createChatSession = (subject: Subject, level: ClassLevel, context: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: `Expert ${subject} tutor for ${level}. NO DOLLAR SIGNS allowed. Use **Bold** for terms.` }
    });
};

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create flashcards: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const generateMindMapFromText = async (text: string, level: ClassLevel): Promise<MindMapNode> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Mind map node structure for ${level}: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const sendMessageStream = async (chat: Chat, message: string) => chat.sendMessageStream({ message });

export const generateQuestionPaper = async (text: string, num: number, type: string, diff: string, marks: number, subject: any): Promise<QuestionPaper> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate board paper. NO DOLLAR SIGNS. Content: ${text}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const gradeAnswerSheet = async (paper: string, images: any[]): Promise<GradedPaper> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [...images, { text: `Grade student sheet for: ${paper}. NO DOLLAR SIGNS in feedback.` }] },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateVivaQuestions = async (topic: string, level: string, num: number): Promise<string[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate exactly ${num} viva questions on the topic: ${topic} for students in ${level}. RULES: Return ONLY a JSON array of strings. NEVER return objects. NO DOLLAR SIGNS.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
    try {
        const questions = JSON.parse(response.text || "[]");
        return questions.map((q: any) => typeof q === 'string' ? q : JSON.stringify(q));
    } catch (e) {
        return ["Failed to generate questions. Reset session."];
    }
};

export const evaluateVivaAudioAnswer = async (q: string, audioPart: any) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [audioPart, { text: `Evaluate viva answer for: ${q}. NO DOLLAR SIGNS.` }] },
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcription: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    marksAwarded: { type: Type.NUMBER }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

export const evaluateVivaTextAnswer = async (q: string, text: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate: ${text} for ${q}. NO DOLLAR SIGNS.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feedback: { type: Type.STRING },
                    marksAwarded: { type: Type.NUMBER }
                }
            }
        }
    });
    return { ...JSON.parse(response.text || "{}"), transcription: text };
};

export const createLiveDoubtsSession = (topic: string, level: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: `Tutor for ${topic}, grade ${level}. NO DOLLAR SIGNS allowed.` }
    });
};

export const sendAudioForTranscriptionAndResponse = async (chat: Chat, audioPart: any) => {
    const response = await chat.sendMessage({ message: [audioPart, { text: "Answer doubt. NO DOLLAR SIGNS." }] });
    return { transcription: "Audio processed.", response: response.text || "" };
};

export const breakdownTextIntoTopics = async (text: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Break content into topics: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const generateScenesForTopic = async (content: string, lang: string, level: string): Promise<VisualExplanationScene[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create narrated scenes for: ${content}. NO DOLLAR SIGNS in narration.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const generateFullChapterSummaryVideo = async (text: string, lang: string, level: string): Promise<VisualExplanationScene[]> => {
    return generateScenesForTopic(`Summary: ${text}`, lang, level);
};

export const generateDebateTopics = async (text: string): Promise<string[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `3 debate topics: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const startDebateSession = (topic: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: `Debate me on: ${topic}. NO DOLLAR SIGNS allowed.` }
    });
};

export const sendDebateArgument = async (chat: Chat, arg: string) => {
    const res = await chat.sendMessage({ message: arg + " (Reminder: No dollar signs)" });
    return res.text || "";
};

export const getDebateResponseToAudio = async (chat: Chat, audioPart: any) => {
    const res = await chat.sendMessage({ message: [audioPart, { text: "Rebut my argument. NO DOLLAR SIGNS." }] });
    return { transcription: "Audio received.", rebuttal: res.text || "" };
};

export const evaluateDebate = async (history: DebateTurn[]): Promise<DebateScorecard> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Evaluate debate history: ${JSON.stringify(history)}. NO DOLLAR SIGNS in feedback.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateGameLevel = async (text: string): Promise<GameLevel> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Educational RPG level for: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateLabExperiment = async (sub: Subject, topic: string, safety: string): Promise<LabExperiment> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Lab experiment for ${sub}. Topic: ${topic}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const createHistoricalChatSession = (figure: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: `You are ${figure}. NO DOLLAR SIGNS allowed.` }
    });
};

export const analyzeLiteraryText = async (text: string): Promise<LiteraryAnalysis> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Deep analysis of: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateAnalogies = async (concept: string): Promise<Analogy[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 analogies for: ${concept}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const createDilemmaChatSession = (topic: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: `Construct dilemmas about: ${topic}. NO DOLLAR SIGNS.` }
    });
};

export const exploreWhatIfHistory = async (scenario: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze alternative timeline: ${scenario}. NO DOLLAR SIGNS.`
    });
    return response.text || "";
};

export const predictExamPaper = async (text: string, diff: string, marks: number, sub: any): Promise<QuestionPaper> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Predict questions for: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const findRealWorldApplications = async (concept: string): Promise<RealWorldApplication[]> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Real world use-cases for: ${concept}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const generateLearningPath = async (topic: string, sub: Subject, level: string, quizResults: any): Promise<LearningPath> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Personalized path for: ${topic}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateSimulationExperiment = async (text: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Simulation design from: ${text}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateCareerDivination = async (data: any): Promise<CareerRoadmap> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Career path for: ${JSON.stringify(data)}. NO DOLLAR SIGNS.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};