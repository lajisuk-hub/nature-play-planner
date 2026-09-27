// 인터뷰 답을 읽고 하루 자연놀이 기획안을 두 번에 나눠 만드는 부분
// (한 번에 다 만들면 시간이 오래 걸려 Vercel 60초 제한에 걸릴 수 있어 둘로 나눔)
import { askClaude } from './ai';
import { answersToText } from './questions';

const STR = { type: 'string' };
const STR_ARR = { type: 'array', items: STR };

const SCHEMA_A = {
  type: 'object',
  properties: {
    title: STR,
    concept: STR,
    whyThis: STR,
    special: STR_ARR,
    target: STR,
    whenWhere: STR,
    flow: {
      type: 'array',
      items: {
        type: 'object',
        properties: { time: STR, name: STR, what: STR, senses: STR, heart: STR, tip: STR },
        required: ['time', 'name', 'what', 'senses', 'heart', 'tip'],
        additionalProperties: false,
      },
    },
    materials: STR_ARR,
    prepCenter: STR_ARR,
    prepTeacher: STR_ARR,
    safety: STR_ARR,
  },
  required: ['title', 'concept', 'whyThis', 'special', 'target', 'whenWhere', 'flow', 'materials', 'prepCenter', 'prepTeacher', 'safety'],
  additionalProperties: false,
};

const PLAY = {
  type: 'array',
  items: {
    type: 'object',
    properties: { name: STR, how: STR },
    required: ['name', 'how'],
    additionalProperties: false,
  },
};

const SCHEMA_B = {
  type: 'object',
  properties: {
    prePlay: PLAY,
    postPlay: PLAY,
    parentNotice: STR,
    parentRole: STR_ARR,
    alternatives: {
      type: 'array',
      items: {
        type: 'object',
        properties: { when: STR, then: STR },
        required: ['when', 'then'],
        additionalProperties: false,
      },
    },
    recordTips: STR_ARR,
    closing: STR,
  },
  required: ['prePlay', 'postPlay', 'parentNotice', 'parentRole', 'alternatives', 'recordTips', 'closing'],
  additionalProperties: false,
};

const COMMON_RULES = `주의:
- 어린이집 원장님·교사가 읽는 글입니다. 전문용어 없이 쉽고 따뜻한 한국어 존댓말로 씁니다.
- 답변에 적힌 여건(장소·이동·시간·예산·연령·인원·특별히 챙길 아이)을 벗어나는 제안은 하지 않습니다. 없는 것을 사 오라고 하지 말고, 「있는 것으로」 할 수 있게 합니다.
- 비싼 교구 대신 나뭇잎·돌멩이·흙·물·바람 같은 자연물과 원에 흔히 있는 것(바구니·돋보기·종이·크레파스·비닐봉지·수건)만 씁니다.
- 영아(만 0~2세)가 포함되면 이동 거리·시간을 짧게, 입에 넣는 것 주의, 교사 1명당 아이 수를 고려합니다.
- 글 안에 큰따옴표(")는 쓰지 말고 「」를 씁니다.`;

function promptA(answers) {
  return `당신은 어린이집 자연친화 프로그램을 20년 넘게 만들어 온 노련한 보육 컨설턴트입니다.
한 어린이집이 「우리 원에서 한 번(1회성) 해 볼 수 있는 하루 자연놀이」를 기획하려고 인터뷰에 답했습니다.
이 답을 종합해서, 이 원의 여건에 딱 맞는 하루 자연놀이 프로그램의 「핵심 기획」을 만들어 주세요.
같은 놀이라도 여건에 따라 다른 배움이 나온다는 것을 보여 주는 기획이어야 합니다.

=== 인터뷰 답변 ===
${answersToText(answers)}

=== 가장 중요한 요구: 누구나 아는 흔한 산책이 아니어야 합니다 ===
「나뭇잎 줍기 → 자유롭게 만지기 → 돌아와서 이야기하기」처럼 어느 원이나 이미 하고 있는 산책은 안 됩니다.
읽는 원장님이 「아, 이건 우리가 안 해 본 거다」라고 느껴야 합니다. 그러려면:
1. 하루 전체를 하나의 이야기·역할·비밀 임무로 묶으세요(예: 아이들이 「소리 탐정」이 되어 숲의 소리 지도를 만든다, 「바람 우체부」가 되어 나뭇잎 편지를 나른다, 「감각 요리사」가 되어 냄새·촉감으로 자연 요리를 차린다 — 이건 예시일 뿐이니 이 원의 여건·계절·계기에서 새 아이디어를 만드세요).
2. 오감 융합: 매 단계마다 다른 감각을 주인공으로 세우고(눈 감고 듣기, 손으로만 찾기, 냄새로 짝 맞추기, 맨발·뺨으로 느끼기, 계절 자연물의 맛·향), 감각 두 가지가 만나는 장면을 하나 이상 넣으세요(예: 눈 가리고 손으로 만진 것을 소리로 표현하기).
3. 사회정서 융합: 매 단계에 마음과 관계가 자라는 장치를 넣으세요 — 짝과 손잡고 서로 안내하기, 내 것을 친구에게 선물하기, 감정 단어로 자연물 고르기(「오늘 내 기분 같은 돌」), 순서 기다리기, 친구 위로하기, 함께 완성하는 하나의 작품, 자기 몸 조절(살금살금·멈추기). 「사이좋게 놀기」 같은 막연한 말이 아니라 실제 행동으로.
4. 교사의 말이 다르게: 지시(「줍자」) 대신 마음과 감각을 여는 말(「이 소리는 어디서 오는 걸까?」「네가 고른 돌은 어떤 기분이야?」)을 단계마다 한 문장씩 넣으세요.
5. 인터뷰의 「왜 해 보고 싶은지」와 「보고 싶은 장면」에 적힌 말을 기획의 중심에 두세요. 「특별한」「색다른」「새로운」 같은 요청이 있으면 흔한 활동을 조금 손본 수준이 아니라 구조 자체를 다르게 하세요.
6. 그러면서도 답변에 적힌 여건과 연령에서 실제로 되는 것이어야 합니다. 영아는 임무를 단순하게(감각 하나, 짝 대신 교사와), 유아는 역할과 협동을 크게.

아래 항목을 채워 주세요.
- title: 프로그램 이름. 아이들이 부를 수 있는 쉽고 정겨운 이름(15자 안팎). 예: 「우리 동네 돌멩이 보물찾기」
- concept: 이 놀이를 한 줄로(40자 안팎). 무엇을 하고 무엇이 남는지.
- whyThis: 왜 이 원에 이 놀이를 추천하는지 3~4문장. 인터뷰에 적힌 여건·계기·바라는 변화를 실제 표현 그대로 살려서 연결해 주세요.
- special: 「보통 산책과 다른 점」 3가지. 각각 한 줄로, 무엇이 어떻게 다른지 구체적으로(예: 「아이들이 줍는 게 아니라 눈 감은 짝을 소리로 안내합니다」).
- target: 대상을 한 줄로(연령·인원·부모 참여 여부·특별히 챙길 아이 포함).
- whenWhere: 일시·장소·이동 방법·소요 시간을 한 줄로. 계절에 맞는 시간대(여름은 오전 이른 시간 등)를 제안.
- flow: 당일 진행 흐름 5~7단계. time은 「10:00~10:15」처럼 시각 또는 「15분」처럼 길이, name은 이야기·임무가 드러나는 단계 이름(「출발 전 약속」 대신 「탐정 배지 달기」처럼), what은 아이들과 교사가 실제로 하는 일 3~4문장(무엇을 어떻게, 어떤 규칙으로), senses는 이 단계의 주인공 감각과 쓰는 방법 한 줄(예: 「청각 — 눈 감고 30초, 들린 소리 손가락으로 세기」), heart는 이 단계에서 자라는 마음·관계 한 줄(예: 「짝을 넘어지지 않게 안내하며 책임감·신뢰」), tip은 교사가 놓치기 쉬운 한 가지(마음을 여는 말 한 문장, 기다려 주기, 사진 찍을 순간 등). 첫 단계는 임무를 받는 장면과 안전 약속, 마지막 단계는 함께 만든 것을 모아 마음을 나누는 장면으로.
- materials: 준비물 목록 6~10개. 각 항목에 수량이나 용도를 짧게. 예산이 거의 없으면 사지 않아도 되는 것으로.
- prepCenter: 원(기관)이 미리 해 둘 일 4~6개. 장소 답사·허가·차량·비상연락·부모 동의·보험 등 실제 행정 순서대로.
- prepTeacher: 교사가 미리 해 둘 일 4~6개. 답사 때 볼 것, 아이들과 미리 나눌 약속, 역할 나누기 등.
- safety: 안전 점검표 6~8개. 이 장소·계절·연령에 맞는 구체적인 것(벌·진드기·미끄러운 곳·물가·차도·햇볕·입에 넣기 등). 「하지 마세요」보다 「이렇게 하세요」로.

${COMMON_RULES}`;
}

function promptB(answers, core) {
  const flow = (core.flow || []).map((f) => `${f.time} ${f.name}: ${f.what}${f.senses ? ` [감각: ${f.senses}]` : ''}${f.heart ? ` [마음: ${f.heart}]` : ''}`).join('\n');
  return `당신은 어린이집 자연친화 프로그램을 20년 넘게 만들어 온 노련한 보육 컨설턴트입니다.
아래는 한 어린이집의 인터뷰 답변과, 그에 맞춰 이미 정해진 하루 자연놀이 핵심 기획입니다.
이제 이 놀이가 하루로 끝나지 않고 앞뒤 놀이와 이어지도록, 그리고 부모님께 바로 보낼 수 있도록 「연계와 공지」 부분을 만들어 주세요.

=== 인터뷰 답변 ===
${answersToText(answers)}

=== 이미 정해진 핵심 기획 ===
프로그램 이름: ${core.title}
한 줄 소개: ${core.concept}
보통 산책과 다른 점: ${(core.special || []).join(' / ')}
대상: ${core.target}
일시·장소: ${core.whenWhere}
당일 흐름:
${flow}

아래 항목을 채워 주세요.
- prePlay: 활동 전(1~2주 안) 교실에서 할 사전 놀이 3개. name은 놀이 이름, how는 어떻게 하는지 2~3문장. 당일의 이야기·역할·감각 놀이를 교실에서 미리 연습해 기대를 키우는 놀이로(예: 눈 감고 교실 소리 듣기, 짝 안내 연습, 감정 단어 카드로 물건 고르기). 흔한 「그림책 읽기」만으로 채우지 마세요.
- postPlay: 활동 후(1~2주 안) 교실에서 이어 갈 사후 놀이 3개. 가져온 자연물·사진·아이들 말을 다시 꺼내 쓰되, 당일에 자란 감각과 마음(친구에게 준 것, 함께 만든 것, 들은 소리)이 이어지는 놀이로(친구에게 편지, 소리 지도 완성, 감각 전시회에 부모 초대 등).
- parentNotice: 부모님께 보낼 공지문 전체. 어린이집 이름(답변에 있으면 그대로, 없으면 「○○어린이집」)으로 시작해 인사 → 무엇을 왜 하는지(바라는 변화를 부모 눈높이로) → 일시·장소·이동 → 준비물(옷차림·물·모자·여벌옷 등) → 부탁드릴 것(동의서·알레르기 알려 주기·부모 참여 시 역할) → 마무리 인사. 12~18줄, 줄바꿈으로 문단을 나누고, 카톡·알림장에 그대로 붙여 넣을 수 있게 완성된 글로.
- parentRole: 부모님이 참여하는 경우 부모님께 부탁할 역할 3~5개(참여하지 않으면 「가정에서 이렇게 이어 주세요」 3개로). 한 줄씩.
- alternatives: 여건이 틀어졌을 때의 대안 3~4개. when은 상황(비가 올 때, 미세먼지 나쁨, 차량이 안 잡힐 때, 부모 참여가 적을 때, 영아가 힘들어할 때 등), then은 그때 할 수 있는 구체적 대체 놀이나 조정.
- recordTips: 기록·평가 팁 3개. 사진 찍을 장면, 아이들 말 받아 적기, 평가제·소식지에 쓸 수 있는 정리 방법 등 한 줄씩.
- closing: 이 기획을 받아 볼 원장님·선생님께 드리는 응원 2~3문장. 인터뷰에 적힌 「보고 싶은 장면」을 꼭 담아서.

${COMMON_RULES}`;
}

async function askTwice(prompt, schema, maxTokens) {
  try {
    return await askClaude({ prompt, schema, maxTokens });
  } catch (e) {
    console.error('1차 실패, 다시 시도:', e && e.message);
    return await askClaude({ prompt, schema, maxTokens });
  }
}

const arr = (v, n) => (Array.isArray(v) ? v.filter(Boolean).slice(0, n) : []);

export async function makeCore(answers) {
  const s = await askTwice(promptA(answers), SCHEMA_A, 7000);
  return {
    title: s.title || '하루 자연놀이',
    concept: s.concept || '',
    whyThis: s.whyThis || '',
    special: arr(s.special, 4),
    target: s.target || '',
    whenWhere: s.whenWhere || '',
    flow: arr(s.flow, 8).filter((f) => f && f.name),
    materials: arr(s.materials, 12),
    prepCenter: arr(s.prepCenter, 8),
    prepTeacher: arr(s.prepTeacher, 8),
    safety: arr(s.safety, 10),
  };
}

export async function makeLinks(answers, core) {
  const s = await askTwice(promptB(answers, core), SCHEMA_B, 6000);
  return {
    prePlay: arr(s.prePlay, 4).filter((p) => p && p.name),
    postPlay: arr(s.postPlay, 4).filter((p) => p && p.name),
    parentNotice: s.parentNotice || '',
    parentRole: arr(s.parentRole, 6),
    alternatives: arr(s.alternatives, 5).filter((a) => a && a.when),
    recordTips: arr(s.recordTips, 4),
    closing: s.closing || '',
  };
}
