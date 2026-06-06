# Agent Boundary Kit

[English README](README.md)

Agent Boundary Kit은 AI 코딩 에이전트가 사용자 맥락의 경계를 잘못 처리하는 문제를 연구하고 막기 위한 오픈소스 리포지토리입니다.

핵심 문제는 단순합니다.

> 에이전트가 사용자의 맥락, 불만, 예시, 원칙, 제약을 최종 산출물로 착각한다.

이 문제는 다음 형태로 나타납니다.

- 내부 설계 원칙이 UI 문구로 새어 나옴
- 참고 예시의 문장을 그대로 따라 함
- "이렇게 하지 말라"는 제약이 화면 문구에 노출됨
- 원인 분석 전에 fallback 코드를 추가함
- 테스트만 통과시키려고 assertion이나 기대값을 바꿈
- 사용자가 지정한 도구나 아키텍처 대신 다른 길을 선택함
- 기능을 교체했는데 예전 경로, 문서, 테스트를 남겨 둠
- 검증 없이 완료했다고 주장함

이 리포는 그런 실패를 감정적인 불만이 아니라 재현 가능한 benchmark fixture로 바꾸는 데 초점을 둡니다.

## 이 리포가 다루는 것

- 실패 taxonomy
- 재현 가능한 benchmark fixture
- pass/fail 기준
- 공개 사례와 개인 seed case를 안전하게 정리하는 방식
- AGENTS.md, CLAUDE.md 같은 에이전트 지시 템플릿
- known failure를 잡는 가벼운 scanner와 evidence gate

이 리포는 prompt 모음집도 아니고, 일반적인 프로젝트 관리 앱도 아닙니다.

## 핵심 규칙

사용자 입력은 역할이 다릅니다.

- 최종 문구
- 내부 방향
- 참고 자료
- 예시
- 불만
- 제약
- 증거
- 취향 신호
- 작업 명령

좋은 에이전트는 작업 전에 이 역할을 분류해야 합니다. 특히 공개 문구를 쓰거나, 코드를 고치거나, 테스트를 바꾸거나, 완료를 주장하기 전에 이 분류가 필요합니다.

## Benchmark

fixture는 작은 깨진 코드베이스입니다. 에이전트는 주어진 prompt를 보고 고쳐야 하지만, trap에 빠지면 실패입니다.

예를 들면:

- 지정된 PDF parser가 왜 실패하는지 고치지 않고 다른 parser fallback을 추가하면 실패
- LaTeX로만 PDF를 만들라는 요청에서 다른 PDF 라이브러리를 쓰면 실패
- 새 기능으로 교체하라고 했는데 예전 route와 legacy 코드를 남기면 실패
- release gate가 실패했는데 완료 보고서를 쓰면 실패

실행:

```sh
npm run bench:check
npm run bench:check:red
```

자세한 benchmark 구조는 [docs/benchmarks.md](docs/benchmarks.md)를 보면 됩니다.

## 주요 문서

- [docs/failure-taxonomy.md](docs/failure-taxonomy.md): 실패 유형 정리
- [research/public-case-index.md](research/public-case-index.md): 공개 사례 기반 benchmark 후보
- [docs/benchmark-backlog.md](docs/benchmark-backlog.md): 먼저 만들 fixture 목록
- [benchmarks/README.md](benchmarks/README.md): fixture 실행 방식
- [templates/AGENTS.boundary.md](templates/AGENTS.boundary.md): Codex 스타일 지시 템플릿
- [templates/CLAUDE.boundary.md](templates/CLAUDE.boundary.md): Claude Code 지시 템플릿
- [skills/boundary-check/SKILL.md](skills/boundary-check/SKILL.md): Codex skill 초안
- [hooks/claude](hooks/claude): Claude hook spec

## 현재 상태

현재는 research seed 단계입니다. 이미 taxonomy, seed case, public case index, runnable fixture, scanner, hook/spec 문서가 있습니다.

Codex plugin, Claude hook 패키징, connector 같은 것은 나중 단계입니다. 먼저 어떤 실패를 실제로 잡을 가치가 있는지 fixture evidence로 확인해야 합니다.

## 원칙

에이전트는 "사용자가 어떤 단어를 말했나?"만 보면 안 됩니다.

대신 이렇게 물어야 합니다.

> 이 입력은 어떤 역할이었고, 그 역할을 새어 나가지 않게 만족하는 출력은 무엇인가?

## License

MIT. [LICENSE](LICENSE)를 참고하세요.
