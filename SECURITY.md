# Security policy

## Supported scope

The `main` branch is the supported development line. No application or production service has been released. Future supported versions will be listed here when releases exist.

## Reporting a vulnerability

Do not open a public issue containing an exploit, credentials, learner data, or security-sensitive logs.

Use GitHub's private vulnerability reporting option in the repository Security tab if it is enabled. Otherwise use a private contact method on the [maintainer's profile](https://github.com/GadDev). If neither is available, request a private reporting channel in an issue without disclosing vulnerability details.

Include affected files or versions, a concise description, reproduction steps, and potential impact. Redact secrets and personal information. The sole maintainer cannot promise a fixed response deadline.

## Development principles

Never store secrets in Git. Future account and progress features must validate identity and ownership on the server, keep learner records private, and reject client-supplied scores. Dependency and application security checks will be added with the application scaffold.
