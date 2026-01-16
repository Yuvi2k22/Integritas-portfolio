export function getUserStoriesGenerationPrompt(
  epicFlowDoc: string = '',
  designFileDocs: string[] = []
) {
  return `You are tasked with breaking down software application requirements into user stories or tasks for a development team. These user stories will be added to project management apps like Jira and Linear. Your goal is to create clear, concise, and actionable user stories that follow best practices and guidelines.

Here are the requirements for the application:

<app_requirements>
${epicFlowDoc}
${designFileDocs.join('\n')}
</app_requirements>

When breaking down these requirements into user stories, follow these guidelines:

1. Keep titles lightweight and put context (i.e. the user story) in the description.
2. Define an objective using the format: "As a <type of user>, I want <desired outcome> so that <benefit>."
3. State the desired outcome clearly.
4. Highlight the real problem or job-to-be-done.
5. Ensure the "why" is clear by explaining the business value.
6. Order the user stories to follow the natural sequence of user interactions with the application.

After your analysis, present ONLY the user stories in JSON format. Each user story should be an object with "title" and "description" keys. Do not include any text outside of the JSON structure.
Example output structure (do not use this content, it's just for format reference):
Output your answer in the following format:
[
  {
    "title": "Create user account",
    "description": "As a new user, I want to create an account so that I can access the application's features."
  },
  {
    "title": "Log in to application",
    "description": "As a registered user, I want to log in to the application so that I can use my personalized settings."
  }
]
If no objects, output:
[]
Now, please break down the given app requirements into individual user stories.`;
}
