export function getAppflowPrompt(
  image_descriptions: string,
  product_details: string,
  transcript?: string | null,
) {
  const transcription = transcript
    ? `Consider these back-end logics when producing the output:
${transcript}\n`
    : '';

  return `
**Objective:**  
Thoroughly analyze all provided images (and their image descriptions) to generate comprehensive documentation outlining the user flow, features, and key user actions of the application. Your output must be highly detailed, generic, and strictly follow the structure provided in the **Output Format** section.

<image_descriptions>
${image_descriptions}
</image_descriptions>

Below is a high-level summary of the product's functionality and purpose which may user provide, just to give you context.
${product_details}
${transcription}
**Instructions:**

1. **Comprehensive Image and UI Analysis:**  
   - **Examine image and image descriptions :**  
     - Analyze image descriptions to deduce the intended purpose, context, and role of each screen.
   - **Identify UI Elements:**  
     - List all visible UI components such as buttons, toggles, input fields, dropdowns, icons, labels, menus, navigation bars, and tooltips.
     - Note visual states (e.g., active, hover, error) and layout details including grouping and hierarchy.
   - **Observe Navigation Cues and Transitions:**  
     - Identify elements that indicate flow changes, such as progress bars, loading animations, confirmation dialogs, and error messages.
     - Document transitions and interactions that guide the user from one screen to the next.
   - **Extract Interaction Details:**  
     - Detail user actions like clicking, swiping, or entering text and the visual feedback provided during these interactions.
   - **Evaluate Design Consistency:**  
     - Note recurring design patterns, color schemes, typography, iconography, and overall layout to ensure a uniform user experience.

2. **Detailed Mapping of the User Flow:**  
   - **Identify and Sequence All Screens:**  
     - Map every screen encountered in the application, including starting, intermediate, loading, result/detail, error/alternative, and final screens.
   - **For each screen, provide:**  
     - **Screen Name and Function/Purpose:**  
       - A generic label and description that conveys the function of the screen.
     - **Inputs/Options Presented:**  
       - List all input fields, buttons, or options available on that screen.
     - **User Actions:**  
       - Describe the actions (e.g., clicking, entering text) the user must take to transition to the next screen.
     - **Processing or Loading Indicators:**  
       - Note any progress indicators or processing messages that appear upon user actions.
   - **Include all observed screens** to ensure nothing important is missed.

3. **In-depth Extraction of Application Features:**  
   - **Feature Overview:**  
     - List all major functionalities of the application in a clear, generic manner.
   - **For each feature, provide:**  
     - **Description:**  
       - A concise yet thorough explanation of what the feature does.
     - **Inputs/Components:**  
       - Enumerate all interactive UI elements associated with the feature.
     - **User Benefit:**  
       - Explain in general terms how this feature enhances usability, streamlines workflow, or simplifies user tasks.

4. **Comprehensive Outline of Key User Actions:**  
   - **Essential Interactions:**  
     - Summarize key actions, such as creating content, generating visual elements, viewing/editing details, or accessing past projects.
   - **Customization, Adjustments, and Finalization:**  
     - Detail options for modifying settings, saving progress, or exiting the application.
  
5. **Strict Formatting Requirements:**  
   - Your final output must exactly follow the structure provided in the **Output Format** section below.
   - Replace all placeholder text (e.g., [Screen Name], [Input Field 1]) with generic yet descriptive labels based on your analysis.
   - Do not add extra commentary or domain-specific details.

**Output Format:**  
Your final documentation must exactly match the following structure:

---

### **User Flow**

#### **1. [Screen 1 Name] - [Screen Function/Purpose]**
- The user begins by providing:
  - **[Input Field 1]** (e.g., *Example Input*)
  - **[Input Field 2]** (e.g., *Example Input*)
  - *(List all relevant inputs as observed)*
- The user clicks **[Primary Action Button]**.
- The application processes the input and transitions to the next screen.

#### **2. [Screen 2 Name] - [Screen Function/Purpose]**
- After the initial action, the user navigates to:
  - Inputs required may include:
    - **[Input Field 1]**
    - **[Input Field 2]**
    - *(List additional inputs if any)*
- The user clicks **[Next Action Button]** to proceed.

#### **3. [Screen 3 Name] - [Screen Function/Purpose]**
- This screen may provide additional options or intermediate steps:
  - The user interacts with:
    - **[Input Field/Option 1]**
    - **[Input Field/Option 2]**
- Specific actions on this screen lead to further navigation.

#### **4. Loading Screen**
- Upon triggering an action:
  - A loading screen appears, indicating progress:
    - **Step 1:** [Description of first process, e.g., "Creating Characters"].
    - **Step 2:** [Description of second process, e.g., "Creating Image Descriptions"].

#### **5. [Screen 5 Name] - [Screen Function/Purpose]**
- Once processing is complete:
  - Detailed outputs or previews are displayed.
  - Interactive elements (e.g., **Confirm** button) allow further actions.
  - Options to view or edit details are provided.

#### **6. [Screen 6 Name] - [Screen Function/Purpose] (Optional)**
- If applicable, an additional screen such as an error, pop-up, or alternative view is presented:
  - May include details like a **pop-up** for more information or options to retry.
  
#### **7. [Screen 7 Name] - [Screen Function/Purpose]**
- The final screen confirms the successful completion of the process:
  - Provides options to finalize, save changes, or exit the application.
  - May display a summary of actions taken.

---

### **Features of the Application**

#### **1. [Feature Name]**
- **Description:**  
  - Explain what this feature does in a general way.
- **Inputs/Components:**  
  - List all associated UI elements.
- **User Benefit:**  
  - Describe how this feature enhances the overall user experience.

#### **2. [Feature Name]**
- **Description:**  
  - Provide a general explanation of the functionality.
- **Inputs/Components:**  
  - Enumerate the interactive elements involved.
- **User Benefit:**  
  - Outline the benefits, such as improved usability or workflow efficiency.

*(Repeat for additional features if necessary)*

---

### **Key Actions for the User**
1. **Initial Interaction:**  
   - Describe how the user starts their journey (e.g., accessing the application or logging in).
2. **Engaging with Core Features:**  
   - Outline the actions required to use the main features (e.g., clicking buttons, entering data).
3. **Customization and Adjustments:**  
   - Detail how users can modify settings or inputs.
4. **Finalization:**  
   - Explain the concluding steps, such as saving or exiting the session.

---

**Example Reference:**  
Below is an example of a completed user flow for a story creation application:

### **User Flow**

#### **1. Story Creation Tool - Starting Page**
- The user begins by providing:
  - **Story Title** (e.g., *Lily*)
  - **Story Type** (e.g., *Moral, Adventure*)
  - **Target Age Group** (e.g., *Preschoolers 3-5 years*)
  - **Number of Characters** and their Names.
  - **Number of Pages** (e.g., *up to 50 pages*).
- The user clicks **Create Content**.
- The tool generates the story content.

#### **2. Storyboard Image Generator Entry Page**
- After the story is created, the user moves to the **Storyboard Image Generator**.
- Inputs required:
  - **Project Name**
  - **The Story** (imported or typed in).
- The user clicks **Continue** to proceed.

#### **3. Loading Screen**
- After clicking **Continue**, a loading screen appears showing the progress:
  - **Step 1:** Creating Characters.
  - **Step 2:** Creating Image Descriptions.

#### **4. Image Description Page**
- Once loaded:
  - **Detailed Image Descriptions** for each shot are displayed.
  - Characters are identified, but descriptions remain hidden until clicked.
  - A **Generate All Images** button allows the user to trigger image generation.

#### **5. Image Generation Page**
- After clicking **Generate All Images**:
  - The tool generates images for each shot based on the descriptions.
  - Users can view all images for their story shots.

#### **6. Character List View**
- By clicking on a **Character Name**, a pop-up appears showing:
  - The **Character's Name**.
  - A **Description** (e.g., *character's role, appearance, background*).

#### **7. Project History Page**
- Users can access their previous projects on this page.
- Each project is listed with a **"Use"** button to reload it.

---

### **Features of the Application**

#### **1. Kids Story Generator**
- Generates a kid-friendly story based on:
  - **Title**
  - **Story Type**
  - **Age Group**
  - **Number of Pages and Characters**

#### **2. Storyboard Image Generator**
- Allows users to create **visual storyboards** for their stories.
- Inputs include:
  - **Project Name**
  - **Story Text**

#### **3. Character Creation**
- Automatically creates **characters** based on the story.
- Users can **click on character names** to view or edit descriptions.

#### **4. Image Description Generation**
- Generates **detailed descriptions** for each storyboard image.

#### **5. Image Generation**
- Converts **descriptions into visual images** for each shot.
- Supports **multiple shots** with descriptions and images.

#### **6. Character List View**
- Provides an **organized view** of all characters with detailed descriptions.

#### **7. Project History**
- Displays a **list of past projects** with options to reload them for further editing or reuse.

---

### **Key Actions for the User**
1. **Create a story** by filling out the input fields.
2. **Generate a storyboard** with descriptions and images.
3. **View and edit characters** using the character pop-up.
4. **Access and reuse past projects** via the history page.

This example illustrates a user flow for a story creation tool. Your output should similarly document every screen, feature, and key action in detail.

Your response must be in a proper markdown format, use codeblocks, headings, list appropriately wherever applicable. use line breaks for a cleaner formatting

**Additional Requirement**: The final output should **not** be wrapped in XML markers or backticks.
`;
}
