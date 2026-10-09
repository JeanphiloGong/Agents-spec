---
name: sub2api-image-generation
description: "v0.1.0 - Generate and verify images through a configured Sub2API endpoint. Use when a Codex session needs a real image asset or UI reference generated through its current OpenAI-compatible proxy."
---

# Sub2api Image Generation

## Overview

Generate a raster image through the OpenAI-compatible Sub2API endpoint already
configured for the current Codex environment, save it locally, and verify that
the result is a real readable image. This skill is for producing an asset that
can be inspected or handed to a later implementation task.

## When to Use

- The user asks Codex to generate a real image, UI reference, mockup, or other
  raster asset through the configured Sub2API proxy.
- The current environment has a Codex API key and a provider `base_url` that
  can be used with `/images/generations`.

**When NOT to use:** Do not use this for configuring or deploying Sub2API,
editing an existing image, implementing a frontend from an already supplied
reference, or calling a provider that is not exposed through the current
OpenAI-compatible endpoint.

## The Operating Loop

1. Resolve configuration without printing secrets. Read `OPENAI_API_KEY` from
   `~/.codex/auth.json` unless the user supplied another authorized key. Resolve
   the provider `base_url` from `~/.codex/config.toml`, with an explicit
   `OPENAI_API_BASE` override taking precedence.
2. Choose an image model supported by the configured account, normally
   `gpt-image-2`. Preserve the user's prompt verbatim except for adding a
   clearly requested format or size constraint. Use one image by default.
3. Call the synchronous `/images/generations` endpoint with JSON. Use the
   bundled `scripts/generate_image.py` for deterministic request construction,
   response decoding, and file validation.
4. If the response is successful, save the image to the requested output path
   and verify its magic bytes and non-zero size. Report only the path, model,
   HTTP status, and size; never report the API key or raw base64 payload.
5. If the request times out after it was sent, do not blindly retry. Check
   provider logs or task state first because image generation may already have
   been billed. Use the async endpoint only when the user has configured object
   storage and explicitly needs long-running generation.

## Decision Points

- If `base_url` already ends in `/v1`, append `/images/generations`; otherwise
  normalize it before appending `/v1/images/generations`.
- If the API returns `data[0].b64_json`, decode it locally. If it returns a
  URL, download it with a bounded response size. Reject empty or non-image
  output.
- If the API returns a permission or model error, report the exact safe error
  message and check the Sub2API group image-generation permission and account
  capability. Do not switch accounts or alter server settings automatically.
- If the user wants Codex itself to decide when to call an image tool, this
  skill does not add that tool; explain that the direct Images API is the
  supported path and the separate hosted bridge must be configured in Sub2API.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can print the token briefly to debug auth." | A masked prefix is enough; secrets must never enter output or logs. |
| "A timeout means generation failed, so retry." | The upstream may have completed and charged the request; inspect state first. |
| "The Codex chat lacks `image_gen`, so Sub2API cannot generate images." | Client tool exposure and the direct Images API are separate paths. |
| "A 200 response is enough." | Verify the decoded bytes are a non-empty supported image before reporting success. |

## Red Flags

- The configured URL or token is printed in a command, log, or final response.
- A request is retried automatically after a read timeout.
- The result is reported as generated without a saved, validated file.
- The skill changes Sub2API, Codex, account, group, or deployment settings.

## Verification

- [ ] Configuration was resolved without exposing the key.
- [ ] The request used the intended model, prompt, and output path.
- [ ] HTTP response was successful and contained image data.
- [ ] Saved bytes have a recognized image signature and non-zero size.
- [ ] Final response includes the absolute output path and no credential data.

## Guardrails

- Image generation is an external, quota-consuming operation; do not generate
  speculative extra variants.
- Keep output files in a user-visible path such as `/tmp` or the current
  project unless the user specifies another location.
- Do not modify `~/.codex/auth.json`, `config.toml`, or server configuration.
