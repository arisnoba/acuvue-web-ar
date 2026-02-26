# Project Starter Template

협업 시 코드 스타일 통일을 위한 Git 템플릿 레포지토리입니다.

## 포함된 설정

| 파일 | 용도 |
|------|------|
| `.editorconfig` | 에디터 기본 설정 (탭, 인코딩, 줄바꿈) |
| `.prettierrc` | 코드 포맷팅 규칙 |
| `.prettierignore` | Prettier 제외 파일 |
| `.eslintrc.json` | TypeScript 린트 규칙 |
| `.gitignore` | Git 제외 파일 |
| `.nvmrc` | Node.js 버전 (v22) |
| `.vscode/` | VS Code 팀 공유 설정 |

## 시작하기

### 1. 템플릿으로 새 레포지토리 생성

GitHub에서 "Use this template" 버튼 클릭 또는:

```bash
git clone https://github.com/your-username/temp-start.git my-project
cd my-project
rm -rf .git
git init
```

### 2. Node.js 버전 설정

```bash
nvm use
```

> `.nvmrc`에 지정된 Node.js 22 버전이 설치됩니다.

### 3. 필수 패키지 설치

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier prettier
```

### 4. package.json 스크립트 추가

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## VS Code 설정

### 권장 확장 프로그램

프로젝트를 열면 자동으로 설치 권장 알림이 표시됩니다:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 코드 포맷터
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 린터
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) - 에디터 설정
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind 자동완성

### 자동 포맷팅

`.vscode/settings.json`에 의해 **저장 시 자동 포맷팅**이 적용됩니다.

## 코드 스타일 규칙

### Prettier (`.prettierrc`)

```
- 싱글 쿼터 사용
- 세미콜론 필수
- 탭 사용 (너비: 2)
- 후행 쉼표: all
- 줄 너비: 120자
```

### ESLint (`.eslintrc.json`)

```
- no-unused-vars: 미사용 변수 경고
- no-console: console.log 경고
- no-explicit-any: any 타입 경고
- consistent-type-imports: import type 강제
- prefer-const: const 사용 강제
- no-var: var 사용 금지
- eqeqeq: === 사용 강제
- curly: 중괄호 필수
```

## 선택적 설정

### Git Hooks (Husky + lint-staged)

커밋 전 자동 린트/포맷팅을 원하면:

```bash
npm install -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

`package.json`에 추가:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,scss}": ["prettier --write"]
  }
}
```

### React 프로젝트

React를 사용한다면 ESLint 플러그인 추가:

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

`.eslintrc.json`의 `extends`에 추가:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

## Claude Code 설정 (선택)

`.claude/` 폴더에 Claude Code용 skills와 agents가 포함되어 있습니다.
사용하지 않는다면 삭제해도 됩니다.

```bash
rm -rf .claude/
```

## 문제 해결

### ESLint가 작동하지 않을 때

1. VS Code에서 ESLint 확장 프로그램 설치 확인
2. 패키지 설치 확인: `npm ls eslint`
3. VS Code 재시작

### Prettier 포맷이 적용되지 않을 때

1. VS Code 기본 포맷터 확인: `Cmd+Shift+P` → "Format Document With..." → Prettier 선택
2. `.prettierignore`에 해당 파일이 포함되어 있는지 확인

### Node.js 버전 불일치

```bash
nvm install 22
nvm use
```
