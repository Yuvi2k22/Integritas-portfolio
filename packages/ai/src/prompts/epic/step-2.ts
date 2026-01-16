import { generateEpicSummary } from './common';

export function getRefercenceAppFlowPrompt(
  epicName: string = '',
  epicDescription: string = '',
  epicReason: string = ''
) {
  const summary = generateEpicSummary(epicName, epicDescription, epicReason);

  return `I am developing a new tool within my web application, and I need help documenting its features and user flows. To begin, I will provide a series of screenshots or images that represent different parts of the application. Your task is to carefully analyze each image and provide the following:

  Detailed Breakdown (Per Image):

  Explain the purpose of each screen or section.

  Identify any specific features, actions, or user interactions present in the image.

   When describing user actions for each screenshot, only reference actions available on that specific screen, not in previous screens.

  Full User Flow (From Start to Finish):

  Based on the sequence of images, outline the end-to-end user journey.

  Describe how users navigate from one step to another.

  Explain the goals users can achieve using this tool (e.g., create something, manage data, run analytics).

  Please ensure each image's analysis is clearly separated and labeled (e.g., "Image 1," "Image 2," etc.), followed by a consolidated user flow summary at the end.Furthermore, ensure that the screenshots in the '<screenshot_analysis>' section appear in the exact sequence as provided in the input.
    ### FINAL OUTPUT STRUCTURE

    Wrap your examination in '<screenshot_analysis>' tags. Then, present your final findings in '<app_flow_analysis>' tags as follows:
    <screenshot_analysis>
    [Your analysis for each screenshot, one-to-one with the provided screenshots, following the exact structure below for each:
    Screenshot X: [Title]

    Purpose:
    User Actions:
    ]
    </screenshot_analysis>

    <app_flow_analysis>

    1. Overall App Description: [Provide a comprehensive summary of the app's purpose and main features]

    2. Step-by-Step Walkthrough: [Provide a numbered, step-by-step guide of how a user would interact with the app, from start to finish. Include all possible paths and interactions.]

    </app_flow_analysis>

    **Remember**: The total number of screenshots in '<screenshot_analysis>' must match the total number of images provided . If you have 10 images, you must have 10 screenshot sections. Do not skip or merge any screenshots.
  **Additional Requirement**: The final output should **not** be wrapped in XML markers or backticks. `;
}

export function getScreenNamingAndOrderingPrompt(
  epicName: string = '',
  epicDescription: string = '',
  epicReason: string = '',
  appFlows: string
) {
  const summary = generateEpicSummary(epicName, epicDescription, epicReason);
  return `
You are an expert UI/UX analyst tasked with organizing and describing app screens based on a appflow analysis document and image URLs. Your goal is to create a structured JSON array that represents the app's screens in a logical order, focusing solely on functionality, logic, and user flow.

Below is a high-level summary of the product's functionality and purpose, just to give you context.
${summary}

**CRITICAL REQUIREMENT:** The final JSON array must include exactly one JSON object for every screenshot provided in the screenshot_analysis section of the unified analysis. For instance, if the screenshot_analysis lists 20 screenshots, your final output must contain exactly 20 JSON objects. There must be a one-to-one mapping between each screenshot in the screenshot_analysis and a JSON object in your output. You must count the total number of screenshots in the screenshot_analysis section and verify that your JSON array contains exactly that many JSON objects(including both main and sub screens). Do not omit any screenshots, regardless of whether they are marked as duplicates.

First, review the provided app flow analysis and image URLs:

<appflow_analysis>
${appFlows}
</appflow_analysis>

Your task is to analyze these documents and create a JSON array describing each screen in the app. Follow these steps:

1. **Identify Screens with Unique Navigation:**

   * **Main screens:** These are pages that possess a truly unique and standalone navigation route. They serve as major entry points or milestones in the user journey and are directly accessible via unique routes.
   * **Sub screens:** These include dialogues, pop-ups, menus, modals, overlays, or any screens that are duplicates or auxiliary variations of main screens. They do not have their own unique route and exist to complement or extend a main screen.
   **Important:** Even if a screen appears visually distinct, if it does not represent a unique navigation destination (i.e., it is an overlay, confirmation dialogue, or secondary variation), it must be classified as a sub screen.

2. **Assign Screen IDs Based on Logical Progression:**

   * The ordering and numbering of screens must be derived from the overall logical flow of the user journey, not solely based on the sequence presented in the screenshot_analysis. Ensure that each screen_id reflects the true progression of the user's interaction with the app.
   * Assign unique numeric IDs to main screens sequentially (1, 2, 3, …) in logical order.
   * Assign sub_screens under their corresponding main screen.

3. **For Each Main Screen, Provide the Following Fields in JSON:**
    * **original_order**: The continuous overall order of the screen as it appears in the screenshot_analysis.
   * **screen_id:** Unique integer (1, 2, 3, …) assigned by logical progression.
   * **screen_title:** A concise, descriptive title capturing its main purpose.
   * **screen_type:** Always "main".
   * **image_description:** A focused 2-3 sentence description that centers on the screen's one main purpose and its directly related parts. Although the description should focus on the core functionality, it must be very detailed about that core purpose by elaborating on key features and elements. If the screen is a popup or modal, include in your description the trigger point—specifically, which button or action opens the popup (for example, "on clicking the 'Edit' button, this popup is displayed"). This description should be derived solely from the unified analysis (screenshot_analysis and app_flow_analysis) and the provided image URLs. Avoid any placeholder content or irrelevant text.
   * **sub_screens** *(optional)*: An array of objects for any associated sub screens (pop-ups, overlays, etc.), each object containing:

     * **original_order**: The continuous overall order of the screen as it appears in the screenshot_analysis.
     * **screen_title**
     * **image_description** (2–3 sentences, including the trigger action)


**IMPORTANT CHECKLIST:**

1. Your final output must **only** be the JSON array—no extra text, Markdown, or code fences.
2. Verify that the number of objects in your array exactly equals the number of screenshots in screenshot_analysis.
3. Include every screenshot, even duplicates, mapped one-to-one.
4. Focus exclusively on user flow, functionality, and logic.
5. Base all titles and descriptions on the unified analysis and image URLs—no placeholders or irrelevant content.
6. Do **not** include any fields other than 'screen_id', 'screen_title', 'screen_type', 'image_description', 'original_order', and 'sub_screens'.
7. Within 'image_description', do not reference any screen IDs.

8. Ensure all screen_id values are unique and do not repeat.

** Output Format Example:**
[
   {
      "original_order": 1,
      "screen_id": 1,
      "screen_title": "Onboarding Screen",
      "screen_type": "main",
      "image_description": "Introduces the app to new users with a headline, descriptive text, and page indicators. Users tap 'Get Started' to proceed."
   },
   {
      "original_order": 2,
      "screen_id": 2,
      "screen_title": "Settings",
      "screen_type": "main",
      "image_description": "Provides access to app preferences, account management, and other configuration options.",
      "sub_screens": [
         {
            "original_order": 5,
            "screen_title": "Notification Settings",
            "image_description": "Allows users to enable or disable push notifications for orders, promotions, and app updates."
         },
         {
            "original_order": 6,
            "screen_title": "Privacy Settings",
            "image_description": "Lets users configure data sharing preferences and review the privacy policy."
         }
      ]
   },
   {
      "original_order": 3,
      "screen_id": 3,
      "screen_title": "Home Screen",
      "screen_type": "main",
      "image_description": "Serves as the app's entry point, with search, promotional banners, and a list of recommended products.",
   }
]
`;
}
