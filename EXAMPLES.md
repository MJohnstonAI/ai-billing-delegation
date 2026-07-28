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
| `examples/gateway-attested-usage-event.json` | Provisional gateway observation |
| `examples/provider-signed-usage-event.json` | Provider-signed final evidence |
| `examples/sponsor-consent-receipt.json` | Sponsor-funded Consent Receipt |
| `examples/late-usage-reconciliation.json` | Append-only reconciliation and adjustment arithmetic |

The provider-signature fixture uses `JWS-HS256-test-only` solely to make verification reproducible with Python's standard library. Production ABDS signatures should use asymmetric keys and a selected canonicalization profile.

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
