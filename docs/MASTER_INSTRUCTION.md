# HERMES MASTER INSTRUCTION

## Lemnion Website Operating System

You are working on the official Lemnion website.

Website: https://lemnion.nl/
Brand: Lemnion
Descriptor: Hospitality Energy Solutions
Tagline: Optimizing Every Watt

This document is the master instruction set for every future task performed on the Lemnion website.

Before changing, generating, editing, refactoring or adding anything to the website, you MUST first read and respect all relevant project documentation and existing implementation.

The goal is to ensure that every future change remains consistent with:

* Lemnion branding
* UX
* mobile-first design
* accessibility
* WCAG 2.2
* SEO
* technical quality
* performance
* content style
* conversion strategy
* responsive behaviour
* existing functionality

This master instruction overrides the tendency to redesign, reinterpret or introduce unnecessary new styles.

---

# 1. CORE PRINCIPLE

The existing Lemnion website is the baseline.

Your default behaviour must be:

> Preserve first. Improve only where necessary.

Do not treat a new task as permission to redesign surrounding elements.

A request to change one component does NOT mean you may change:

* neighbouring sections
* typography elsewhere
* spacing elsewhere
* colour usage elsewhere
* page structure
* navigation
* content hierarchy
* existing conversion flows

Changes must remain tightly scoped to the task.

---

# 2. REQUIRED PRE-FLIGHT CHECK

Before starting ANY development task, first inspect the relevant parts of the repository.

If available, read these files first:


/docs/BRAND_GUIDELINES.md
/docs/BRAND_AUDIT.md
/docs/AI_BRAND_RULES.md
/docs/brand-system.json


Also inspect:


brand.config.ts
brand.config.js
styles/tokens.css
styles/brand.css
tailwind.config.*
global.css
globals.css


or their equivalents.

Also review the existing components affected by the task.

Do not create new design values when an existing token or component already exists.

---

# 3. SOURCE OF TRUTH PRIORITY

When instructions appear to conflict, use this priority:


1. Explicit instruction in the current user task
2. This MASTER INSTRUCTION
3. AI_BRAND_RULES.md
4. BRAND_GUIDELINES.md
5. brand-system.json
6. Existing design tokens
7. Existing reusable components
8. Existing page implementation


Never invent a new design system because something is easier to code differently.

---

# 4. BRAND PROTECTION

Lemnion operates at the intersection of:

Hospitality + Energy + Technology + Sustainability + Business Performance

The brand should communicate:

* expertise
* trust
* premium quality
* technological intelligence
* simplicity
* operational understanding
* energy optimisation
* reliability
* hospitality knowledge
* commercial relevance

Lemnion must feel like:

> A premium energy infrastructure and technology partner created specifically for the hospitality industry.

It should NOT become visually similar to:

* a generic solar installer
* a utility company
* an electrician
* a generic EV charging company
* a consumer sustainability brand
* a generic SaaS startup
* a futuristic crypto or AI company

---

# 5. BRAND ARCHITECTURE

Maintain the following hierarchy:

## Primary brand

Lemnion

## Descriptor

Hospitality Energy Solutions

## Tagline

Optimizing Every Watt

Do not create variations of these names or taglines unless explicitly requested.

---

# 6. BRAND TOKENS ARE MANDATORY

Never hardcode a new visual value if an equivalent design token exists.

Always prefer variables or configuration values for:

* colours
* typography
* spacing
* border radius
* borders
* shadows
* breakpoints
* transitions
* container widths
* button styles
* form styles

Example:

Do NOT use:


color: #123456;


if:


color: var(--color-brand-primary);


already exists.

Do NOT introduce slightly different versions of existing colours.

---

# 7. NO VISUAL DRIFT

Every change must protect against design drift.

Before creating something new, ask internally:
Does an existing Lemnion component already solve this?


If yes:

reuse it.

If no:

create a new component using existing Lemnion tokens and patterns.

Never create arbitrary:

* button styles
* card styles
* shadows
* border radii
* gradients
* icon styles
* font sizes
* colours
* spacing systems

---

# 8. MOBILE-FIRST IS MANDATORY

All future development must use a mobile-first approach.

Start with the smallest practical viewport and progressively enhance for larger screens.

Minimum testing widths:


320px
375px
390px
430px
768px
1024px
1280px
1440px


Do not build desktop first and then attempt to repair mobile with overrides.

---

# 9. RESPONSIVE DESIGN RULE

The existing content, hierarchy and visual concept should remain recognisable across all breakpoints.

Responsive adaptation may change:

* columns into stacked layouts
* font sizes
* padding
* spacing
* alignment
* image positioning
* navigation behaviour

Responsive adaptation may NOT arbitrarily:

* remove important information
* reorder conversion-critical content
* hide CTAs
* create different messaging
* drastically alter the visual identity

unless explicitly requested.

---

# 10. MOBILE UX

On mobile, ensure:

* no horizontal scrolling
* no clipped content
* readable typography
* sensible line lengths
* clear hierarchy
* appropriate spacing
* usable buttons
* usable navigation
* usable forms
* no overlapping elements
* no inaccessible hover-dependent functionality

Interactive controls should preferably have a touch target of at least approximately:


44 x 44 px


---

# 11. WCAG 2.2 REQUIREMENT

All development must aim for:

WCAG 2.2 Level AA

Accessibility is not an optional QA step. It must be considered during implementation.

Check relevant success criteria covering:

* perceivable
* operable
* understandable
* robust

---

# 12. SEMANTIC HTML

Use semantic HTML wherever possible.

Prefer:


<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
<button>
<form>
<label>


Do not recreate interactive semantics using generic <div> elements.

---

# 13. HEADING STRUCTURE

Maintain logical heading hierarchy.

Generally:


H1 = page topic

H2 = primary sections

H3 = subsections

H4 = supporting subsections


Do not choose heading levels purely based on visual appearance.

A page should normally contain one primary H1.

---

# 14. KEYBOARD ACCESSIBILITY

Every interactive element must work using keyboard navigation.

Verify:

* Tab
* Shift + Tab
* Enter
* Space
* Escape where relevant
* arrow navigation where appropriate

Do not remove focus outlines unless an equally clear accessible focus indicator replaces them.

---

# 15. FOCUS STATES

Focus states must be clearly visible.

Never use:


outline: none;


without implementing a clear alternative.

Check focus states for:

* navigation
* buttons
* forms
* links
* dropdowns
* modals
* accordions
* mobile navigation

---

# 16. COLOUR CONTRAST

Maintain WCAG AA contrast.

Pay particular attention to:

* green backgrounds
* light-grey text
* placeholder text
* secondary navigation
* buttons
* overlays
* image text
* footer text
* form borders

Do not rely on colour alone to communicate meaning.

---

# 17. IMAGE ACCESSIBILITY

Meaningful images require useful alt text.

Decorative imagery should generally use:


alt=""


Do not populate alt attributes with SEO keyword stuffing.

Alt text should explain the meaningful visual information.

---

# 18. FORMS

Every form control must have an associated label.

Do not rely exclusively on placeholders.

Errors must:

* explain the problem
* identify the affected field
* not rely on red colouring alone

Where practical, move focus appropriately after submission errors.

---

# 19. MOTION

Respect:


prefers-reduced-motion


Animations must not be essential to understanding the page.

Avoid unnecessary:

* parallax
* continuous motion
* floating elements
* excessive entrance animations

Lemnion should feel calm and premium.

---

# 20. SEO MUST NOT BE DAMAGED
Before modifying page structure, check whether the change could affect:

* H1/H2 hierarchy
* title tags
* meta descriptions
* canonical URLs
* structured data
* internal links
* crawlability
* indexability
* anchor text
* semantic content structure

Do not remove or weaken existing SEO signals unnecessarily.

---

# 21. SEO AND UX MUST ALIGN

Do not write pages for search engines at the expense of humans.

The primary audience includes:

* hotel owners
* general managers
* CFOs
* asset managers
* facility managers
* technical teams
* hotel operators

Content must remain understandable without extensive electrical engineering knowledge.

---

# 22. SEARCH INTENT

Pages should clearly answer relevant hospitality-energy questions such as:

* What is the problem?
* Why does it matter?
* What are the operational consequences?
* What solution does Lemnion provide?
* How does it work?
* What does it mean financially?
* What does it mean operationally?
* What is required from the hotel?
* What is the next step?

---

# 23. CONTENT FRAMEWORK

When new commercial content is required, prefer this structure:


Hotel situation
↓
Problem
↓
Operational consequence
↓
Lemnion solution
↓
How it works
↓
Business impact
↓
Next action


The solution must always connect back to the hotel operation.

---

# 24. BRAND VOICE

Lemnion's tone should be:

* knowledgeable
* confident
* clear
* commercially intelligent
* practical
* calm
* credible
* hospitality-focused
* technically informed

Avoid:

* hype
* exaggerated claims
* startup jargon
* vague sustainability language
* excessive technical terminology
* fear-based selling

---

# 25. NO GENERIC AI COPY

Never output copy that sounds obviously AI-generated.

Avoid repetitive patterns such as:


Whether you're...
Not only... but also...
In today's rapidly changing world...
The future of...
Take your business to the next level...


Do not overuse rhetorical questions.

Do not create artificial excitement.

---

# 26. DASH RULE

Avoid unnecessary:


—
–


Do not routinely join thoughts using em dashes or en dashes.

Prefer natural sentence structure using:

* full stops
* commas
* colons
* semicolons where appropriate

This rule applies to:

* headings
* body copy
* cards
* CTAs
* metadata
* FAQs
* generated content

Hyphens may still be used where grammatically required inside compound terms.

---

# 27. WRITING STYLE

Prefer concise sentences.

Avoid unnecessary complexity.

Example:

BAD:

> Dankzij onze geavanceerde intelligente energie-infrastructuur kunnen hospitality-ondernemingen hun energielandschap transformeren.

BETTER:

> Lemnion helpt hotels hun energie slimmer te gebruiken, op te slaan en in te zetten.

Technical credibility should come from clarity, not complicated language.

---

# 28. HOSPITALITY FIRST

Always translate energy technology into hospitality consequences.

Do not explain battery technology in isolation.

Connect it to scenarios such as:

* hotel occupancy
* breakfast peak
* kitchen load
* HVAC
* air conditioning
* laundry
* spa
* conferences
* EV charging
* housekeeping
* solar production
* grid limitations
* peak demand

The visitor should understand:

> What does this mean for my hotel?

---

# 29. ENERGY TERMINOLOGY

Use technical terminology consistently.

Examples:

EMS
Energy Management System

BMS
Battery Management System

ESS
Energy Storage System

CPO
Charge Point Operator

EMSP
Electric Mobility Service Provider

MPPT
Maximum Power Point Tracking

AC
Alternating Current

DC
Direct Current

kW
Power

kWh
Energy capacity / consumption

Do not confuse kW and kWh.

---

# 30. CLAIMS MUST BE DEFENSIBLE

Never invent:

* savings percentages
* ROI
* payback periods
* battery performance
* energy prices
* market statistics
* government requirements
* subsidy amounts
* grid capacity claims
* environmental savings

When such information is required, use reliable sources or clearly indicate that numbers are examples or estimates.

---

# 31. COMPONENT REUSE

Before building a new component:
1. Search the repository.
2. Check whether an equivalent exists.
3. Reuse or extend it where practical.

Prefer:


one flexible component


over:


multiple almost-identical components


---

# 32. COMPONENT RESPONSIBILITY

Keep components understandable.

Avoid giant components containing:

* business logic
* styling
* data fetching
* state management
* analytics
* content

all mixed together.

Split where doing so improves maintainability.

Do not over-engineer small components.

---

# 33. PERFORMANCE

Performance is part of the user experience and SEO.

Protect Core Web Vitals.

Pay particular attention to:

* LCP
* CLS
* INP

Avoid introducing unnecessary JavaScript.

---

# 34. IMAGE PERFORMANCE

Use appropriate:

* dimensions
* compression
* formats
* responsive images
* lazy loading

Prioritise hero imagery appropriately.

Prevent layout shifts by defining image dimensions or aspect ratios.

Prefer modern image formats where compatible.

---

# 35. FONT PERFORMANCE

Do not add new web fonts casually.

Existing Lemnion fonts should be reused.

If fonts are self-hosted:

* optimise weights
* preload only critical fonts
* avoid unnecessary variants

Avoid loading six weights when three suffice.

---

# 36. JAVASCRIPT

Prefer simple implementations.

Do not add large dependencies for functionality that can reasonably be handled using:

* HTML
* CSS
* existing utilities
* small native JavaScript

Check the existing framework before adding libraries.

---

# 37. THIRD-PARTY PACKAGES

Before installing a package:

1. Determine whether the existing project already solves the requirement.
2. Evaluate bundle impact.
3. Check maintenance status.
4. Check security implications.
5. Avoid duplicate libraries.

Do not install packages merely for convenience.

---

# 38. SECURITY

Never expose:

* API keys
* passwords
* access tokens
* private endpoints
* credentials

Do not commit secrets to:


.env
source files
client-side code
Git


Validate and sanitise relevant input.

---

# 39. LINKS

Check links after modifications.

Avoid:

* broken internal links
* incorrect language links
* duplicate destinations
* links to development environments

External links should use appropriate security attributes when opening new tabs.

---

# 40. BUTTONS VS LINKS

Use:


button


for actions.

Use:


a


for navigation.

Do not use clickable <div> elements where semantic elements are available.

---

# 41. LANGUAGE SYSTEM

The brand must remain consistent across:

* Dutch
* English
* French
* Spanish

Do not create language-specific visual identities.

Translation layouts must accommodate text expansion.

Never solve translated text overflow by making text unreadably small.

---

# 42. INTERNATIONALISATION

Do not hardcode visible UI strings if the project uses an existing translation system.

Respect:

* locale files
* translation keys
* routing
* fallbacks
* language switching

Do not introduce duplicate translation approaches.

---

# 43. ENERGY ECOSYSTEM

Maintain visual consistency when presenting the Lemnion ecosystem.

A conceptual energy flow may include:


GRID
↓
EMS
↔
BATTERY
↔
SOLAR
↔
HOTEL
↔
EV CHARGING


Diagrams should remain:

* clear
* modular
* understandable
* visually consistent
* hospitality oriented

They should not become electrical engineering schematics unless explicitly requested.

---

# 44. DATA VISUALISATION

Charts should follow Lemnion brand rules.

Use brand tokens for:

* lines
* labels
* grids
* backgrounds
* highlights

Charts must remain understandable for users with colour-vision deficiencies.

Do not rely solely on colour to distinguish important datasets.

---

# 45. CTA HIERARCHY

Each section should have an intentional CTA hierarchy.

Avoid competing primary buttons.

Typical hierarchy:


Primary action
Secondary action
Text link


Do not make every button visually primary.

---

# 46. CONVERSION PROTECTION

Before modifying a conversion element, consider:
* discoverability
* clarity
* friction
* trust
* mobile usability
* accessibility

Do not add unnecessary form fields.

Do not hide key calls to action on mobile.

---

# 47. NO DARK PATTERNS

Do not use:

* fake scarcity
* misleading timers
* disguised advertising
* confusing cancellation flows
* preselected marketing options
* intentionally confusing consent mechanisms

Lemnion must communicate trust.

---

# 48. CONSENT AND PRIVACY

Respect the website's existing privacy and consent architecture.

Do not bypass consent requirements for:

* analytics
* tracking
* marketing pixels
* cookies

Do not arbitrarily introduce third-party trackers.

---

# 49. ANALYTICS

When modifying conversion-critical interactions, preserve existing analytics events where possible.

Examples:

* CTA clicks
* form submissions
* calculator interactions
* contact requests
* navigation actions

Do not silently remove event tracking.

---

# 50. FORMS QA

Whenever a form changes, test:


Empty submission
Valid submission
Invalid email
Very long input
Special characters
Keyboard-only
Mobile
Error response
Success response
Slow response


Verify that the user receives clear feedback.

---

# 51. INTERACTIVE COMPONENT QA

For elements such as:

* accordions
* dropdowns
* tabs
* menus
* sliders
* modals
* calculators

test:

* mouse
* keyboard
* touchscreen
* focus management
* small screens
* large screens
* rapid interaction
* opening and closing repeatedly

---

# 52. RESPONSIVE QA

For every front-end change, test at least:


320px
375px
430px
768px
1024px
1440px


Check:


No horizontal overflow
No overlapping text
No clipped images
No broken grids
No unusable navigation
No tiny touch targets
No excessively wide text


---

# 53. CONTENT QA

Before completion, inspect visible text for:

* spelling
* grammar
* double spaces
* duplicate words
* incorrect punctuation
* em dashes / en dashes
* inconsistent terminology
* incorrect capitalisation
* broken translation keys
* placeholder copy

Do not rewrite unrelated content while fixing these issues.

---

# 54. TECHNICAL QA

Run all applicable checks already supported by the project.

Examples:


lint
typecheck
unit tests
integration tests
build


Do not disable lint or TypeScript rules merely to get the build to pass.

Fix the underlying problem.

---

# 55. CONSOLE QA

Check browser console for:

* JavaScript errors
* React warnings
* hydration errors
* failed API requests
* missing resources
* deprecated functionality

A page that visually works but generates errors is not complete.

---

# 56. NETWORK QA

Inspect relevant network traffic.

Look for:

* 404s
* 500s
* duplicate calls
* failed images
* blocked scripts
* unnecessarily large resources

---

# 57. VISUAL REGRESSION

Whenever existing styling is touched, compare before and after.

Pay attention to:

* header
* hero
* headings
* buttons
* cards
* sections
* forms
* footer
* mobile menu

The intended change should be visible.

Unintended changes should not be visible.

---

# 58. BROWSER COMPATIBILITY

Avoid relying on experimental browser features unless a fallback exists.

The site should function correctly in current major versions of:

* Chrome
* Safari
* Edge
* Firefox

Pay particular attention to Safari on iOS.

---

# 59. SAFE REFACTORING

Do not combine a functional change with a large unrelated refactor.

Example:

If asked to modify one CTA:

do not simultaneously rebuild the entire button system.

If refactoring is required, keep it tightly related to the requested work.

---

# 60. DO NOT DELETE UNKNOWN CODE

If you encounter code whose purpose is unclear:

investigate before deleting it.

It may support:

* analytics
* accessibility
* SEO
* translations
* API integrations
* browser compatibility

Do not assume unused-looking code is actually unused.

---

# 61. EXISTING FUNCTIONALITY MUST REMAIN

After any change, verify that the surrounding functionality still works.

Do not only test the exact path you modified.

Example:

Changing mobile navigation requires checking:
* desktop navigation
* language switcher
* CTA
* submenu
* keyboard behaviour
* body scroll lock
* closing behaviour

---

# 62. NO PLACEHOLDER IMPLEMENTATIONS

Do not leave:


TODO
placeholder
Lorem ipsum
temporary image
dummy data
console.log
hardcoded temporary value


in production code unless explicitly requested.

---

# 63. ERROR STATES

Every asynchronous user action should account for:


Loading
Success
Error
Empty state


Do not leave users without feedback.

---

# 64. EMPTY STATES

If a dataset can legitimately be empty, create a useful empty state.

Do not render broken layouts or empty boxes.

---

# 65. LOADING STATES

Loading indicators should:

* preserve layout where possible
* avoid unnecessary layout shift
* not block unrelated interactions

Do not introduce flashy animations.

---

# 66. DESIGN REVIEW QUESTIONS

Before approving any visual change, internally ask:


Does this still look like Lemnion?

Does this feel appropriate for hospitality?

Does this feel premium?

Is it clear rather than flashy?

Does it improve the user's understanding?

Is this style already defined elsewhere?

Does it work on mobile?

Is it accessible?

Does it introduce unnecessary complexity?


---

# 67. CONTENT REVIEW QUESTIONS

Before approving new copy, ask:


Would a hotelier understand this?

Is the business benefit clear?

Are technical claims correct?

Is the sentence shorter than it needs to be?

Does it sound like a person wrote it?

Does it contain unnecessary AI-style language?

Does it contain unnecessary dashes?

Does it explain the operational impact?


---

# 68. SEO REVIEW QUESTIONS

Before releasing a page change, ask:


Is the search intent still clear?

Is the H1 still appropriate?

Is heading hierarchy intact?

Are important internal links preserved?

Is indexability unchanged?

Did performance deteriorate?

Did mobile usability deteriorate?

Did content become thinner or less useful?


---

# 69. ACCESSIBILITY REVIEW QUESTIONS

Ask:


Can I use this with keyboard only?

Can I understand it without colour?

Is focus visible?

Are labels available?

Is contrast sufficient?

Does zooming to 200% still work?

Does the interface survive narrow widths?

Does reduced motion work?


---

# 70. DO NOT REDESIGN BY DEFAULT

This is one of the most important rules.

If you notice something you believe could look better:

do NOT automatically redesign it.

Instead classify it as:


P0 = functional / accessibility / critical consistency issue

P1 = meaningful improvement

P2 = subjective visual improvement


You may fix P0 issues where relevant to the task.

P1 should be implemented only when clearly connected to the requested work.

P2 should normally be documented, not implemented.

---

# 71. REPOSITORY CLEANLINESS

Maintain a clean project structure.

Avoid:

* duplicate assets
* duplicate components
* abandoned backup files
* unused imports
* commented-out old implementations
* random temporary directories

Do not reorganise the entire repository without a reason.

---

# 72. DOCUMENT IMPORTANT DECISIONS

If you make a significant design or architecture decision, document:

* what changed
* why
* which existing rule it follows
* potential implications

Keep documentation concise and useful.

---

# 73. BRAND GUARDRAIL UPDATE

If a task establishes a genuinely new, approved recurring brand pattern, update the relevant branding documentation.

For example:


BRAND_GUIDELINES.md
brand-system.json
AI_BRAND_RULES.md


Do not update the brand system for one-off exceptions unless they are intentionally becoming standards.

---

# 74. NEW COMPONENT RULE

If a new reusable component is created, document or structure it so future agents know:

* intended usage
* variants
* responsive behaviour
* accessibility behaviour

Avoid ambiguous component names such as:


Box2
NewCard
SpecialSection
Thing


Use descriptive names.

---

# 75. CSS RULE

Prefer existing project architecture.

Do not introduce a competing styling system.
For example:

If the site uses Tailwind:

do not suddenly introduce styled-components.

If the site uses CSS modules:

do not introduce Tailwind without explicit approval.

If it uses central CSS tokens:

reuse those tokens.

---

# 76. BREAKPOINT RULE

Use existing breakpoints whenever possible.

Do not create arbitrary breakpoint values for individual components unless necessary.

Responsive logic should remain predictable across the website.

---

# 77. Z-INDEX

Avoid arbitrary values such as:


z-index: 999999;


Use the existing z-index scale or create a documented scale if none exists.

---

# 78. ICON RULE

Reuse the existing icon library.

Do not mix:

* filled icons
* outlined icons
* emoji
* custom illustrations
* multiple icon libraries

without deliberate reason.

Never use emojis as interface icons.

---

# 79. PHOTO RULE

New images should fit Lemnion's visual direction.

Prefer:

* high-quality hotel environments
* relevant energy infrastructure
* authentic operational contexts
* technically credible installations

Avoid cliché sustainability imagery.

Images should reinforce the hospitality context.

---

# 80. IMAGE OVERLAY TEXT

When text is displayed over photography:

* ensure sufficient contrast
* test mobile crops
* do not place critical text over visually noisy regions
* consider an accessible overlay if required

Never assume desktop image positioning works on mobile.

---

# 81. PAGE WIDTH

Maintain readable content widths.

Do not allow long body copy to span an excessively wide desktop screen.

Text content should use an appropriate max-width.

Full-width elements should be used intentionally.

---

# 82. SECTION SPACING

Keep vertical rhythm consistent.

Do not manually create slightly different top/bottom spacing for every section.

Use the shared spacing scale.

---

# 83. TYPOGRAPHY CONSISTENCY

Do not introduce arbitrary font sizes.

Use the defined hierarchy.

For responsive typography, prefer a controlled scale or clamp() when appropriate.

Avoid extremely large mobile headings.

---

# 84. BUTTON COPY

Button labels should be action-oriented and specific.

Prefer:


Bereken je besparing
Bekijk de oplossing
Plan een gesprek
Ontdek hoe het werkt


Avoid vague labels such as:


Klik hier
Meer
Verder
Start


when a clearer action is possible.

---

# 85. LINK COPY

Links should make sense without relying entirely on surrounding text.

Avoid repeated meaningless links such as:


Lees meer
Lees meer
Lees meer


when more descriptive link labels are practical.

---

# 86. TABLES

If tables are introduced:

* use semantic markup
* use column or row headers correctly
* ensure responsive behaviour
* avoid horizontal overflow where possible

If horizontal scrolling is necessary, make it obvious and usable.

---

# 87. MODALS

Modals must:

* trap focus appropriately
* be keyboard closable
* restore focus after closing
* have an accessible label
* prevent inappropriate background interaction

Avoid unnecessary modals.

---

# 88. MOBILE MENU

The mobile menu must:

* open reliably
* close reliably
* be keyboard accessible
* support touch
* have visible focus
* prevent unwanted page scrolling
* return focus appropriately

Do not create separate content solely for mobile unless required.

---

# 89. STICKY ELEMENTS

Use sticky/fixed UI sparingly.

Check that it does not:

* cover content
* interfere with browser controls
* obscure forms
* reduce mobile usable space excessively

---

# 90. PAGE SPEED BUDGET MINDSET

Before adding something visually attractive, consider its cost.

Avoid introducing:

* autoplay videos
* large background videos
* huge animation libraries
* unnecessary JavaScript carousels
* enormous uncompressed imagery

unless the value clearly outweighs the performance impact.

---

# 91. FAILURE HANDLING

If a requested implementation conflicts with:

* accessibility
* security
* core brand rules
* technical feasibility

do not silently ignore the issue.
Implement the closest safe and brand-consistent solution and explain the constraint in the final report.

---

# 92. NEVER FAKE COMPLETION

Do not claim:


All pages tested
All accessibility issues fixed
All browsers verified
All SEO checks passed


unless those checks were actually performed.

Report precisely what was tested.

---

# 93. FINAL QA BEFORE COMPLETION

For every meaningful implementation, complete the applicable checks:


[ ] Requested functionality works

[ ] Desktop checked

[ ] Mobile checked

[ ] Tablet checked

[ ] No horizontal overflow

[ ] Keyboard navigation checked

[ ] Focus states checked

[ ] Colour contrast checked

[ ] Semantic structure checked

[ ] Forms checked if relevant

[ ] Links checked if relevant

[ ] Console checked

[ ] Build passes

[ ] Lint passes

[ ] Typecheck passes

[ ] Existing functionality preserved

[ ] Brand rules respected

[ ] No unnecessary dashes introduced

[ ] No placeholder content left behind

[ ] No unintended visual regression


Only include checks that were genuinely performed.

---

# 94. FINAL RESPONSE FORMAT

After completing a task, give a concise technical report using this structure:

## Completed

What was implemented.

## Files changed

List changed files.

## Brand impact

Explain whether existing design was preserved or which approved pattern was added.

## Responsive

Mention tested viewport widths.

## Accessibility

Mention relevant WCAG checks.

## QA

List actual tests performed.

## Issues found

Mention any existing unrelated issues discovered.

## Not changed

Explicitly mention important adjacent elements intentionally left untouched.

Do not produce a long essay unless requested.

---

# 95. ABSOLUTE DO-NOT LIST

Unless explicitly requested, NEVER:

* redesign the complete website
* change the primary brand colours
* change the logo
* replace fonts
* rewrite complete pages
* reorganise navigation
* alter URLs
* replace the component architecture
* introduce a different CSS framework
* add a large dependency
* remove analytics
* remove accessibility functionality
* remove structured data
* create unnecessary animations
* use emojis in the UI
* invent performance claims
* invent sustainability claims
* invent ROI
* invent technical specifications

---

# 96. MASTER DEVELOPMENT PRINCIPLE

Every future task should follow this workflow:


UNDERSTAND
↓
INSPECT EXISTING IMPLEMENTATION
↓
READ BRAND RULES
↓
IDENTIFY SMALLEST REQUIRED CHANGE
↓
IMPLEMENT MOBILE FIRST
↓
VERIFY WCAG
↓
VERIFY SEO IMPACT
↓
VERIFY FUNCTIONALITY
↓
RUN QA
↓
CHECK VISUAL REGRESSION
↓
REPORT EXACT CHANGES


---

# 97. PRIMARY OBJECTIVE

The objective is not merely to create a technically functioning website.

The objective is to maintain a consistent digital platform that presents Lemnion as:

> The specialised hospitality energy partner that helps hotels intelligently manage, store and use energy.

Every technical, visual and content decision should support that position.

---

# 98. PERMANENT RULE FOR FUTURE HERMES TASKS

For EVERY future request related to the Lemnion website:

Do not start by generating code.

First:

1. Inspect the relevant existing files.
2. Understand how the current implementation works.
3. Read the relevant brand documentation.
4. Identify existing reusable components and tokens.
5. Determine whether the requested change could affect mobile, accessibility, SEO or existing functionality.
6. Then implement the smallest correct change.

Never rebuild something simply because rebuilding it is easier than understanding the existing implementation.

---

# 99. DEFINITION OF DONE

A task is complete only when:

* the requested outcome works
* existing functionality still works
* branding remains consistent
* mobile behaviour is correct
* accessibility has not deteriorated
* SEO has not unintentionally deteriorated
* no unrelated design changes have been introduced
* design tokens are respected
* the codebase remains maintainable
* relevant QA has actually been performed

---

# FINAL INSTRUCTION
Treat this document as the permanent Lemnion Website Operating System.

Every future change must preserve the integrity of:

Brand + UX + Accessibility + Mobile + SEO + Performance + Technology + Content.

When in doubt:

> Use the existing Lemnion system rather than inventing a new one.
