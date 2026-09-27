import './globals.css';

export const metadata = {
  title: '하루 자연놀이 기획 도우미',
  description: '우리 원 여건을 클릭으로 답하면, 한 번에 할 수 있는 하루 자연놀이 프로그램 기획안을 만들어 드립니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
