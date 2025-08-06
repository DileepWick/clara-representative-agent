import {
  Gemini_model,
  generationConfigurations,
} from "../models/gemini_model.js";
import extractJsonFromText from "../util/jsonParsor.js";

import { SendSummaryToMake } from "./make_webhook.js";
import { SendObjection } from "./objection_webhook.js";
import { saveOrUpdateRecruiterInterest , getFollowupStatus} from "../util/recruiterInterestController.js";
import dotenv from "dotenv";
dotenv.config();


const systemPrompt = process.env.GeminiPrompt;
const model = Gemini_model;
const generationConfig = generationConfigurations;

// Utility to update conversation summary dynamically
async function updateSummary({
  summary,
  latestUserMessage,
  latestAIResponse,
  sessionId,
  userName,
  email,
}) {
  try {
    const prompt = systemPrompt;

    const followUpStatus = await getFollowupStatus(sessionId);

    // Use a safe generation function to handle potential overloads
    async function safeGenerateContent(
      model,
      prompt,
      generationConfig,
      retries = 3,
      delay = 1000
    ) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
          });
          return result; // ✅ success
        } catch (err) {
          if (err.status === 503 && attempt < retries - 1) {
            console.warn(
              `⚠️ Gemini model overloaded. Retrying in ${delay}ms... (Attempt ${
                attempt + 1
              }/${retries})`
            );
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2; // exponential backoff
          } else {
            console.error("❌ Gemini generation failed:", err);
            throw err; // rethrow if final attempt or different error
          }
        }
      }
    }

    // Generate content using the model
    const result = await safeGenerateContent(model, prompt, generationConfig);

    //Convert the response to JSON object
    const JsonObject = extractJsonFromText(result.response.text());


    //update the recruiter interest information in the database
    const recruiterData = {
      sessionId: sessionId,
      engagementPercentage: JsonObject.engagementPercentage,
      summary: JsonObject.summary,
      objections: JsonObject.objections,
      userName: userName,
      email: email,
    };

    // Save or update the recruiter interest information
    const saveResultOuter = await saveOrUpdateRecruiterInterest(recruiterData);

    if (saveResultOuter.success) {
     
      if (
        saveResultOuter.data.engagementPercentage >= 25 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.casualEngagementFollowupSent === false
      ) {
        console.log("Casual Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          casualEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          console.log("Followup Sent successfully ✅");
          //Send summary to Make
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }if (
        saveResultOuter.data.engagementPercentage >= 50 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.activeEngagementFollowupSent === false
      ) {
        console.log("Active Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          activeEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }if (
        saveResultOuter.data.engagementPercentage >= 75 &&
        saveResultOuter.data.engagementPercentage < 100 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.deepEngagementFollowupSent === false
      ) {
        console.log("Deep Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          deepEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }
    } 

    //Send objections if has
    // if(recruiterData.objections !== null){
    //   console.log("Reason No Match:", recruiterData.objections);
    //   SendObjection(recruiterData.objections,recruiterData.summary);
    // }

    return JsonObject;

  } catch (error) {
    console.error("Summary Update Error:", error);
    return summary; // fallback to previous summary
  }
}

// Export the updateSummary function for use in other modules
export { updateSummary };
