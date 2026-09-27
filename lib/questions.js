// 인터뷰 질문 정의. 여기만 고치면 화면과 AI 프롬프트가 함께 바뀝니다.
// type: multi(여러 개 클릭) / single(하나만 클릭) / text(짧게 쓰기)

export const STEPS = [
  {
    id: 'env',
    title: '1. 우리 원 주변, 자연놀이 할 곳',
    intro: '있는 그대로 답해 주세요. 마당밖에 없어도, 실내밖에 안 돼도 그에 맞는 놀이를 찾아 드립니다.',
    questions: [
      {
        id: 'places', type: 'multi', q: '자연놀이를 할 수 있는 곳은 어디인가요?', hint: '해당하는 곳을 모두 눌러 주세요.',
        options: ['원 마당·바깥놀이터', '원 근처 텃밭·화단', '걸어갈 수 있는 공원', '걸어갈 수 있는 작은 산·숲길', '하천·개울·바닷가', '유아숲체험원·수목원(예약 필요)', '차량으로 나가야 함', '밖에 나갈 곳이 없음(실내만 가능)'],
      },
      {
        id: 'move', type: 'single', q: '그곳까지 어떻게 가나요?',
        options: ['원 안에서 바로', '걸어서 10분 안', '걸어서 10~30분', '차량(버스)으로 이동'],
      },
      {
        id: 'duration', type: 'single', q: '활동에 쓸 수 있는 시간은요?',
        options: ['1시간 안팎', '반나절(오전 또는 오후)', '하루 종일(점심 포함)'],
      },
      {
        id: 'season', type: 'single', q: '언제 할 예정인가요?',
        options: ['봄(3~5월)', '여름(6~8월)', '가을(9~11월)', '겨울(12~2월)'],
      },
      {
        id: 'budget', type: 'single', q: '쓸 수 있는 예산은요?',
        options: ['거의 없음(있는 것으로)', '5만원 안팎', '10만원 이상 가능'],
      },
      {
        id: 'envNote', type: 'text', q: '우리 원 주변 환경을 한 줄로 알려 주세요.', placeholder: '예: 뒷산 산책로가 있는데 경사가 좀 있어요 / 아파트 단지 안이라 화단뿐이에요',
      },
    ],
  },
  {
    id: 'who',
    title: '2. 함께할 사람들',
    intro: '연령과 인원에 따라 놀이의 크기와 안전 준비가 달라집니다.',
    questions: [
      {
        id: 'ages', type: 'multi', q: '참여하는 아이들의 연령은요?', hint: '여러 반이면 모두 눌러 주세요.',
        options: ['만 0~1세', '만 2세', '만 3세', '만 4세', '만 5세', '혼합연령(형·동생 함께)'],
      },
      {
        id: 'count', type: 'text', q: '아이 몇 명, 교사 몇 명이 함께하나요?', placeholder: '예: 아이 24명, 교사 4명', short: true,
      },
      {
        id: 'parents', type: 'single', q: '부모님도 참여하나요?',
        options: ['부모님이 함께해요(가족 참여)', '희망하는 부모님만 일부', '부모님 없이 교사와 아이들만', '조부모님·가족 누구나'],
      },
      {
        id: 'special', type: 'text', q: '특별히 챙겨야 할 아이가 있나요?', placeholder: '예: 견과류 알레르기 1명, 아직 걸음이 불안한 영아 2명, 휠체어 이용 1명 (없으면 비워 두세요)',
      },
    ],
  },
  {
    id: 'why',
    title: '3. 이 자연놀이를 하려는 계기',
    intro: '행사에 얹는 것인지, 일과 속에 넣는 것인지에 따라 결이 달라집니다.',
    questions: [
      {
        id: 'occasion', type: 'multi', q: '어떤 자리에서 하나요?', hint: '가까운 것을 모두 눌러 주세요.',
        options: ['어린이집 소풍·현장학습', '운동회·가족놀이 한마당', '매일 하는 산책을 살리고 싶어서', '부모참여수업', '열린어린이집의 날', '세시풍속·명절(추석·설·단오·동지 등)', '생태·환경의 날(식목일·환경의 날 등)', '특별활동(외부강사) 대신', '평가제·컨설팅 준비', '그냥 한번 해 보고 싶어서'],
      },
      {
        id: 'whyNote', type: 'text', q: '왜 해 보고 싶은지 한 줄로 적어 주세요.', placeholder: '예: 특별활동비 없이도 아이들이 신나게 노는 걸 보여 주고 싶어요',
      },
      {
        id: 'level', type: 'single', q: '우리 원 선생님들의 자연놀이 경험은요?',
        options: ['거의 처음이에요', '몇 번 해 봤어요', '자주 하는 편이에요'],
      },
    ],
  },
  {
    id: 'hope',
    title: '4. 이 활동으로 보고 싶은 변화',
    intro: '무엇을 바라는지가 정해지면 놀이의 방향이 정해집니다.',
    questions: [
      {
        id: 'changes', type: 'multi', q: '어떤 변화를 바라시나요?', hint: '가장 바라는 것 2~3개를 눌러 주세요.',
        options: ['아이들이 더 많이, 더 신나게 움직였으면', '차분해지고 집중하는 시간이 늘었으면', '친구와 어울리고 함께 노는 힘', '말·표현이 늘었으면', '자연에 대한 관심, 생명을 아끼는 마음', '정서적 안정과 즐거움', '선생님 부담 없이 간단하게', '부모님 만족과 소통', '원 홍보(사진·소식지)에 쓸 장면'],
      },
      {
        id: 'scene', type: 'text', q: '활동이 끝났을 때 보고 싶은 장면 하나를 적어 주세요.', placeholder: '예: 아이들이 흙투성이 손으로 자기가 찾은 보물을 부모님께 자랑하는 모습',
      },
      {
        id: 'center', type: 'text', q: '어린이집 이름 (공지문에 들어갑니다)', placeholder: '예: 행복주택어린이집', short: true,
      },
    ],
  },
];

export const ALL_QUESTIONS = STEPS.flatMap((s) => s.questions);

export function emptyAnswers() {
  const a = {};
  for (const q of ALL_QUESTIONS) a[q.id] = q.type === 'multi' ? [] : '';
  return a;
}

// AI에게 보낼 글로 정리
export function answersToText(answers) {
  const lines = [];
  for (const s of STEPS) {
    lines.push(`[${s.title}]`);
    for (const q of s.questions) {
      const v = answers[q.id];
      let str = '';
      if (Array.isArray(v)) str = v.length ? v.join(', ') : '(고르지 않음)';
      else str = String(v || '').trim() || '(적지 않음)';
      lines.push(`- ${q.q} → ${str}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
