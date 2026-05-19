---
slug: /demo
title: Request a demo
meta_title: "Request a demo | DebtNext"
meta_description: "Schedule a 30-minute walkthrough of dPlat scoped to your portfolio, vendor mix, and operational requirements. Run by platform specialists, not generic sales reps."
primary_cta: "Submit"
primary_cta_href: null
secondary_cta: null
status_flags: ["[CLAIMS REVIEW] on form privacy language", "Coordination needed with Austin Johnson on Zoho integration"]
---

# Request a demo

## Hero

**Eyebrow**: Request a demo

**H1**: See dPlat against your portfolio.

**Body**: A 30-minute walkthrough scoped to your portfolio type, vendor mix, and operational pain points. We'll show you the modules that match your use case. No generic feature catalog tour.

**Hero media**: Atmospheric dark canvas, no specific subject.

---

## Demo form

**Section layout**: Two-column on desktop. Left column: form. Right column: "what to expect" panel.

**Left column: form fields**

The form posts to Zoho CRM via webhook (Austin owns the integration). All fields required unless marked optional.

| Field | Type | Validation |
|---|---|---|
| First name | Text | Required, 2-50 chars |
| Last name | Text | Required, 2-50 chars |
| Work email | Email | Required, work domains only (block common free-mail domains) |
| Company | Text | Required, 2-100 chars |
| Job title | Text | Required, 2-100 chars |
| Industry | Select | Required. Options: Utilities, Financial services, Telecom, Fintech, Healthcare, Government, Other |
| Portfolio size (optional) | Select | Optional. Options: Under $50M, $50M-$250M, $250M-$1B, Over $1B, Prefer not to say |
| What you'd like to see | Textarea | Optional, max 500 chars |

**Submit button label**: "Request a demo"

**Below the form**: Small reassurance line in `#a1a1aa`:
"We'll respond within one business day. Your information is used only to coordinate the demo and follow-up conversation. See our privacy policy."

`[CLAIMS REVIEW]` Andrew to approve privacy line and consent treatment. Confirm whether explicit consent checkbox is needed for the email domains we'll target.

---

**Right column: what to expect panel**

A vertical card with dark elevated surface, padding 32px.

**Card heading**: What to expect

**3-step list with thin connectors between items**:

**1. We'll respond within one business day**
A platform specialist will reach out to schedule the walkthrough at a time that works for you.

**2. 30 minutes, scoped to your portfolio**
We'll cover the modules that match your use case. Bring questions about your current operational pain points.

**3. Honest feedback on fit**
If dPlat isn't the right answer for your situation, we'll say so. We'd rather have a clear conversation than chase a deal that won't work.

---

## Security reassurance band

**Section background**: Dark elevated

**H2**: Your information stays with the team running the demo.

**3 small reassurance points** with token-style icons:

**No sales spam**
Your contact information is used to coordinate the demo and follow-up conversation. Period.

**No data sharing**
We don't sell or share your information with third parties.

**Easy opt-out**
If you'd like to be removed from any future contact at any point, one email to us takes care of it.

`[CLAIMS REVIEW]` Andrew to verify privacy claims match the company privacy policy. Confirm "no sales spam" framing.

---

## Form behavior specifications

**Loading state**: When the submit button is clicked, disable the form, show a spinner inside the button, and display "Submitting..." as the button label.

**Success state**: Replace the form with a confirmation panel:

> Thanks. We received your request and will be in touch within one business day.
> 
> If you'd like to add context before we reach out, reply to the confirmation email (sent to the address you provided).

**Error states**:

- Network error: "Something went wrong on our end. Please try again, or email demo@debtnext.com directly."
- Validation error per field: inline error message under the field, in `#ef4444`, with the specific issue ("Work email required" / "Please use your work email").
- Spam/duplicate detection: "We've already received a request from this email. We'll be in touch shortly."

**Analytics events**:
- `form_start` fires on first field interaction
- `form_submit` fires on successful submission
- `form_error` fires on validation or network error with field and error type

---

## SEO

**Meta title**: Request a demo | DebtNext
**Meta description**: Schedule a 30-minute walkthrough of dPlat scoped to your portfolio, vendor mix, and operational requirements. Run by platform specialists, not generic sales reps.
**Canonical**: `https://debtnext.com/demo`
**Schema**: `ContactPage`
**robots**: `index, follow` (the demo page is meant to be findable)
