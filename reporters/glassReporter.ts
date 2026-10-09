import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

type Row = { title: string; project: string; status: string; duration: number; error: string };

const esc = (s: string) =>
  s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export default class GlassReporter implements Reporter {
  private rows: Row[] = [];
  private start = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    this.rows.push({
      title: test.title,
      project: test.parent.project()?.name ?? '',
      status: result.status,
      duration: result.duration,
      error: (result.error?.message ?? '').replace(/\u001b\[[0-9;]*m/g, ''),
    });
  }

  onEnd() {
    const passed = this.rows.filter(r => r.status === 'passed').length;
    const failed = this.rows.length - passed;
    const total = ((Date.now() - this.start) / 1000).toFixed(1);

    const rowsHtml = this.rows
      .map(
        r => `
      <div class="row ${r.status === 'passed' ? 'pass' : 'fail'}">
        <span class="dot"></span>
        <div class="grow"><b>${esc(r.title)}</b><small>${esc(r.project)}</small>
          ${r.error ? `<pre>${esc(r.error)}</pre>` : ''}</div>
        <span>${(r.duration / 1000).toFixed(1)}s</span>
      </div>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Test Summary Dashboard</title>
<style>
:root { --accent: #F48031; }
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
  background:
    radial-gradient(circle at 15% 20%, rgba(244,128,49,0.45), transparent 40%),
    radial-gradient(circle at 85% 70%, rgba(59,76,202,0.45), transparent 45%),
    #0f1226;
}
header { padding: 24px 40px; border-bottom: 3px solid var(--accent); }
header h1 { margin: 0; color: var(--accent); }
.wrap { padding: 32px 40px; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 16px; padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}
.card h2 { margin: 0; font-size: 36px; }
.card p { margin: 4px 0 0; opacity: 0.8; }
.card.passed h2 { color: var(--accent); }
.tabs { margin: 28px 0 12px; display: flex; gap: 8px; }
.tab {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff; padding: 8px 18px; border-radius: 999px; cursor: pointer;
}
.tab.active { background: var(--accent); border-color: var(--accent); color: #111; font-weight: 600; }
.row {
  display: flex; gap: 12px; align-items: flex-start;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;
}
.grow { flex: 1; }
.dot { width: 12px; height: 12px; border-radius: 50%; margin-top: 5px; background: #e5484d; }
.row.pass .dot { background: var(--accent); }
pre { white-space: pre-wrap; color: #ffb4b4; font-size: 12px; margin: 8px 0 0; }
small { opacity: 0.6; margin-left: 8px; }
</style>
</head>
<body>
<header><h1>Test Summary Dashboard</h1></header>
<div class="wrap">
  <div class="cards">
    <div class="card"><h2>${this.rows.length}</h2><p>Total</p></div>
    <div class="card passed"><h2>${passed}</h2><p>Passed</p></div>
    <div class="card"><h2>${failed}</h2><p>Failed</p></div>
    <div class="card"><h2>${total}s</h2><p>Duration</p></div>
  </div>
  <div class="tabs">
    <button class="tab active" data-f="all">All</button>
    <button class="tab" data-f="pass">Passed</button>
    <button class="tab" data-f="fail">Failed</button>
  </div>
  <div id="list">${rowsHtml}</div>
</div>
<script>
document.querySelectorAll('.tab').forEach(function (t) {
  t.onclick = function () {
    document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
    t.classList.add('active');
    var f = t.dataset.f;
    document.querySelectorAll('.row').forEach(function (r) {
      r.style.display = (f === 'all' || r.classList.contains(f)) ? 'flex' : 'none';
    });
  };
});
</script>
</body>
</html>`;

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(path.join('reports', 'summary.html'), html);
    console.log('Custom report written to: reports/summary.html');
  }
}