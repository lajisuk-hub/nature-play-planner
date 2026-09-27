'use client';

import { useEffect, useMemo, useState } from 'react';
import { STEPS, ALL_QUESTIONS, emptyAnswers } from '@/lib/questions';

const KEY = 'nature-play-planner:v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d && typeof d === 'object' ? d : null;
  } catch {
    return null;
  }
}
function save(d) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

export default function Page() {
  const [view, setView] = useState('intro'); // intro | interview | making | plan
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [plan, setPlan] = useState(null);
  const [stage, setStage] = useState('');
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const d = load();
    if (d) {
      if (d.answers) setAnswers({ ...emptyAnswers(), ...d.answers });
      if (d.plan) setPlan(d.plan);
      if (d.plan && typeof location !== 'undefined' && location.hash === '#plan') setView('plan');
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) save({ answers, plan });
  }, [answers, plan, ready]);

  function pop(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  // 함수형 갱신: 빠르게 두 번 눌러도 앞서 고른 것이 사라지지 않게
  function toggleMulti(id, v) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[id]) ? prev[id] : [];
      return { ...prev, [id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  }
  function setOne(id, v) {
    setAnswers((prev) => ({ ...prev, [id]: prev[id] === v ? '' : v }));
  }
  function setText(id, v) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  // 한 화면에 질문 하나씩: step = 전체 질문 중 몇 번째인지
  const N = ALL_QUESTIONS.length;
  const cur = ALL_QUESTIONS[step];
  const group = STEPS.find((s) => s.questions.includes(cur));
  const firstInGroup = group && group.questions[0] === cur;
  const missing = useMemo(() => {
    if (!cur) return [];
    if (cur.type === 'text') return []; // 글쓰기는 건너뛰어도 됨
    const v = answers[cur.id];
    return Array.isArray(v) ? (v.length === 0 ? [cur] : []) : (v ? [] : [cur]);
  }, [cur, answers]);

  async function callApi(body) {
    const r = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.error || '문제가 생겼어요.');
    return d;
  }

  async function make() {
    setErr('');
    setView('making');
    try {
      setStage('우리 원 여건에 맞는 놀이 주제와 당일 흐름을 짜는 중…');
      const a = await callApi({ step: 'core', answers });
      setStage('사전·사후 놀이와 부모님 공지문을 쓰는 중…');
      const b = await callApi({ step: 'links', answers, core: a.core });
      setPlan({ ...a.core, ...b.links, madeAt: new Date().toISOString() });
      setView('plan');
      window.scrollTo(0, 0);
    } catch (e) {
      setErr(e.message || '문제가 생겼어요.');
      setView('interview');
      setStep(N - 1);
    }
  }

  function copy(text, label) {
    navigator.clipboard
      .writeText(text)
      .then(() => pop(`${label} 복사했어요`))
      .catch(() => pop('복사가 안 되면 글을 길게 눌러 복사해 주세요'));
  }

  function resetAll() {
    if (!confirm('적은 답과 기획안을 모두 지우고 처음부터 시작할까요?')) return;
    setAnswers(emptyAnswers());
    setPlan(null);
    setStep(0);
    setView('intro');
  }

  if (!ready) return null;

  /* ───────── 시작 화면 ───────── */
  if (view === 'intro') {
    return (
      <main className="wrap">
        <div className="card hero">
          <div className="stepname">하루를 채우는 자연놀이! 프로그램이 아닌 일상에서도 실천하는 자연놀이 프로그램을 기획해보세요</div>
          <div className="big">
            우리원의 상황에 <em>가장 적합한</em>
            <br />
            한 번 해 볼 수 있는 <em>하루 자연놀이 기획안</em>이 나옵니다
          </div>
          <p className="muted">
            뒷산이 있어도, 마당뿐이어도, 실내밖에 안 돼도 괜찮아요. 있는 여건 그대로에 맞는 놀이를 찾아 드립니다.
            같은 놀이라도 우리 원에서는 다른 배움이 됩니다.
          </p>
          <div className="steps4">
            {STEPS.map((s) => (
              <div key={s.id}>
                <b>{s.title.slice(0, 2)}</b>
                {s.title.slice(3)}
              </div>
            ))}
          </div>
          <p className="muted">질문은 네 묶음 열여섯 개, 한 화면에 하나씩 답하면 3~5분이면 끝납니다. 기획안에는 주제·대상·준비·당일 흐름·사전/사후 놀이·부모님 공지문·안전 점검·대안이 들어갑니다.</p>
          <div className="row">
            <button className="btn" onClick={() => { setStep(0); setView('interview'); }}>
              {plan ? '답을 고쳐서 다시 만들기' : '인터뷰 시작하기'}
            </button>
            {plan && (
              <button className="btn ghost" onClick={() => setView('plan')}>
                지난 기획안 보기
              </button>
            )}
          </div>
        </div>
        <div className="foot">답한 내용과 기획안은 이 브라우저에만 저장됩니다.</div>
      </main>
    );
  }

  /* ───────── 만드는 중 ───────── */
  if (view === 'making') {
    return (
      <main className="wrap">
        <div className="card loading">
          <span className="leaf">🍃</span>
          <div className="stage">{stage}</div>
          <div className="sub">보통 1분 안팎 걸립니다. 화면을 닫지 말고 기다려 주세요.</div>
        </div>
      </main>
    );
  }

  /* ───────── 기획안 ───────── */
  if (view === 'plan' && plan) {
    return <PlanView plan={plan} answers={answers} onEdit={() => { setStep(0); setView('interview'); }} onRemake={make} onReset={resetAll} copy={copy} toast={toast} />;
  }

  /* ───────── 인터뷰 ───────── */
  const q = cur;
  const pct = Math.round(((step + 1) / N) * 100);
  const goPrev = () => {
    if (step === 0) setView('intro');
    else setStep(step - 1);
    window.scrollTo(0, 0);
  };
  return (
    <main className="wrap">
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <div className="spread">
        <span className="stepname">{step + 1} / {N} · {group.title}</span>
        <button className="btn ghost sm" onClick={() => setView('intro')}>처음 화면</button>
      </div>
      <div className="card">
        {firstInGroup && (
          <>
            <h2>{group.title}</h2>
            <p className="muted">{group.intro}</p>
          </>
        )}
        <div key={q.id}>
          <div className="q">{q.q}</div>
          {q.hint && <div className="hint">{q.hint}</div>}
          {q.type === 'multi' && (
            <div className="chips">
              {q.options.map((o) => (
                <button key={o} type="button" className={'chipbtn' + (answers[q.id].includes(o) ? ' on' : '')} onClick={() => toggleMulti(q.id, o)}>
                  {o}
                </button>
              ))}
            </div>
          )}
          {q.type === 'single' && (
            <div className="chips">
              {q.options.map((o) => (
                <button key={o} type="button" className={'chipbtn' + (answers[q.id] === o ? ' on' : '')} onClick={() => setOne(q.id, o)}>
                  {o}
                </button>
              ))}
            </div>
          )}
          {q.type === 'text' && (q.short ? (
            <input type="text" value={answers[q.id]} placeholder={q.placeholder} onChange={(e) => setText(q.id, e.target.value)} />
          ) : (
            <textarea value={answers[q.id]} placeholder={q.placeholder} onChange={(e) => setText(q.id, e.target.value)} />
          ))}
          {q.type === 'text' && <div className="hint" style={{ marginTop: 6 }}>비워 두고 넘어가도 됩니다.</div>}
        </div>
        {missing.length > 0 && (
          <div className="miss">하나를 골라 주세요.</div>
        )}
        {err && <div className="err" style={{ marginTop: 12 }}>{err}</div>}
      </div>
      <div className="row">
        <button className="btn ghost" onClick={goPrev}>← 이전</button>
        {step < N - 1 ? (
          <button className="btn" disabled={missing.length > 0} onClick={() => { setStep(step + 1); window.scrollTo(0, 0); }}>다음 →</button>
        ) : (
          <button className="btn" disabled={missing.length > 0} onClick={make}>기획안 만들기</button>
        )}
      </div>
    </main>
  );
}

function PlanView({ plan, answers, onEdit, onRemake, onReset, copy, toast }) {
  const summaryText = useMemo(() => planToText(plan), [plan]);
  const center = String(answers.center || '').trim();
  const made = plan.madeAt ? new Date(plan.madeAt) : null;
  const madeStr = made && !isNaN(made) ? `${made.getFullYear()}년 ${made.getMonth() + 1}월 ${made.getDate()}일` : '';
  return (
    <main className="wrap">
      <div className="card plan">
        <table className="sheet">
          <thead><tr><td><div className="sheet-top" /></td></tr></thead>
          <tbody><tr><td>
        <div className="plan-head">
          <div className="plan-kicker"><span className="leafmark">🍃</span> 하루 자연놀이 기획안</div>
          <h1>{plan.title}</h1>
          <div className="concept">{plan.concept}</div>
          <div className="plan-meta">
            {center && <span>{center}</span>}
            {madeStr && <span>{madeStr} 작성</span>}
          </div>
        </div>

        <div className="sec">
          <h3>대상 · 일시 · 장소</h3>
          <div className="kv">
            <b>대상</b><span>{plan.target}</span>
            <b>일시·장소</b><span>{plan.whenWhere}</span>
          </div>
        </div>

        <div className="sec">
          <h3>왜 이 놀이인가</h3>
          <p>{plan.whyThis}</p>
        </div>

        {plan.special && plan.special.length > 0 && (
          <div className="sec">
            <h3>보통 산책과 다른 점</h3>
            <ul className="special">{plan.special.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}

        <div className="sec flowsec">
          <h3>당일 진행 흐름</h3>
          <div className="flow">
            {plan.flow.map((f, i) => (
              <div className="st" key={i}>
                <div className="t">{f.time}</div>
                <div>
                  <div className="n">{f.name}</div>
                  <div className="w">{f.what}</div>
                  {(f.senses || f.heart) && (
                    <div className="tags">
                      {f.senses && <span className="tag sense">👐 {f.senses}</span>}
                      {f.heart && <span className="tag heart">💛 {f.heart}</span>}
                    </div>
                  )}
                  {f.tip && <div className="tip">{f.tip}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sec">
          <h3>준비물</h3>
          <ul>{plan.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>

        <div className="sec">
          <h3>사전 준비 — 원(기관)이 할 일</h3>
          <ul className="check">{plan.prepCenter.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>
        <div className="sec">
          <h3>사전 준비 — 교사가 할 일</h3>
          <ul className="check">{plan.prepTeacher.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>

        <div className="sec">
          <h3>사전 놀이 연계 (활동 전 1~2주)</h3>
          {plan.prePlay.map((p, i) => <div className="play" key={i}><b>{p.name}</b><span>{p.how}</span></div>)}
        </div>
        <div className="sec">
          <h3>사후 놀이 연계 (활동 후 1~2주)</h3>
          {plan.postPlay.map((p, i) => <div className="play" key={i}><b>{p.name}</b><span>{p.how}</span></div>)}
        </div>

        <div className="sec">
          <h3>안전 점검표</h3>
          <ul className="check">{plan.safety.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>

        <div className="sec longsec">
          <div className="spread">
            <h3 style={{ flex: 1 }}>부모님 공지문</h3>
            <button className="btn ghost sm noprint" onClick={() => copy(plan.parentNotice, '공지문을')}>공지문 복사</button>
          </div>
          <div className="notice">{plan.parentNotice}</div>
          {plan.parentRole && plan.parentRole.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div className="muted" style={{ fontWeight: 700 }}>부모님께 부탁드릴 것</div>
              <ul>{plan.parentRole.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          )}
        </div>

        <div className="sec">
          <h3>여건이 틀어졌을 때</h3>
          <div className="alt">
            {plan.alternatives.map((a, i) => <div key={i}><b>{a.when}</b> → {a.then}</div>)}
          </div>
        </div>

        <div className="sec">
          <h3>기록·평가 팁</h3>
          <ul>{plan.recordTips.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>

        {plan.closing && <div className="sec"><div className="closing">{plan.closing}</div></div>}

        <details className="noprint" style={{ marginTop: 18 }}>
          <summary className="muted">내가 답한 내용 보기</summary>
          <div className="muted" style={{ whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 14 }}>
            {ALL_QUESTIONS.map((q) => `· ${q.q} ${Array.isArray(answers[q.id]) ? answers[q.id].join(', ') : answers[q.id]}`).join('\n')}
          </div>
        </details>
          </td></tr></tbody>
          <tfoot><tr><td><div className="sheet-bot" /></td></tr></tfoot>
        </table>
        <div className="print-foot">
          <span>{center ? `${center} · ` : ''}하루 자연놀이 기획안{madeStr ? ` · ${madeStr}` : ''}</span>
          <span>하루 자연놀이 기획 도우미</span>
        </div>
      </div>

      <div className="toolbar noprint">
        <div className="row">
          <button className="btn" onClick={() => window.print()}>인쇄 · PDF 저장</button>
          <button className="btn ghost" onClick={() => copy(summaryText, '기획안 전체를')}>전체 복사</button>
          <button className="btn ghost" onClick={onEdit}>답 고치기</button>
          <button className="btn ghost" onClick={onRemake}>같은 답으로 다시 만들기</button>
          <button className="btn ghost sm" onClick={onReset}>처음부터</button>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
      <div className="foot">하루 자연놀이 기획 도우미 · 기획안은 이 브라우저에 저장됩니다</div>
    </main>
  );
}

function planToText(p) {
  const L = [];
  L.push(`[${p.title}]`, p.concept, '');
  L.push(`■ 대상: ${p.target}`, `■ 일시·장소: ${p.whenWhere}`, '');
  L.push('■ 왜 이 놀이인가', p.whyThis);
  if (p.special && p.special.length) { L.push('', '■ 보통 산책과 다른 점'); p.special.forEach((m) => L.push(`- ${m}`)); }
  L.push('', '■ 당일 진행 흐름');
  p.flow.forEach((f) => {
    L.push(`${f.time} ${f.name}: ${f.what}`);
    if (f.senses) L.push(`  감각: ${f.senses}`);
    if (f.heart) L.push(`  마음: ${f.heart}`);
    if (f.tip) L.push(`  팁: ${f.tip}`);
  });
  L.push('', '■ 준비물'); p.materials.forEach((m) => L.push(`- ${m}`));
  L.push('', '■ 사전 준비(원)'); p.prepCenter.forEach((m) => L.push(`☐ ${m}`));
  L.push('', '■ 사전 준비(교사)'); p.prepTeacher.forEach((m) => L.push(`☐ ${m}`));
  L.push('', '■ 사전 놀이 연계'); p.prePlay.forEach((x) => L.push(`- ${x.name}: ${x.how}`));
  L.push('', '■ 사후 놀이 연계'); p.postPlay.forEach((x) => L.push(`- ${x.name}: ${x.how}`));
  L.push('', '■ 안전 점검표'); p.safety.forEach((m) => L.push(`☐ ${m}`));
  L.push('', '■ 부모님 공지문', p.parentNotice);
  if (p.parentRole && p.parentRole.length) { L.push('', '■ 부모님께 부탁드릴 것'); p.parentRole.forEach((m) => L.push(`- ${m}`)); }
  L.push('', '■ 여건이 틀어졌을 때'); p.alternatives.forEach((a) => L.push(`- ${a.when} → ${a.then}`));
  L.push('', '■ 기록·평가 팁'); p.recordTips.forEach((m) => L.push(`- ${m}`));
  if (p.closing) L.push('', p.closing);
  return L.join('\n');
}
