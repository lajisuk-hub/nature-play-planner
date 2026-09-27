// 기획안의 「왜 이 놀이인가」에 붙일 근거 논문 목록.
// AI는 이 목록 안에서만 골라 인용합니다(없는 논문을 지어내지 않게).
export const EVIDENCE = [
  { id: 'kaplan1995', cite: 'Kaplan (1995), Journal of Environmental Psychology', claim: '억지로 집중하는 힘은 쉽게 지치지만 자연은 저절로 끌리는 관심으로 주의력을 회복시킨다(주의회복이론)' },
  { id: 'ulset2017', cite: 'Ulset 외 (2017), Journal of Environmental Psychology', claim: '노르웨이 유치원생 562명 4년 추적: 바깥 시간이 많을수록 주의력↑ 산만함·과잉행동↓, 5~6세에 효과 최대, 값싸고 누구나 할 수 있는 방법' },
  { id: 'fabertaylor2009', cite: 'Faber Taylor & Kuo (2009), Journal of Attention Disorders', claim: 'ADHD 아동이 공원을 20분 걸은 뒤 집중력이 약물 효과 크기만큼 향상' },
  { id: 'kuo2019', cite: 'Kuo, Barnes & Jordan (2019), Frontiers in Psychology', claim: '자연은 주의력·스트레스·자기조절·흥미·신체활동 다섯 길로 배움을 돕고, 더 조용하고 협력적인 분위기를 만든다' },
  { id: 'fjortoft2001', cite: 'Fjørtoft (2001), Early Childhood Education Journal', claim: '숲에서 논 5~7세가 일반 놀이터 아이보다 균형·협응 등 운동능력이 더 크게 향상' },
  { id: 'dankiw2020', cite: 'Dankiw 외 (2020), PLOS ONE', claim: '2~12세 자연놀이 연구 16편 종합: 신체활동과 상상놀이에 일관된 긍정 효과, 정해진 프로그램 없어도 효과' },
  { id: 'brussoni2015', cite: 'Brussoni 외 (2015), IJERPH', claim: '적당한 도전이 있는 바깥놀이는 신체활동·사회성·창의성·회복력↑ 공격성↓' },
  { id: 'sandseter2009', cite: 'Sandseter (2009), Early Childhood Education Journal', claim: '자연 놀이터는 더 다양한 도전 놀이를 품고, 교사가 허용하는 자유가 그것을 실제 놀이로 바꾼다' },
  { id: 'nicholson1971', cite: 'Nicholson (1971), Landscape Architecture', claim: '정해진 용도가 없는 재료(느슨한 부품)가 많을수록 창의성과 발견이 늘어난다' },
  { id: 'ji2013', cite: '지성애 (2013), 유아교육학논집', claim: '모래·물·점토처럼 구조가 낮은 놀잇감으로 논 유아가 창의성·사회적 행동에서 더 높은 점수' },
  { id: 'jang2017', cite: '장미숙 (2017), 홀리스틱융합교육연구', claim: '만 1·2세 영아 숲 산책 10주 후 어휘력·의사소통능력 유의하게 향상' },
  { id: 'moon2019', cite: '문현숙·이태연 (2019), 미래유아교육학회지', claim: '3~5세 숲 체험 12회기 후 자율성·협동성·사회적 상호작용·조망수용 모두 향상' },
  { id: 'kim2019', cite: '김인숙 (2019), 대구한의대 박사학위논문', claim: '만 2세 영아 63명, 숲 연계 바깥놀이 12주 후 사회정서 발달과 또래 대상 놀이행동 향상' },
  { id: 'cho2019', cite: '조유진 (2019), 유아교육학논집', claim: '4세 숲활동 연계 신체표현 7주 후 언어·운동능력·자아존중감 향상' },
  { id: 'jangcs2016', cite: '장철순·구창덕·황연주 (2016), 한국환경생태학회지', claim: '만 5세 숲 오감체험 12회 후 자아효능감·생명존중 인식 향상' },
  { id: 'kang2012', cite: '강영식·김용숙 (2012), 열린유아교육연구', claim: '생명존중 숲 체험 후 자연에 대한 관심·심미적 체험·정서적 안정 등 환경 감수성 전 영역 향상' },
  { id: 'seo2015', cite: '서현·정은숙 (2015), 유아교육연구', claim: '자연친화 바깥놀이 12주(24차시) 후 환경친화적 태도·사회적 유능감 향상' },
  { id: 'lee2018', cite: '이아름·김낙흥 (2018), 유아교육연구', claim: '지역 자원을 활용한 전통문화(세시풍속) 교육 20회 후 전통문화 인지·지역공동체 의식·창의적 인성 향상' },
  { id: 'chawla2020', cite: 'Chawla (2020), People and Nature', claim: '어릴 때 자연과 이어진 아이는 더 행복하고 자기조절을 잘하며, 성인기 자연 보호 행동으로 이어진다' },
  { id: 'sung2015', cite: '성소영·정계환 (2015), 열린유아교육연구', claim: '36개월 미만 영아 부모의 76% 이상이 숲체험놀이가 필요하다고 응답' },
  { id: 'leesh2019', cite: '이숙희 (2019), 생태유아교육연구', claim: '숲에서 유아는 시간·공간·몸·관계의 주체가 되어 스스로 놀이를 만들어 간다' },
];

export function evidenceText() {
  return EVIDENCE.map((e) => `- [${e.id}] ${e.cite}: ${e.claim}`).join('\n');
}

export function findEvidence(id) {
  return EVIDENCE.find((e) => e.id === id) || null;
}
