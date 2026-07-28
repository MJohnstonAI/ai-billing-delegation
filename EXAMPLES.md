# ABDS Examples and Test Vectors

All domains, identifiers, models, units, amounts, Sponsors, and funding offers are fictional. They do not show that any AI Provider implements ABDS.

## v0.5 Compatibility Examples

| File | Purpose |
|---|---|
| `examples/usage-event-agent-fallback.json` | One physical fallback attempt with attribution and billing |
| `examples/reservation-settlement-sequence.json` | Reservation and one terminal settlement finalization |

## v0.6 Positive Examples

| File | Purpose |
|---|---|
| `examples/gateway-attested-usage-event.json` | Transitional provisional gateway observation later reconciled against an external Provider record |
| `examples/provider-signed-usage-event.json` | Independent provider-native physical attempt with final signed evidence |
| `examples/sponsor-consent-receipt.json` | Sponsor-funded Consent Receipt |
| `examples/late-usage-reconciliation.json` | Append-only reconciliation of the gateway event and adjustment arithmetic |

The gateway and provider-signed Usage Event files illustrate different evidence paths; they are not duplicate events for the same physical attempt. Later Provider evidence for the gateway example is represented by its Reconciliation Event rather than by a second Usage Event.

The provider-signature fixture uses `HMAC-SHA256-test-only` solely to make verification reproducible with Python's standard library. Production ABDS signatures should use asymmetric keys and a selected canonicalization profile.

## v0.6 Negative Fixtures

| File | Expected rejection |
|---|---|
| `tests/invalid/replayed-event.json` | Duplicate Usage Event identifier |
| `tests/invalid/duplicate-settlement.json` | Reused settlement identifier |
| `tests/invalid/unbound-consent-receipt.json` | Receipt does not bind the execution grant |
| `tests/invalid/event-order-conflict.json` | Duplicate sequence number in one scope |
| `tests/invalid/signature-mismatch.json` | Evidence signature mismatch |
| `tests/invalid/late-usage-double-charge.json` | Invalid reconciliation arithmetic |

## Automated Validation

Run:

```text
python -m pip install jsonschema
python scripts/validate_examples.py
```

The validator checks:

- v0.5 compatibility;
- v0.6 schema validity;
- Consent Receipt digest and binding;
- reference provider-signature verification;
- event sequence uniqueness and predecessor linkage;
- reconciliation arithmetic;
- reservation and settlement invariants;
- rejection of all negative fixtures.

Passing repository validation is not formal standards certification or Provider endorsement.
