import { NextResponse } from 'next/server';

export async function GET() {
  // Apple App Site Association (AASA) 파일 내용
  // appID는 Team ID + Bundle ID 형식입니다 (예: ABCDE12345.com.finshot.coinshot)
  // paths는 앱에서 처리할 경로 패턴입니다
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "Q8GJ836TBN.com.testfinshot.coinshot",
          paths: ["*"],
          // 특정 경로만 처리하려면 다음과 같이 설정할 수 있습니다
          // paths: ["/deeplink/*", "/share/*"]
          appIDs: ["Q8GJ836TBN.com.testfinshot.coinshot"],
          components: [
            {
              "/": {
                comment: "모든 경로 처리"
              }
            }
          ]
        }
      ]
    }
  };

  // JSON 응답 반환 및 적절한 Content-Type 헤더 설정
  return NextResponse.json(aasa, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // 캐싱 설정 (1시간)
    }
  });
} 