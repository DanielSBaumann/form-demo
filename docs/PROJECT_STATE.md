# PROJECT_STATE: form-demo

Updated: 2026-10-13 20:30  
Mode: NEW  
Stack: TypeScript, Lambda, DynamoDB, Cloudflare Pages  
Architecture level: small service

## Current phase

`0 Preflight | 1 Plan | **2 POC** | 3 Rewrite | 4 Sandbox | 5 Verify | 6 Prod gate | 7 Report`

## Status

| Phase | State | Notes |
|---|---|---|
| 0 Preflight | ✅ done | AWS auth verified, all tools ready |
| 1 Plan | ✅ done | Brief approved, architecture finalized |
| 2 POC | 🔄 in_progress | Building minimal form + Lambda mock |
| 3 Rewrite | pending | Extract constants, add error handling |
| 4 Sandbox deploy | pending | Terraform → AWS Lambda + DynamoDB |
| 5 Online verification | pending | Test live form submission |
| 6 Prod gate | pending | Await approval |
| 7 Report | pending | Delivery report |

## Decisions

- 2026-10-13: No auth in MVP (add in round 2)
- 2026-10-13: Include timestamps (`createdAt`) on all submissions
- 2026-10-13: Show all submissions in one list (no pagination for MVP)
- 2026-10-13: No delete button in MVP

## Environments

| Env | URL | Hosting | Resources (tagged) | Cost/month |
|---|---|---|---|---|
| local | `http://localhost:3000` | N/A | None | $0 |
| sandbox | `form-demo-sbx.pages.dev` | Cloudflare Pages + Lambda | Lambda, API GW, DynamoDB | $0 (free tier) |
| prod | `form-demo.dr4w.io` | Cloudflare Pages + Lambda | Lambda, API GW, DynamoDB | < $1 |

## Test evidence

- Phase 0: `bash scripts/preflight.sh` → 0 FAIL, 1 WARN (all systems green)

## Still mocked

- Lambda handler (will use local mock during POC)
- DynamoDB (will use mock client during POC)
- API responses (hardcoded JSON for testing)

## Open items / blockers

- [ ] Create frontend (index.html, style.css, script.js)
- [ ] Create Lambda handler (Node.js TypeScript)
- [ ] Set up Terraform (Lambda + API Gateway + DynamoDB)
- [ ] Create GitHub Actions workflow
- [ ] Write integration tests

## Rollback

N/A (not deployed yet)

---

## Brief Reference

See `../../briefs/form-demo-brief.md`
