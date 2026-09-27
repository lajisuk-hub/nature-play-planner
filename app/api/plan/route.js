// 기획안 만들기 창구. 두 번에 나눠 부릅니다.
//  1) step: 'core'  → 핵심 기획(제목·흐름·준비·안전)
//  2) step: 'links' → 사전·사후 놀이, 부모 공지문, 대안 (core 결과를 함께 보냄)
import { makeCore, makeLinks } from '@/lib/plan';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req) {
  try {
    const { step, answers, core } = await req.json();
    if (!answers || typeof answers !== 'object') {
      return Response.json({ error: '답변이 비어 있어요.' }, { status: 400 });
    }
    if (step === 'links') {
      if (!core || !core.title) return Response.json({ error: '핵심 기획이 먼저 필요해요.' }, { status: 400 });
      const links = await makeLinks(answers, core);
      return Response.json({ ok: true, links });
    }
    const result = await makeCore(answers);
    return Response.json({ ok: true, core: result });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: '기획안을 만드는 중에 문제가 생겼어요. 잠시 뒤 「다시 만들기」를 눌러 주세요. 적은 답은 그대로 남아 있습니다.' },
      { status: 500 }
    );
  }
}
