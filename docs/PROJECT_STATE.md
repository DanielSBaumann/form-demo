# PROJECT_STATE: form-demo

Updated: 2026-10-13 20:30  
Mode: NEW  
Stack: TypeScript, Lambda, DynamoDB, Cloudflare Pages  
Architecture level: small service

## Current phase

`0 Preflight | 1 Plan | 2 POC | **3 Rewrite** | 4 Sandbox | 5 Verify | 6 Prod gate | 7 Report`

## Status

| Phase | State | Notes |
|---|---|---|
| 0 Preflight | ✅ done | AWS auth verified, all tools ready |
| 1 Plan | ✅ done | Brief approved, architecture finalized |
| 2 POC | ✅ done | Frontend tested locally (http://localhost:8000), Lambda ready, Terraform defined |
| 3 Rewrite | 🔄 in_progress | Extract magic values, add validation tests, clean code |
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
- Phase 2 POC: Frontend loads locally at http://localhost:8000 ✅
- Phase 2 POC: Backend compiles (npm run build) ✅
- Phase 2 POC: 1 commit (76e1a50) with all POC code

## Still mocked

- None (all code is real, awaiting deployment to test against live DynamoDB)

## Open items / blockers

- [ ] Extract environment constants from script.js (API_ENDPOINT)
- [ ] Extract magic values from Lambda handler (validation limits)
- [ ] Add integration tests for form validation
- [ ] Test Lambda locally with mock DynamoDB
- [ ] Set up .env with actual credentials for deployment

## Rollback

N/A (not deployed yet)

---

## Brief Reference

See `../../briefs/form-demo-brief.md`
