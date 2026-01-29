Backend Intern Assignment: OPD Token Allocation Engine
Overview Design and implement a token allocation system for hospital OPD that supports elastic capacity management.

Context
Doctors operate in fixed time slots (e.g., 9-10, 10-11). Each slot has a maximum capacity.

Tokens are generated from multiple sources:

Online booking

Walk-in (OPD desk)

Paid priority patients

Follow-up patients

The system must dynamically handle real-world variability such as delays, cancellations, and emergency insertions.

Task

1. Algorithm Design Design an algorithm that:

Enforces per-slot hard limits.

Dynamically reallocates tokens when conditions change.

Prioritizes between different token sources.

Handles cancellations, no-shows, and emergency additions.

2. Core Logic

Build the core logic as an API-based service.

Deliverables

API design: Endpoints and data schema.

Implementation: The token allocation algorithm.

Documentation:

Prioritization logic.

Edge cases.

Failure handling.

Simulation: A simulation of one OPD day with at least 3 doctors.

Evaluation Criteria
Quality of algorithm design.

Handling of real-world edge cases.

Code structure and clarity.

Practical reasoning and trade-offs.
