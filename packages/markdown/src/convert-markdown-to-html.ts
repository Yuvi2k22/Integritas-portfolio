import sanitizeHtml from 'sanitize-html';

const MarkdownIt = require('markdown-it'); // used require to avoid iSpace is not defined issue with turbo

const md = new MarkdownIt('default', {
  html: true,
  breaks: true,
  linkify: true
});

export function convertMarkdownToHtml(markdown: string | null) {
  if (!markdown) {
    return '';
  }

  return sanitizeHtml(md.render(markdown), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat('img') // allow img to be exempted while sanitizing
  })
    .replace(
      /<ul>/g,
      "<ul style='list-style-type: disc; list-style-position: inside; margin-left: 12px; margin-bottom: 4px'>"
    )
    .replace(
      /<ol>/g,
      "<ol style='list-style-type: decimal; list-style-position: inside; margin-left: 12px; margin-bottom: 4px'>"
    )
    .replace(
      /<a\s+href=/g,
      "<a target='_blank' class='text-blue-500 hover:text-blue-600' href="
    );
}
