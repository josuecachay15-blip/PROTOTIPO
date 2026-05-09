# Security Specification: LexDefensa

## Data Invariants
1. A Report must always have a `userId` matching the creator's UID.
2. A Report's status cannot be changed by the user after it is 'Radicado' (only admins can move through workflow in this demo).
3. Metadata (timestamp, GPS, hash) must be immutable after creation.
4. Terminal state locking: Once a report is 'Resolución', no further updates are allowed.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Create a report with `userId` of another user.
   ```json
   { "userId": "attacker_id", "classification": "Robo", "status": "Radicado" }
   ```
2. **Privilege Escalation**: Create a document in the `admins` collection.
   ```json
   { "userId": "attacker_id", "role": "super-admin" }
   ```
3. **Ghost Field Injection**: Adding an extra field `isVerified: true` during report creation.
   ```json
   { "userId": "my_id", "classification": "Robo", "status": "Radicado", "isVerified": true }
   ```
4. **State Shortcutting**: Updating status directly to 'Resolución'.
   ```json
   { "status": "Resolución" }
   ```
5. **Resource Poisoning**: Large string for `description`.
   ```json
   { "description": "A".repeat(1024 * 1024) } 
   ```
6. **Orphaned Record**: Creating a report without a valid user ID.
   ```json
   { "userId": "", "classification": "Robo" }
   ```
7. **Bypassing Terminal Lock**: Updating a report that is already in 'Resolución' status.
8. **Metadata Tampering**: Updating the `metadata.hash` field.
9. **Fake Verification**: Setting `email_verified: true` in user profile.
10. **Admin Impersonation**: Attempting to read all reports without being in `admins` collection.
11. **Malicious ID**: Creating a report with a 2KB ID string.
12. **Timestamp Spoofing**: Providing a backdated `createdAt` from the client.

## Test Cases
- [ ] DENY: Create report with `userId` != `request.auth.uid`
- [ ] DENY: Update immutable field `createdAt`
- [ ] DENY: Update status to terminal state if not admin
- [ ] DENY: Access to `admins` collection by non-admin
- [ ] DENY: Access to private user data by other users
