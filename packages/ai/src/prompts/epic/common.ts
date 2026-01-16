export function generateEpicSummary(
  epicName: string,
  epicDescription: string,
  epicReason: string
) {
  return `
The name of the feature/functionality is ${epicName}.

A brief description about it is:
${epicDescription}
${epicReason ? '\n' + 'The reason for its implementation is' + '\n' + epicReason : ''}
`;
}
