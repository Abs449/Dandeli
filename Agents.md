# AGENTS.md

## Project Overview

This repository contains a responsive tourism and adventure booking website for a Dandeli river rafting and adventure company.

The goal is to build a modern, professional, trustworthy, and visually distinctive tourism website that generates customer leads and makes it easy for visitors to contact the business through WhatsApp, phone calls, and booking forms.

The website must work well on both desktop and mobile devices.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS

Do not introduce additional frameworks, UI libraries, backend technologies, or major dependencies unless they are clearly necessary.

Prefer solutions that work with the existing project structure and dependencies.

## General Coding Rules

Before modifying code:

1. Inspect the existing repository structure.
2. Read the relevant components and files.
3. Understand how the current implementation works.
4. Reuse existing components, utilities, styles, and patterns whenever possible.
5. Make the smallest reasonable changes needed to implement the requested feature.

Do not rewrite entire components when a small modification is sufficient.

Do not modify unrelated files.

Do not remove existing functionality unless explicitly requested.

After making changes, check for TypeScript errors, build errors, broken imports, and obvious responsive layout issues.

## Code Quality

Write simple, readable, maintainable code.

Prefer straightforward solutions over unnecessary abstractions.

Use descriptive variable, function, and component names.

Avoid:

- Overengineering.
- Premature abstractions.
- Unnecessary dependencies.
- Duplicate components.
- Excessive comments explaining obvious code.
- Large components when functionality can reasonably be separated.

Follow the formatting and coding conventions already used in the repository.

## React Guidelines

Use functional React components.

Use hooks appropriately.

Avoid unnecessary state.

Do not use `useEffect` when the same behavior can be achieved through normal rendering, event handlers, or derived values.

Create reusable components when the same UI pattern appears multiple times.

Keep components focused on a clear responsibility.

Preserve the existing project architecture unless there is a strong reason to change it.

## TypeScript Guidelines

Avoid using `any`.

Define appropriate interfaces or types for component props and structured data.

Reuse existing types when available.

Do not create unnecessary complex generic types.

Keep type definitions close to their usage unless they are shared across multiple parts of the application.

## Tailwind CSS Guidelines

Use Tailwind CSS utilities for styling.

Reuse the project's existing design tokens, spacing conventions, breakpoints, and color palette.

Current design direction:

- River Blue: `#0284c7`
- Forest Green: `#166534`
- Warm Orange: `#f97316`
- Background: `#F5F3EF`

These colors are guidelines rather than requirements. Adjust shades when necessary for accessibility, contrast, hierarchy, and visual consistency.

Avoid excessive arbitrary Tailwind values when standard utilities are sufficient.

Avoid large amounts of inline CSS.

Maintain consistent spacing, border radius, shadows, typography, and component sizing.

## UI/UX Design Direction

The website should feel:

- Professional.
- Trustworthy.
- Adventurous.
- Modern.
- Clean.
- Distinctive to Dandeli and outdoor tourism.

Avoid generic AI-generated website aesthetics.

In particular, avoid:

- Excessive gradients.
- Excessive glassmorphism.
- Random decorative blobs.
- Too many rounded cards.
- Large amounts of unnecessary animation.
- Generic icons that do not match the tourism/adventure context.
- Repeating the same card layout for every section.
- Excessive shadows.
- Oversized text that reduces information density.

Prefer strong photography, typography, spacing, layout composition, and subtle interaction design.

Use icons from a consistent icon library already installed in the project.

Do not use emoji as interface icons.

## Responsive Design

Every UI change must be checked conceptually for:

- Mobile phones.
- Tablets.
- Laptops.
- Large desktop screens.

Use Tailwind's responsive utilities.

Avoid fixed widths that cause horizontal overflow.

Images should scale correctly and maintain appropriate aspect ratios.

Navigation, forms, buttons, maps, carousels, and content sections must remain usable on mobile devices.

Interactive elements should have appropriate touch targets.

## Website Structure

The website contains or may contain:

- Home.
- About.
- Services.
- Packages.
- Location.
- Reviews.
- Contact information.
- Booking or lead-generation forms.

Preserve this general information architecture unless explicitly requested to change it.

## Navbar

The navbar should:

- Be responsive.
- Support desktop navigation.
- Support the existing mobile navigation pattern.
- Remain visually consistent with the hero section.
- Provide a clear booking call-to-action.

Do not completely redesign navigation behavior unless explicitly requested.

## Booking and Lead Generation

The primary business goal of the website is generating customer leads.

Important actions include:

- Booking inquiries.
- WhatsApp contact.
- Phone calls.
- Location discovery.

Forms should be simple and mobile-friendly.

Validate required fields.

Provide clear success and error feedback.

Do not implement a payment gateway unless explicitly requested.

Do not implement a complex authentication system or admin dashboard unless explicitly requested.

## WhatsApp Integration

WhatsApp contact buttons should open a conversation with the configured business number.

Use the existing WhatsApp integration when available.

Do not duplicate WhatsApp logic across multiple components.

Keep phone numbers and contact configuration centralized when practical.

## Phone Integration

Phone buttons should use appropriate `tel:` links.

Ensure phone interactions work correctly on mobile devices.

## Google Maps Integration

The map/location section should appear after the Location content and before the Reviews section unless the existing architecture requires a different placement.

Prefer a simple responsive Google Maps embed when an interactive JavaScript Maps API is unnecessary.

Avoid exposing API keys in frontend code.

## Reviews

Reviews should help establish trust.

Prefer authentic review content linked to the original review source when available.

If a review carousel is used:

- Make it responsive.
- Support touch interaction on mobile.
- Avoid excessive automatic movement.
- Respect reduced-motion preferences when practical.

## Images

Use high-quality images relevant to:

- Dandeli.
- River rafting.
- Kayaking.
- Camping.
- Jungle activities.
- Outdoor adventure.

Optimize images for web delivery.

Use appropriate `alt` text.

Avoid unnecessary large image files.

Prevent layout shifts by defining appropriate image dimensions or aspect ratios.

Do not replace existing images unless requested or clearly necessary.

## Accessibility

Use semantic HTML.

Buttons should be actual `<button>` elements when performing actions.

Navigation links should use appropriate anchor or routing elements.

Images should have meaningful `alt` text.

Form inputs should have labels.

Maintain sufficient text/background contrast.

Ensure interactive elements are keyboard accessible.

Respect `prefers-reduced-motion` when adding significant animations.

## SEO

Use descriptive page titles and metadata.

Use appropriate heading hierarchy.

Do not add multiple `h1` elements to the same page without a clear semantic reason.

Use meaningful link text.

Use descriptive image alt text.

Avoid unnecessary client-side rendering patterns that harm discoverability.

## Performance

Avoid unnecessary JavaScript dependencies.

Lazy-load non-critical images where appropriate.

Avoid unnecessary re-renders.

Keep animations lightweight.

Optimize large images.

Do not add heavy libraries when browser APIs or existing dependencies can solve the problem.

## External Services

The project may use:

- WhatsApp links.
- Phone links.
- Google Maps embeds.
- Google Sheets or another simple lead-storage solution.

Do not introduce paid services or services requiring complex infrastructure without explicit approval.

Never expose secrets, credentials, service-account files, or private API keys in frontend code.

Use environment variables when configuration values need to remain outside the source code.

## Git and Repository Safety

Do not:

- Delete files without explaining why.
- Modify unrelated files.
- Commit secrets.
- Commit `.env` files containing credentials.
- Rewrite Git history.
- Force push.
- Change branches.
- Run destructive Git commands.

Unless explicitly requested.

Before completing a task, summarize which files were changed and what was changed.

## Testing and Verification

After modifying code, run the relevant available checks when practical.

Prefer:

- TypeScript type checking.
- ESLint.
- Existing tests.
- Production build.

For example:

`npm run lint`

`npm run build`
Do not claim that a command succeeded unless it was actually executed successfully.

If checks cannot be run, clearly state that they were not run.

## How to Respond to Development Requests

When asked to modify the project:

1. Inspect the relevant code first.
2. Briefly explain the existing implementation.
3. State the intended changes.
4. Implement the changes.
5. Run appropriate checks when possible.
6. Report the files changed.
7. Mention any important limitations or follow-up work.

Keep explanations clear and concise.

When debugging:

1. Identify the root cause.
2. Explain the cause in simple language.
3. Make the smallest appropriate fix.
4. Verify that the fix does not break related functionality.

## User Preferences

The repository owner prefers:

- Clear explanations of code changes.
- Existing code to be modified rather than unnecessarily rewritten.
- Simple solutions before advanced abstractions.
- Step-by-step explanations when learning a new concept.
- Solutions that match the user's existing code structure whenever practical.

When explaining code, assume the user is learning and explain important logic without unnecessarily simplifying technical concepts.

## Final Principle

Understand the existing codebase before changing it.

Preserve working functionality.

Make focused changes.

Prefer maintainability and clarity.

Keep the website professional, distinctive, responsive, performant, and focused on converting visitors into customer leads.
