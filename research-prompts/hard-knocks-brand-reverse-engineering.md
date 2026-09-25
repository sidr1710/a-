# Brand Reverse-Engineering Prompt: "Hard Knocks"-Style Content Brands, Adapted for India

A structured, multi-stage research prompt. Paste it into a research-capable AI (Claude with web search, Perplexity, ChatGPT Deep Research, Gemini Deep Research). Run **one stage at a time** and feed each stage's output into the next.

> **Before you start, pick the target.** "Hard Knocks" can mean different things:
> - **School of Hard Knocks (SOHK)**: the YouTube/Shorts channel that stops successful people on the street and asks what they do and how they made it.
> - **HBO's *Hard Knocks***: the NFL behind-the-scenes documentary series.
>
> This prompt assumes the first. If you meant something else, change `{TARGET_BRAND}`.

---

## 0. Variables (fill these in first)

```
{TARGET_BRAND}      = School of Hard Knocks (SOHK)
{COMPARABLE_BRANDS} = Daniel Mac, Humans of New York, Alex Hormozi, Diary of a CEO, Colin & Samir
{INDIA_BRANDS}      = Raj Shamani (Figuring Out), Ankur Warikoo, Nikhil Kamath (WTF), BeerBiceps/TRS, Josh Talks, Humans of Bombay
{MY_NICHE}          = e.g. tech founders / startups / students / engineers in India
{MY_CITY}           = e.g. Delhi, Mumbai, Bengaluru
{MY_LANGUAGE}       = e.g. Hinglish / Hindi / English
{MY_RESOURCES}      = e.g. 1 phone + mic, ₹10k/month, 10 hrs/week
{MY_GOAL}           = e.g. personal brand + global network of founders and investors in 12 months
```

---

## 1. Master system prompt (paste once at the start of the session)

```
ROLE
You are a senior technology and media strategy architect who specialises in reverse
engineering digital media businesses. You have run content and growth for creator-led
brands, you understand platform algorithms (YouTube, Instagram, LinkedIn, X), and you
understand creator-economy business models (ads, sponsorships, events, communities,
courses, equity deals, media holding companies).

MISSION
Reverse engineer {TARGET_BRAND}: what it does, how it does it, the structure behind it,
and how it makes money. Then turn that into a practical playbook that I can run in India
for {MY_NICHE}.

ACCURACY RULES (these override everything else)
1. Separate FACTS from INFERENCES. Tag every claim with one of:
   [VERIFIED: source + date] | [INFERRED: reasoning] | [UNKNOWN]
2. Never invent numbers (revenue, views, follower counts, deal sizes, valuations).
   If you can't find a number, write [UNKNOWN] and explain how I could estimate it
   (Social Blade, sponsor rate cards, public interviews, company registries).
3. Prefer primary sources: the founders' own interviews and podcasts, official channels,
   company filings, and press with named sources. Label secondary sources as secondary.
4. Give every source's date. Creator businesses change quickly, so flag anything older
   than 18 months as possibly out of date.
5. If sources disagree, show both and say which you trust more and why.
6. End every answer with: "Confidence: High/Medium/Low" and "What I could not verify".

OUTPUT STYLE
Tables and numbered frameworks, not essays. Short sentences. Actionable over descriptive.
```

---

## 2. Stage-by-stage research prompts

### Stage 1: Origin story and founder DNA
```
Research the origin of {TARGET_BRAND}.
- Who founded it, when, and what were they doing before? What was their unfair advantage?
- What was the first piece of content? What did the first 50 videos look like compared
  with today?
- Find the inflection point: which video, format change or platform shift took it from
  small to large? Give dates and approximate subscriber counts at each stage.
- What is the founders' stated mission compared with the mission their actions imply?
- Timeline table: Date | Milestone | Platform | Metric | Source
```

### Stage 2: Content format anatomy
```
Break down the core formats of {TARGET_BRAND} as if you were writing a production
manual for a new team member.
For each format (street interviews, long-form, shorts, podcasts, etc.):
1. Structure beat by beat (0-3s hook, 3-15s, middle, ending/CTA), with timestamps
   from 3 real example videos (include links)
2. The opening question formula (e.g. "What do you do for a living?") and why it works
   psychologically: curiosity gap, status, aspiration, voyeurism
3. Who they pick as guests: how they choose, approach and qualify them
4. Visual language: camera, framing, captions, B-roll, location choice
5. Editing rules: cut frequency, text overlays, music, length
6. How one shoot is split across platforms (long → shorts → reels → posts)
7. Titles and thumbnails: collect 20 top titles and pull out the reusable patterns
Output a "Format Spec Sheet" table I could hand to an editor.
```

### Stage 3: Distribution and algorithm strategy
```
Analyse how {TARGET_BRAND} distributes content.
- Platform-by-platform: follower counts, posting frequency, format mix, what performs best
- Shorts vs long-form: how do they use shorts to feed long-form and the funnel?
- Collaborations, cross-posts, guest amplification (do guests re-share?)
- Hashtags, SEO and keyword patterns in titles and descriptions
- Any evidence of paid distribution, clipping networks or repost-page partnerships
- Their top 10 most-viewed pieces of content: what they have in common
Tag each item [VERIFIED]/[INFERRED].
```

### Stage 4: Business model and money map
```
Reverse engineer the business model behind {TARGET_BRAND}.
Draw the money map: Attention → Trust → Monetisation.
For each revenue stream (ad revenue, sponsorships, brand deals, events, courses,
communities, investments or equity in guests' companies, agency or production services,
merch, speaking):
| Stream | Evidence | Est. contribution | How they sell it | Source | Confidence |
- Who are their known sponsors and partners? What kind of brands pay them?
- Is there a holding company, fund or sister brands? Map the corporate structure if public.
- How does content lead into deal flow, network or business opportunities for the founders?
- Estimate economics per video (production cost vs revenue) and SHOW YOUR WORKINGS.
```

### Stage 5: Positioning and brand architecture
```
Analyse the positioning of {TARGET_BRAND}.
- Positioning statement: "For ___ who ___, {TARGET_BRAND} is the ___ that ___ unlike ___"
- Brand archetype (Sage, Explorer, Ruler...) and the evidence for it
- Core narrative: what belief about success, money and work do they sell?
- Audience psychographics: who watches, why, and what they want to become
- Brand assets: name, catchphrases, visual identity, recurring characters or hosts
- The moat: what stops competitors copying it? (network, library, trust, speed, brand)
- Weaknesses and criticism: authenticity debates, staged-content accusations, ethics
```

### Stage 6: Network-building engine
```
Explain how {TARGET_BRAND} uses content as a networking machine.
- How does interviewing high-status people build the founders' own network?
- Content as a "door opener": an interview request as a low-risk first contact
- The path from guest to relationship to deal or partnership, with documented examples
- Community, events or masterminds built on the audience
- The reciprocity loop: what guests get (exposure, credibility, clips)
Give me a 5-step "Content-Led Networking System" I can copy.
```

### Stage 7: Competitive landscape (global and India)
```
Compare {TARGET_BRAND} with {COMPARABLE_BRANDS} and {INDIA_BRANDS}.
Matrix: Brand | Format | Platform strength | Audience | Monetisation | Positioning | Gap
Then answer:
- What in India is already saturated? (e.g. generic "salary kitna hai" street interviews)
- Which angles are underserved in India? Think tier-2/3 cities, regional languages,
  specific industries, founders outside Bengaluru, women founders, blue-collar
  entrepreneurs, NRIs coming back, deep tech, D2C, family businesses.
- Where can {MY_NICHE} win specifically?
```

### Stage 8: India adaptation playbook
```
Turn everything above into an India-specific playbook for me.
Context: niche={MY_NICHE}, city={MY_CITY}, language={MY_LANGUAGE},
resources={MY_RESOURCES}, goal={MY_GOAL}.

Cover:
1. Cultural translation: what works in the US but fails in India (flaunting money,
   privacy norms, how people react to street cameras), and what works better in India
   (family stories, jugaad, exam and career pressure, first-generation entrepreneurs)
2. Legal and ethical checklist for India: consent and release forms, filming in public
   places, DPDP Act 2023 considerations, ASCI influencer disclosure rules, music
   copyright, filming permissions in metro stations and malls
3. Language strategy: Hinglish vs English vs regional, subtitles, dubbing
4. Platform priority for India: YouTube Shorts, Instagram Reels, LinkedIn, X,
   WhatsApp Channels, Moj/Josh. Rank them and say why.
5. My format: 3 signature format concepts with names, hooks and sample questions
6. Minimum viable production setup within {MY_RESOURCES}
7. Monetisation ladder for India: sponsorship rates in INR, and which brands buy in
   {MY_NICHE}
8. How to go from Indian network to global network: guest selection that bridges into
   the US, Middle East and SEA, and collabs with global creators
```

### Stage 9: 90-day execution plan
```
Build a 90-day plan:
- Weeks 1-2: positioning, name, handles, setup, first 10 test shoots
- Weeks 3-6: publishing cadence, A/B testing hooks, measuring what works
- Weeks 7-12: double down on winners, first collab, first sponsor pitch
Include: weekly KPIs (hook retention, 3-second hold, shares, saves, follower growth,
DMs from high-value people), a content calendar template, a guest pipeline tracker,
and kill/keep criteria for formats.
```

### Stage 10: Red-team review
```
Act as a sceptical investor and a veteran Indian creator. Critique the playbook:
- What is most likely to fail and why?
- Which assumptions are unverified?
- What are the 3 highest-leverage moves I should do first?
- What would you cut completely?
```

---

## 3. One-shot version (if you want a single prompt)

```
Act as a senior technology and media strategy architect who reverse engineers
creator-led media businesses. Reverse engineer {TARGET_BRAND} across: (1) origin and
founder DNA, (2) content format anatomy (hooks, beats, question formulas, editing,
titles and thumbnails), (3) distribution and algorithm strategy, (4) business model and
revenue streams, (5) positioning and brand architecture, (6) how content powers their
networking and deal flow, (7) comparison with {COMPARABLE_BRANDS} and {INDIA_BRANDS}.
Then give me an India adaptation playbook for {MY_NICHE} in {MY_CITY} using
{MY_LANGUAGE}, with {MY_RESOURCES}, aiming for {MY_GOAL}: cultural translation, legal
checklist (consent, DPDP Act, ASCI disclosures), platform priority, 3 signature
formats, monetisation in INR, a path from Indian network to global network, and a
90-day plan with KPIs.
Rules: tag every claim [VERIFIED: source, date] / [INFERRED] / [UNKNOWN]; never invent
numbers; prefer primary sources; use tables; end with confidence level and a list of
what you could not verify.
```

---

## 4. How to get the most accurate results

1. **Use a tool with live web search.** Models without browsing will guess at numbers.
2. **Run the stages in order** and paste earlier outputs as context ("Here is Stage 2 output: ...").
3. **Check the sources yourself.** Open 3–5 cited links per stage. If a link doesn't say what the AI claims, reply: *"Source X does not support claim Y. Re-check and correct."*
4. **Collect primary data yourself.** Watch 10 of their videos and note timestamps. Check Social Blade for growth curves and look up founder interviews on podcasts. Feed your notes back in.
5. **Cross-check across two AIs.** Run the same stage in two tools and compare. Where they disagree, find out which one is right.
6. **Keep a research log** (Notion or Google Sheet): Claim | Source | Date | Verified? | Used in playbook?
