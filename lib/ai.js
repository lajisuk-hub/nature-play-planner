// Claude(AI)에게 물어보는 부분. 서버에서만 실행됩니다.

const MODEL = 'claude-sonnet-5';

// AI가 돌려준 글에서 JSON만 안전하게 뽑아냅니다(따옴표·코드블록 때문에 깨지는 경우 대비).
export function parseAiJson(text) {
  if (!text) return null;
  let s = String(text).trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(s);
  } catch {}
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a >= 0 && b > a) {
    const cut = s.slice(a, b + 1);
    try {
      return JSON.parse(cut);
    } catch {}
    try {
      return JSON.parse(cut.replace(/,\s*([}\]])/g, '$1'));
    } catch {}
  }
  return null;
}

export async function askClaude({ prompt, schema, maxTokens = 4000 }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY 가 설정되지 않았습니다.');

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content: prompt }],
  };
  if (schema) {
    body.output_config = { format: { type: 'json_schema', schema } };
  }

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    throw new Error((data && data.error && data.error.message) || `AI 오류(${r.status})`);
  }
  const block = (data.content || []).find((b) => b.type === 'text');
  const text = block ? block.text : '';
  if (!schema) return text;
  const parsed = parseAiJson(text);
  if (!parsed) throw new Error(`AI 응답을 이해하지 못했습니다. (stop_reason: ${data.stop_reason})`);
  return parsed;
}
