export function getUserStoryAcceptanceCriteriaPrompt(
  epicFlowDoc: string = '',
  designFileDocs: string[] = [],
  userStories: Array<{ id: string; name: string; description: string }>
) {
  const formattedStories = userStories.map(
    (story) => `
  Story id: ${story.id}
  Story name: ${story.name}
  Story description: ${story.description}`
  );

  return `You are tasked with writing acceptance criteria for all the user stories in a software application development project. Your goal is to create clear, testable criteria that define when the user story is considered complete and satisfactory.

First, review the application requirements:

<app_requirements>
${epicFlowDoc}
${designFileDocs.join('\n\n')}
</app_requirements>

Now, consider the following user stories:

<user_story>
${formattedStories.join('\n\n')}
</user_story>

When writing acceptance criteria, follow these guidelines:

1. Use the Gherkin format (Given/When/Then) to describe scenarios.
2. Cover positive, negative, and edge cases.
3. Ensure criteria are specific, measurable, and testable.
4. Align with the application requirements and user story goals.

Write acceptance criteria for the user story in the following format:

1. Provide at least three scenarios using Gherkin-style structure. Each scenario should be represented as a JSON object with the keys:
   - "title": a brief description of the scenario,
   - "given": the context,
   - "when": the action,
   - "then": the expected outcome.
2. List conditions of satisfaction as an array of strings.

Your final output must be valid JSON exactly in the format below, with no additional text, markdown formatting, or code fences:

{
  "acceptance_criteria": [
    {
      "story_id": "id provided in stories list",
      "user_story": "[User Story Title or Description]",
      "scenarios": [
        {
          "title": "Scenario 1: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        },
        {
          "title": "Scenario 2: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        },
        {
          "title": "Scenario 3: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        }
      ],
      "conditions_of_satisfaction": [
        "[Condition 1]",
        "[Condition 2]",
        "[Condition 3]"
      ]
    },
    {
      "story_id": "id provided in stories list",
      "user_story": "[User Story Title or Description ]",
      "scenarios": [
        {
          "title": "Scenario 1: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        },
        {
          "title": "Scenario 2: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        },
        {
          "title": "Scenario 3: [Brief Description]",
          "given": "[context]",
          "when": "[action]",
          "then": "[expected outcome]"
        }
      ],
      "conditions_of_satisfaction": [
        "[Condition 1]",
        "[Condition 2]",
        "[Condition 3]"
      ]
    }
  ]
}
Ensure that your output is valid JSON and does not include any extra text or formatting.`;
}
