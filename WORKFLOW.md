# VoiceDocs — Document Workflow (how a template becomes a saved document)

## The flow

```
1. /templates            → user picks a template  (templateId: invoice|quote|ndis|meeting|soap|report|email|contract)
        │  link: /record?template=<templateId>
        ▼
2. /record  (Recorder)   → tap mic → speak → tap stop
        │  • live transcript captured via the browser Web Speech API
        │  • saved to sessionStorage as  vd:capture = { templateId, transcript, seconds }
        │  → navigates to /preview?template=<templateId>
        ▼
3. /preview (PreviewFlow) → reads vd:capture, calls the API:
        │  POST /api/documents/generate  { templateId, transcript, durationSec }
        ▼
4. /api/documents/generate (server)
        │  • requires a logged-in session (else 401)
        │  • generateDocument(templateId, transcript)  →  Claude Haiku (if ANTHROPIC_API_KEY) OR mock
        │  • creates a Document in MongoDB, scoped to the user
        ▼
5. Document saved → rendered by DocumentView → also appears in /documents and on the dashboard
```

## What gets saved (MongoDB → database `voicedocs` → collection `documents`)

Each generated document is one record:

| Field | Example | Notes |
|---|---|---|
| `userId` | (your account id) | scopes the doc to you — security |
| `type` | `"invoice"` | **this is the template** chosen |
| `title` | `"Tax Invoice — 2 Jun 2026"` | from the AI |
| `status` | `"Draft"` | Draft → Sent → Viewed → Paid… |
| `data` | see below | the structured content |
| `transcript` | `"Kitchen reno for John…"` | what you said |
| `durationSec` | `84` | length of the recording |
| `clientName` | `"John Smith"` | extracted by AI (if mentioned) |
| `totalAmount` | `2975.5` | invoices/quotes only |
| `currency` | `"AUD"` | |
| `generatedByAI` | `true` | |
| `createdAt` / `updatedAt` | timestamps | |

## What each template produces in `data`

**Money documents — Invoice & Quote** → line items + GST totals:
```json
{
  "items": [{ "description": "Labour", "qty": 24, "unitPrice": 85, "amount": 2040 }],
  "totals": { "subtotal": 2705, "gst": 270.5, "total": 2975.5 }
}
```

**Text documents — NDIS, Meeting, SOAP, Report, Email, Contract** → headed sections:
```json
{
  "sections": [
    { "heading": "Subjective", "body": "…" },
    { "heading": "Objective", "body": "…" }
  ]
}
```
Section headings are tailored per template (e.g. SOAP = Subjective/Objective/Assessment/Plan; NDIS = Participant/Goals/Observations/Actions/Recommendations).

## So: "what template will it save?"
It saves the document with **`type` = the template you picked** on the `/templates` screen,
and the `data` is shaped for that template (table for invoice/quote, sections for the rest).
You can see them all under **My Documents**, filtered by type.
```
```
