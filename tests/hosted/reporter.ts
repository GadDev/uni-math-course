import { mkdirSync, writeFileSync } from 'node:fs';
import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { hostedSettings } from './settings.ts';

// Deliberately omit errors, steps, attachments, stdout, URLs with queries and
// assertion values. Standard reports/traces can contain credentials or history.
export default class AcceptanceReporter implements Reporter {
  private checks: { check: string; status: string }[] = [];
  onBegin() {
    process.stdout.write(
      'Running pilot acceptance checks; raw diagnostics disabled.\n',
    );
  }
  onTestEnd(test: TestCase, result: TestResult) {
    this.checks.push({ check: test.title, status: result.status });
    process.stdout.write(`${result.status}: ${test.title}\n`);
  }
  onError() {
    process.stderr.write(
      'Acceptance runner failed; raw diagnostics suppressed.\n',
    );
  }
  onEnd(result: FullResult) {
    const settings = hostedSettings();
    const report = {
      date: new Date().toISOString(),
      mode: settings.localFixture ? 'local-protocol-fixture' : 'hosted',
      origin: settings.origin,
      operator: settings.operator,
      declaredAppCommit: settings.appSha,
      declaredDeployment: settings.deployment,
      identityVerification:
        'Operator-supplied; not independently verified by suite',
      browser: 'Playwright Chromium',
      directDataApiConfigured: Boolean(settings.supabaseUrl),
      acceptanceRows: { H2: 'partial coverage', H3: 'partial coverage' },
      status: result.status,
      checks: this.checks,
      limitations: [
        'Writes persistent synthetic attempts; no cleanup or learner-account mutation',
        'Lost response and deadline are client-injected after a real server request',
        'Tab-return handler events include deterministic synthetic focus/visibility',
        'No real expiry/refresh, provider outage or guaranteed native BFCache acceptance',
        'No migration audit, screen-reader review, mathematics, privacy, recovery or rights approval',
        'In hosted mode, Data API checks are skipped unless optional publishable-key settings are supplied',
      ],
    };
    mkdirSync('private/hosted-acceptance', { recursive: true });
    writeFileSync(
      'private/hosted-acceptance/summary.json',
      JSON.stringify(report, null, 2) + '\n',
      { mode: 0o600 },
    );
    process.stdout.write(
      'Sanitized evidence: private/hosted-acceptance/summary.json\n',
    );
  }
}
