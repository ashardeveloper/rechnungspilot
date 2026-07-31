# RechnungsPilot DE — Public Competitor Workflow Matrix

Status: Desk-research snapshot  
Access date: 2026-07-31

All capabilities below are self-reported by the respective vendor. This matrix
proves public feature availability, not customer satisfaction or market demand.
Pricing is intentionally not used for positioning because it changes frequently.

| Capability | Lexware Office | sevdesk | Papierkram | RechnungsPilot DE portfolio target |
|---|---|---|---|---|
| Customer/master data | Yes | Yes | Yes | Yes |
| Draft invoice workflow | Yes | Yes | Publicly documented | Yes |
| Finalized invoice immutability/correction | Storno workflow listed | Mahnung/accounting workflow | Explicit draft/final/cancel model | Explicit immutable snapshot and tested state machine |
| XRechnung generation | Yes | Yes | Yes | XRechnung 3.0.2 UBL 2.1 |
| ZUGFeRD generation | Yes | Yes | Yes | Later: ZUGFeRD 2.5 only |
| Missing-field guidance | Yes | XML/pflicht-field checks described | Additional BT fields exposed | Rule-to-form-field mapping with rule identifiers |
| Incoming structured invoice | Yes | Yes, plan-dependent details | Yes | Secure upload, validation, visualization |
| Validation | Integrated | Integrated | Integrated | Local KoSIT report preserved with versions |
| Human-readable XML visualization | Yes | Processing view | Explicitly documented | Canonical read-only viewer with source traceability |
| PDF preview | Yes | Yes | Yes | Same canonical data as XML |
| Sending | Live email/platform delivery | Live email/platform delivery | Email/customer portal | Mailpit simulation and secure download only |
| Payment status/reminders | Yes | Yes | Yes | Manual fictional payments and local reminder jobs |
| Full bookkeeping | Yes | Yes | Yes | Explicitly excluded |
| Banking/tax filing | Available by product/tier | Available by product/tier | Available by product/tier | Explicitly excluded |
| Deployment | Vendor cloud | Vendor cloud | Vendor cloud | Local Docker Compose |
| Standards-version transparency | Limited public details by workflow | Limited public details by workflow | Limited public details by workflow | Version shown and stored on every artifact/report |
| Validation provenance | Not established by reviewed public pages | Not established by reviewed public pages | Not established by reviewed public pages | Validator/config version, timestamp, artifact hash |

## Sources

- Lexware XRechnung workflow: https://www.lexware.de/funktionen/xrechnung/
- Lexware incoming E-invoice workflow: https://help.lexware.de/de-form/articles/548951-so-einfach-erfassen-sie-e-rechnungen-in-lexware-office
- sevdesk pricing/capabilities: https://sevdesk.de/preise/
- sevdesk E-invoice workflow: https://sevdesk.de/e-rechnung-software/
- Papierkram invoice lifecycle: https://hilfe.papierkram.de/rechnungen/
- Papierkram E-invoice workflow: https://hilfe.papierkram.de/e-rechnungen/

## Positioning conclusion

RechnungsPilot DE will not compete on feature count. Its portfolio distinction is:

1. transparent standards and validator versions;
2. deterministic PDF/XML consistency;
3. preserved validation provenance;
4. human-readable, actionable validation guidance;
5. explicit tenant-isolation and file-security tests;
6. reproducible local operation without paid accounts.

