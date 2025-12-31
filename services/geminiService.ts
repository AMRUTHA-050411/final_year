import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Question } from "../types";

// Always initialize with direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBuddySuggestions = async (currentUser: UserProfile, directory: UserProfile[]) => {
  const model = "gemini-3-flash-preview";
  
  const directoryData = directory.filter(u => u.id !== currentUser.id).map(u => ({
    id: u.id,
    name: u.name,
    department: u.department,
    gradeOrClass: u.gradeOrClass,
    courses: u.enrolledCourses,
    skills: u.skills,
    interests: u.interests
  }));

  const prompt = `
    As an AI matching assistant for an LMS Buddy System, analyze the current user's profile and recommend the top 3 study buddies from the directory.
    
    Current User:
    - Name: ${currentUser.name}
    - Department: ${currentUser.department}
    - Grade/Class: ${currentUser.gradeOrClass}
    - Courses: ${currentUser.enrolledCourses.join(', ')}
    - Skills: ${currentUser.skills.join(', ')}
    - Interests: ${currentUser.interests.join(', ')}
    
    Directory:
    ${JSON.stringify(directoryData)}
    
    Provide the response as JSON with the recommended user IDs and a brief "matchReason" for each.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              userId: { type: Type.STRING },
              matchReason: { type: Type.STRING }
            },
            required: ["userId", "matchReason"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};

export const getStudySummary = async (messages: string[]) => {
    if (messages.length === 0) return "No messages to summarize.";
    
    const model = "gemini-3-flash-preview";
    const prompt = `Summarize the following study discussion between two students. Identify key concepts discussed and any outstanding questions: \n\n${messages.join('\n')}`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text || "Failed to generate summary.";
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Failed to generate summary.";
    }
};

export const generateMCQAssignment = async (subject: string, complexity: string, count: number) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a high-quality, unique MCQ quiz for a student.
    Subject: ${subject}
    Complexity Level: ${complexity}
    Number of Questions: ${count}
    
    The quiz must contain exactly ${count} unique questions. 
    CRITICAL: Ensure that every question covers a different aspect or sub-topic of the subject to avoid redundancy.
    Each question must have exactly 4 plausible options and one clearly correct answer index (0-3).
    The distractors (wrong options) should be challenging and conceptually relevant.
    
    Return the response strictly as a JSON object with this structure:
    {
      "title": "A descriptive title for the quiz",
      "subject": "${subject}",
      "questions": [
        {
          "text": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.NUMBER }
                },
                required: ["text", "options", "correctAnswer"]
              }
            }
          },
          required: ["title", "subject", "questions"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    throw error;
  }
};

export const getAcademicRiskAssessment = async (data: {
  name: string;
  studentId?: string;
  attendance: number;
  assignmentScore: number;
  internalsScore: number;
  extraActivitiesScore: number;
  previousGPA: number;
}) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze this student's academic performance data:
    - Name: ${data.name}
    - Attendance: ${data.attendance}%
    - Assignments: ${data.assignmentScore}/100
    - Internals: ${data.internalsScore}/100
    - Extra Activities: ${data.extraActivitiesScore}/10
    - Previous GPA: ${data.previousGPA}/10

    Your persona: AI-powered Academic Risk Predictor Assistant. 
    Evaluate academic performance risk based ONLY on these inputs.
    Additionally, calculate a "dropoutProbability" as a percentage (0-100) based on low attendance, poor internals, and low GPA.

    Return JSON format only.

    {
      "studentName": "${data.name}",
      "riskLevel": "Low | Moderate | High",
      "dropoutProbability": number,
      "factors": ["Factor 1", "Factor 2"],
      "recommendations": ["Rec 1", "Rec 2"],
      "reviewIntervalDays": number
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentName: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            dropoutProbability: { type: Type.NUMBER },
            factors: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            reviewIntervalDays: { type: Type.NUMBER }
          },
          required: ["studentName", "riskLevel", "dropoutProbability", "factors", "recommendations", "reviewIntervalDays"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Risk Assessment Error:", error);
    throw error;
  }
};