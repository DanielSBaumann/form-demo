# CI/CD Infrastructure Refactor Plan

**Status:** ⏸️ **PAUSED** — Reorganizing before Phase 6 & 7

**Decision:** Fix infrastructure separation, GitHub Actions, and Cloudflare deployment issues **before** proceeding to production.

---

## Current State

### ✅ WORKING (Verified in Phase 5)

| Component | Status | Evidence |
|-----------|--------|----------|
| **AWS Infrastructure** | ✅ LIVE | Lambda, API Gateway, DynamoDB deployed via Terraform |
| **Backend API** | ✅ WORKING | POST `/api/submit` → stores to DynamoDB ✓ |
| **Data Persistence** | ✅ WORKING | GET `/api/submissions` → retrieves from DynamoDB ✓ |
| **Frontend Code** | ✅ READY | HTML/CSS/JS compiled, tested locally ✓ |
| **Backend Code** | ✅ READY | TypeScript compiles, 8/8 unit tests passing ✓ |
| **Manual Deployment** | ✅ WORKS | `bash scripts/deploy.sh sandbox form-demo` successful ✓ |

**Live Sandbox URL:** https://ki694yjl43.execute-api.us-east-1.amazonaws.com/sandbox/api

### ❌ NOT WORKING (Needs Fix)

| Issue | Root Cause | Impact |
|-------|-----------|--------|
| **GitHub Actions Workflow Failed** | AWS OIDC role `GitHubActionsLambdaRole` not created | Can't auto-deploy from `git push` |
| **Cloudflare Pages Deployment** | wrangler.toml issues + CI/CD setup incomplete | Frontend not accessible via Pages URL |
| **Infrastructure Versioning** | Infra code mixed with app code | Hard to maintain, update, and scale |

---

## Fix Plan (In Order)

### Phase A: Infrastructure Separation (**NEXT**)

**Goal:** Move Terraform to separate repository so infrastructure is versioned independently.

```
CURRENT STATE:
form-demo/
├── backend/
├── frontend/
└── infra/              ← Problem: mixed with app

DESIRED STATE:
form-demo-infra/       ← NEW REPO (separate, independent)
└── terraform/

form-demo/
├── backend/
└── frontend/
```

**Steps:**
1. Create new GitHub repo: `form-demo-infra`
2. Move `infra/` folder contents there
3. Create GitHub Actions workflow for Terraform
4. Push and test

**Time:** ~30 minutes

---

### Phase B: AWS GitHub Actions Setup (**AFTER INFRA REPO**)

**Goal:** Enable GitHub Actions to deploy infrastructure and Lambda updates automatically.

**What needs to happen:**
1. Create IAM role: `GitHubActionsLambdaRole`
2. Configure GitHub OIDC trust relationship
3. Grant minimal permissions (Terraform, Lambda update)

**Workflows:**
- `form-demo-infra/.github/workflows/deploy.yml` → Runs Terraform
- `form-demo/.github/workflows/deploy.yml` → Updates Lambda + Cloudflare Pages

**Time:** ~45 minutes (if AWS setup is clear) or ~2 hours (if OIDC setup is new)

---

### Phase C: Fix Cloudflare Pages Deployment (**PARALLEL TO PHASE B**)

**Goal:** Get `wrangler pages deploy` working reliably in GitHub Actions.

**Known issues to fix:**
1. ✅ wrangler.toml configuration → **ALREADY FIXED**
2. ⚠️ GitHub secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID) → **NEED TO VERIFY**
3. ⚠️ wrangler command in GitHub Actions → **NEED TO TEST**

**Test once Phase B is done:**
```bash
git push form-demo/main
→ GitHub Actions triggers
→ Cloudflare Pages deploys frontend
→ Verify at https://form-demo-sbx.pages.dev
```

**Time:** ~20 minutes (if secrets are correct)

---

### Phase D: Test Full CI/CD Pipeline (**AFTER B & C**)

**Goal:** Verify that changes in infra repo and app repo deploy correctly.

**Test scenarios:**
1. Change `infra/terraform/main.tf` → `git push form-demo-infra/main` → Terraform applies ✓
2. Change `backend/src/index.ts` → `git push form-demo/main` → Lambda updates ✓
3. Change `frontend/index.html` → `git push form-demo/main` → Cloudflare Pages updates ✓

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| A: Infrastructure Separation | ~30 min | 🔄 NEXT |
| B: AWS OIDC Setup | ~45-120 min | ⏸️ After A |
| C: Cloudflare Fix | ~20 min | ⏸️ After B |
| D: Full Test | ~20 min | ⏸️ After B & C |
| **Then:** Phase 6 & 7 | — | ⏸️ After all |

**Total time:** ~2-3 hours to fix everything

---

## Why This Approach is Better

✅ **Infrastructure versioning** — Changes tracked separately  
✅ **Team scaling** — Ops team manages infra, app team manages code  
✅ **Disaster recovery** — Rebuild infrastructure from single repo  
✅ **Cost tracking** — Infrastructure costs tracked independently  
✅ **No credential secrets in app repo** — Only in infra repo  
✅ **Reusable pattern** — All future projects follow this structure  

---

## Command Reference (After Fix)

```bash
# Infrastructure changes
cd form-demo-infra
git push origin main
# → Automatically deploys to AWS

# Application changes  
cd form-demo
git push origin main
# → Automatically deploys backend to Lambda
# → Automatically deploys frontend to Cloudflare Pages
```

---

## Ready to Proceed?

**Next step:** Create `form-demo-infra` repository and move infrastructure code there.

Once this is done and tested, we'll have a rock-solid CI/CD pipeline that can scale to 10+ projects.
