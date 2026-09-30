# Higgsfield API: RivalDay cinematic draw-machine research

Verified 30 September 2026. Public primary sources only. No account creation, credentials, uploads, estimates authenticated to a user account, generation, or purchase performed. Prices are USD and configuration-specific; the authenticated estimate is the final authority.

## Recommendation

Build the functional ticket machine with native browser graphics and an authoritative private draw engine. Optionally use Higgsfield once during asset production for a generic urban establishing shot or atmospheric loop. A generated video should never decide the winner or contain participant names. Overlay the chosen name with native typography after the host engine commits the result.

Start with a reusable locally created, non-personal machine still, then test Kling 2.5 Turbo image-to-video. Budget at regular rates because current Kling promotional prices end October 1. A first pass of three 5-second 720p tests and one 10-second 1080p final costs approximately **$1.33 of generation usage** at published regular rates. The provider's minimum funding is **$5**. Funding and consumption are different: this is not a promise that every finished design costs $1.33, and no funds have been spent.

## Product and billing distinction

The API uses an independent prepaid dollar balance, without a required website subscription. Website plan credits and Unlimited access do not fund API calls. MCP and CLI connect to the website account and spend plan credits; they are a different billing path. The help center says API funds expire after one year, the minimum top-up is $5, and successful outputs must be downloaded because provider retention is at least seven days. DoP is described as priced per generation, rather than per second. No valid universal consumer-credit-to-API-dollar conversion was established.

Source: [Higgsfield API help, published September 16, 2026](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api)

## Model shortlist and rates

### Kling 2.5 Turbo Standard: cheap motion tests

- Image-to-video, 720p; use 5- or 10-second clips
- Current displayed rate: $0.0231/second, 45% promotional discount
- Published regular rate after October 1: $0.042/second
- Model ID: `kling-video/v2.5-turbo/standard/image-to-video`
- Sample body fields: `prompt`, `image_url`, `duration`, `cfg_scale`, `negative_prompt`
- The pricing prose confusingly mentions 1-second clips, but the authoritative model schema explicitly restricts duration to 5 or 10 seconds (default 5); use that schema

Source: [Standard model page](https://open.higgsfield.ai/models/kling-video/v2.5-turbo/standard/image-to-video/playground)

### Kling 2.5 Turbo Pro: economical final asset

- Image-to-video, 1080p; 5- or 10-second clips
- Current displayed rate: $0.0385/second
- Published regular rate after October 1: $0.07/second
- Model ID: `kling-video/v2.5-turbo/pro/image-to-video`
- Same documented input fields as the Standard example
- Native audio was not established on this endpoint; budget it as a silent visual asset and handle optional licensed sound separately

Source: [Pro model page](https://open.higgsfield.ai/models/kling-video/v2.5-turbo/pro/image-to-video/playground)

### Kling 3.0 Standard: newer alternative

The model page lists $0.0462/second promotional and $0.084/second regular after October 1. Its text-to-video API supports durations from 3 to 15 seconds, `sound` values `on`/`off`, `multi_shots`, and 16:9, 9:16 or 1:1. Sound defaults on, so explicitly disable it for a silent background. A resolution selector is not listed in this schema; do not infer a specific resolution from the price. Exact audio-dependent pricing for this endpoint was not independently resolved.

Sources: [pricing](https://open.higgsfield.ai/models/kling-video/v3.0/std/text-to-video/playground), [request schema](https://open.higgsfield.ai/models/kling-video/v3.0/std/text-to-video/api-reference)

### Seedance 2.0: premium comparison, token-priced

The text-to-video page specifies pre-discount billing at $0.014 per 1,000 video tokens for 480p/720p/1080p, and $0.008 for 4K. Tokens are the ceiling of generated seconds × width × height × 24 / 1024. The headline “from $0.0985/s” is not a 1080p quote. Assuming exactly 1280×720 output, a 5-second clip is 108,000 tokens or **$1.512 before discount**; at exactly 1920×1080, a 10-second clip is 486,000 tokens or **$6.804**. Three such 720p tests plus the 1080p final total **$11.34**, before discounts or taxes.

The schema supports 4–15 seconds, resolutions 480p/720p/1080p/4k and `generate_audio` (default true). No separate audio rate was shown in the inspected token-pricing text, so don't assume disabling sound produces a discount.

Sources: [token pricing](https://open.higgsfield.ai/models/bytedance/seedance-2.0/text-to-video/playground), [schema](https://open.higgsfield.ai/models/bytedance/seedance-2.0/text-to-video/api-reference)

### Cinema Studio 4.0: relevant creative option, integration unresolved

The model page lists 480p–720p and 4–30 seconds. Without video reference, pricing is $0.0214 per 1,000 tokens; with video reference, $0.01284 per 1,000, but both input and output video seconds count. At assumed 1280×720, 24 fps billing, no video input, a 10-second output is approximately **$4.6224 before discounts**. Its headline minimum $0.2057/second should not be treated as a 720p quote.

Source: [Cinema Studio pricing](https://open.higgsfield.ai/models/higgsfield/cinema-studio/4.0/playground)

**Documentation conflict:** Cinema Studio's API-reference body uses `@higgsfield-ai/client`, `HIGGSFIELD_API_KEY`, and Bearer authentication. The same page's sample uses `@higgsfield/client/v2` and `HF_CREDENTIALS`, matching the global docs. Resolve this with the vendor before implementation; do not combine these credential schemes or install the differently named package based only on this inconsistent page.

Source: [Cinema Studio API reference](https://open.higgsfield.ai/models/higgsfield/cinema-studio/4.0/api-reference)

### Other options / unverified items

Wan 3.0 text-to-video explicitly lists pre-discount rates of $0.05/second at 480p, $0.10 at 720p and $0.20 at 1080p. Source: [Wan 3.0](https://open.higgsfield.ai/models/alibaba/wan-3.0/text-to-video/playground)

DoP is named in current API help, but a current official model-specific dollar price and request schema were not located in this pass. Do not price or implement DoP from old consumer credit tables or third-party SDK aliases. Named camera presets shown in a web studio are not evidence that the same controls exist on every API endpoint.

## Proposed low-cost test authorization, not executed

| Deliverable | Quantity | Configuration | Regular price calculation | Today’s displayed promotion |
|---|---:|---|---:|---:|
| Camera-motion tests | 3 | 5s, 720p, Kling 2.5 Standard I2V | 3 × 5 × $0.042 = $0.63 | $0.3465 |
| Final atmospheric clip | 1 | 10s, 1080p, Kling 2.5 Pro I2V | 10 × $0.07 = $0.70 | $0.3850 |
| Total generation usage | 4 | 25 generated seconds | **$1.33** | **$0.7315** |

Assumptions: one existing rights-cleared input still; silent video; no paid image generation, upscale, video-reference input, additional variants or audio; each successful output billed once. Taxes, funding payment charges, source-art cost, CDN/storage/egress and implementation time are excluded because no applicable figures were verified. A successful but unattractive render still counts as a successful charged generation. A seamless loop may require another generation or editing, so “one final” is an output target, not a guarantee.

The promotion end date is published as October 1 with no verified cut-off timezone; no precise expiry hour is assumed.

A sensible future approval request is a one-time $5 funding cap, auto-top-up disabled, and a separate $2 generation cap for the initial four-job plan. Check authoritative estimates before submitting; stop on unexpected prices or configuration changes. Extra experiments need their own bounded approval. Do not rush spending because a promotion expires.

## Verified authentication and safe integration plan

Global REST docs specify `Authorization: Key KEY_ID:KEY_SECRET`. Their shell examples use **HF_API_KEY_ID** and **HF_API_KEY_SECRET**, and legacy headers `hf-api-key` / `hf-secret` remain accepted. New integrations should use Authorization. Keep keys out of browser/mobile code, URLs, logs, screenshots, and support messages.

Source: [Authentication](https://docs.higgsfield.ai/docs/authentication)

Official SDK conventions differ: TypeScript `@higgsfield/client/v2` uses **HF_CREDENTIALS=KEY_ID:KEY_SECRET**; Python `higgsfield-client` uses **HF_KEY=KEY_ID:KEY_SECRET**. TypeScript v2 is server-only. Choose one supported convention that the actual worker reads; putting arbitrary variables in `.env` is not sufficient.

Source: [Official client libraries](https://docs.higgsfield.ai/docs/how-to/sdk)

Proposed local preparation, to be completed by the authorized desktop worker: create/open a private environment file with empty fields only; user enters credentials without exposing them to chat or screenshots. Ensure this file and all `.env` variants are ignored by Git; only commit a blank example if desired. A plain local `.env` is not encrypted. Prefer an OS secret manager or encrypted environment where available. Never use `NEXT_PUBLIC_`, `VITE_`, browser localStorage, a client bundle, public build logs or a public repo for these values. Avoid displaying file contents or adding the credential to shell history. Any deployment credential setup requires separate authorization.

For this project, the best security arrangement is **build-time asset generation only**: a local/server worker produces a generic video once; the app serves the approved downloaded MP4/WebM and never needs a runtime Higgsfield secret. If live generation is ever added, use an authenticated server endpoint with strict model/duration allowlists, spend controls, and no public generic proxy.

The estimate pattern is POST `https://api.higgsfield.ai/estimate/{model-id}` with the proposed input. Its `usd` field is authoritative for the authenticated account; example `credits` values do not establish a universal conversion. Failed or moderated jobs are not charged; cancellation is only supported before processing begins. Save the job ID and poll status instead of blindly resubmitting after a timeout.

Source: [Billing and retention](https://docs.higgsfield.ai/docs/concepts/billing-and-retention)

## Rights, privacy, and retention caveats

The API help says generated outputs can be used commercially. API terms, last updated September 2, 2026, say Higgsfield does not claim ownership of submitted/generated content, but do not warrant originality or freedom from infringement. Inputs need appropriate rights/consents. Partner models may receive the input. The terms permit training unless opted out in workspace settings; processing that opt-out may take ten business days and is not retroactive. Keep all private roster content, entrant names, identifying images and any sensitive information out of generation. Download approved media promptly, since retention is only guaranteed for at least seven days. API key creation/use entails API terms, and website subscription terms are separate.

Source: [API Terms](https://open.higgsfield.ai/terms-of-service)

## Native motion versus rendered video: project-specific design judgment

This section is implementation judgment, not a vendor performance claim.

- **Native CSS/SVG/Canvas:** best for readable ticket text, accessible controls, exact event timing, small reusable effects and reliable reduced-motion mode; no generative usage charge. Limited photorealism unless substantial asset work is done
- **Native 3D:** best for a drum, ticket particles, deterministic lighting/camera and true scroll camera travel. More engineering and GPU tuning, but every name and state remains under application control
- **Generated video:** fastest route to atmospheric urban realism and cinema-like material/light; repeat viewing need not invoke an API. Weakest for exact geometry, seamless loops, arbitrary scroll reversal, changing text and deterministic interaction
- **Recommended hybrid:** native machine/action/reveal in the interactive region; optional muted city-light background or 5–10 second opening camera glide generated once. Never require the decorative video to finish for an operator to draw or recover

### Three controlled test briefs

1. Slow 5-second push toward a brushed-metal ticket machine in a concrete urban tunnel; stable geometry, amber rim light, no readable text, no people, no ticket ejection
2. Slow 5-second lateral camera move with foreground rail parallax; same machine still and lighting; no cuts, no morphing, empty ticket faces
3. Near-static 5-second ambience with subtle haze and practical light shimmer; keep the machine silhouette locked for possible loop editing

Choose the most stable result before producing the 1080p final. Reject clips with melting hardware, inconsistent slot geometry, legible invented text, camera jumps, or flash-heavy effects. A draw event should trigger native spin/slow/reveal choreography, with the private host engine's result overlaid in DOM text. Scroll-scrubbing, if used, belongs to a nonessential intro, with a static fallback and reduced-motion handling.

## Outstanding verification before any paid run

- User approval of funding and total generation cap
- Exact account estimate and current discounts at execution time
- Current availability/access for the selected model on this account
- Source image ownership and upload approval
- Full requested-output timing / loop acceptance criteria
- Cinema Studio authentication conflict if selected
- DoP pricing and controls if specifically required

## Request-shape verification and estimate-only templates

Both selected endpoints explicitly allow only duration 5 or 10 seconds, default 5. Both require prompt and image_url; cfg_scale defaults to 0.5 and negative_prompt to an empty string. Neither schema exposes an audio parameter or a resolution parameter: the chosen Standard/Pro endpoint selects the respective advertised output tier. The proposed camera directions are text prompts, not verified Higgsfield camera-preset API controls.

Sources: [Standard schema](https://open.higgsfield.ai/models/kling-video/v2.5-turbo/standard/image-to-video/api-reference), [Pro schema](https://open.higgsfield.ai/models/kling-video/v2.5-turbo/pro/image-to-video/api-reference)

REST-only local empty fields, if selected by the desktop worker:

```dotenv
HF_API_KEY_ID=
HF_API_KEY_SECRET=
```

No SDK is needed for an estimate call. **Templates below are inert documentation, not executed.** The authenticated estimate will transmit the selected generic prompt and approved image URL to Higgsfield; use it only after the relevant access/data-sharing authorization is satisfied.

```http
POST https://api.higgsfield.ai/estimate/kling-video/v2.5-turbo/standard/image-to-video
Authorization: Key <HF_API_KEY_ID>:<HF_API_KEY_SECRET>
Content-Type: application/json

{
  "prompt": "Slow steady camera push toward the stationary brushed-metal ticket machine, stable silhouette, no cuts, no readable text, no people",
  "image_url": "<approved non-personal source-image URL>",
  "duration": 5,
  "cfg_scale": 0.5,
  "negative_prompt": "morphing, distorted machinery, letters, names, logos, flashes, cuts"
}
```

For the final estimate use `/estimate/kling-video/v2.5-turbo/pro/image-to-video` with `duration: 10` and the chosen prompt. Inspect `usd` in the response before considering a paid call. The corresponding paid generation endpoints omit `/estimate`; never switch to them automatically during budget review.

The estimate path is composed from the documented shared estimate convention and the verified model identifiers; this exact account/model call has not been executed. See [billing/estimate docs](https://docs.higgsfield.ai/docs/concepts/billing-and-retention).

If a suitable rights-cleared still is supplied from existing assets or built-in image generation, there is **no Higgsfield image-generation charge** for creating that still; do not imply the separate image-generation service itself is universally free. Upload authorization and delivery of a provider-accessible approved image remain required.
