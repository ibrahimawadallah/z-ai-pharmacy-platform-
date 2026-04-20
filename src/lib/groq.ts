import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_deployment",
});

export const getGroqService = () => {
  return {
    async generateResponse(message: string, systemPrompt: string, history: any[] = []) {
      try {
        const messages = [
          { 
            role: "system", 
            content: `${systemPrompt}\n\nALWAYS start with a medical disclaimer: 'This is AI-generated advice; consult a doctor.'` 
          },
          ...history,
          { role: "user", content: message },
        ];

        const chatCompletion = await groq.chat.completions.create({
          messages: messages as any,
          model: process.env.GROQ_MODEL || "llama3-8b-8192",
          temperature: 0.5,
          max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "";
      } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
      }
    },
  };
};
