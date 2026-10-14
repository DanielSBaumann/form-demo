# PROJECT_STATE: form-demo

Updated: 2026-10-13 20:30  
Mode: NEW  
Stack: TypeScript, Lambda, DynamoDB, Cloudflare Pages  
Architecture level: small service

## Current phase

`0 Preflight | 1 Plan | 2 POC | 3 Rewrite | 4 Sandbox | 5 Verify | ⏸️ **CI/CD SETUP** | 6 Prod Gate | 7 Report`

## Status: PAUSED FOR CI/CD INFRASTRUCTURE REFACTOR

### ✅ What's Working
| Component | Status | Evidence |
|-----------|--------|----------|
| **AWS Infrastructure** | ✅ Live | Lambda, API Gateway, DynamoDB deployed & verified |
| **Backend API** | ✅ Live | POST/GET working, data persisting in DynamoDB |
| **Backend Code** | ✅ Ready | TypeScript compiles, unit tests 8/8 passing |
| **Frontend Code** | ✅ Ready | HTML/CSS/JS ready, tested locally at localhost:8000 |
| **Manual Deployment** | ✅ Works | `bash scripts/deploy.sh sandbox form-demo` successful |

### ❌ What's NOT Working
| Component | Issue | Impact |
|-----------|-------|--------|
| **GitHub Actions Workflow** | AWS OIDC role not configured | Can't auto-deploy from git |
| **Cloudflare Pages Deployment** | Wrangler config issues + CI/CD setup incomplete | Frontend not auto-deployed |
| **Infrastructure as Code Pipeline** | Infra code mixed with app code, no separate deployment | Hard to maintain & version |

### 🎯 What We Need to Fix (In Order)

1. **Separate Infrastructure Repository**
   - Move Terraform to dedicated `form-demo-infra` repo
   - Version infrastructure separately from app
   - Enables independent infra updates

2. **AWS GitHub Actions Setup**
   - Configure OIDC role for GitHub Actions
   - Create infrastructure deployment workflow
   - Create Lambda deployment workflow

3. **Cloudflare Pages Deployment**
   - Fix wrangler configuration once and for all
   - Verify Cloudflare secrets setup
   - Test deployment pipeline

4. **Unified CI/CD Testing**
   - Test full pipeline: git push → all services deployed
   - Verify health checks

5. **Resume Phases 6 & 7**
   - Production gate & approval
   - Delivery report

## Decisions

- 2026-10-13: No auth in MVP (add in round 2)
- 2026-10-13: Include timestamps (`createdAt`) on all submissions
- 2026-10-13: Show all submissions in one list (no pagination for MVP)
- 2026-10-13: No delete button in MVP

## Environments

| Env | URL | Hosting | Resources (tagged) | Cost/month |
|---|---|---|---|---|
| local | `http://localhost:3000` | N/A | None | $0 |
| sandbox | **https://ki694yjl43.execute-api.us-east-1.amazonaws.com/sandbox** | AWS Lambda + API GW + DynamoDB | ✅ All deployed | $0 (free tier) |
| prod | TBD | Cloudflare Pages + Lambda | TBD | < $1 |

## Test evidence

- Phase 0: `bash scripts/preflight.sh` → 0 FAIL, 1 WARN (all systems green)
- Phase 2 POC: Frontend loads locally at http://localhost:8000 ✅
- Phase 2 POC: Backend compiles (npm run build) ✅
- Phase 3: Unit tests passing (8/8 validation tests) ✅
- Phase 4: Terraform deployed 6 resources successfully
- Phase 5: Live API tests
  - POST /api/submit: ✅ Stored to DynamoDB with UUID & timestamp
  - GET /api/submissions: ✅ Retrieved from DynamoDB
  - Response format: Correct JSON with all fields

## Still mocked

- None (all code is real, awaiting deployment to test against live DynamoDB)

## NEXT STEPS (CI/CD Refactor)

### Immediate Actions (Do Before Phase 6)
- [ ] **STEP 1:** Create separate `form-demo-infra` repository
  - Move `infra/` folder to new repo
  - Create GitHub Actions workflow for Terraform deployment
  - Test: `git push infra-repo → Terraform applies`

- [ ] **STEP 2:** Configure AWS GitHub Actions OIDC
  - Create IAM role for GitHub Actions
  - Link GitHub repo to AWS account via OIDC
  - Grant minimal permissions (Lambda update, Terraform)

- [ ] **STEP 3:** Fix Cloudflare Pages Deployment
  - Debug wrangler configuration
  - Verify secrets are correct
  - Test: `git push app-repo → Cloudflare deploys`

- [ ] **STEP 4:** Create unified deployment workflow
  - `form-demo-infra` repo → Terraform
  - `form-demo` repo → Backend (Lambda) + Frontend (Pages)
  - Both triggered by git push

- [ ] **STEP 5:** Test full pipeline end-to-end
  - Make change in infra repo → infrastructure updates
  - Make change in app repo → app updates
  - Verify no conflicts or failures

### After CI/CD is Fixed
- [ ] Resume Phase 6: Production Gate
- [ ] Phase 7: Delivery Report

## Rollback

N/A (not deployed yet)

---

## Brief Reference

See `../../briefs/form-demo-brief.md`
