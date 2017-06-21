# nodejs-react-tutorial

## Step 1

### 1. express-generator로 ejs 프로젝트 만들기
```sh
$ npm install -g express express-generator
$ express --ejs myapp
$ cd myapp
$ npm install
$ npm start
```

 * 브라우저에서 http://localhost:3000 접속 확인

```sh
$ npm install -g nodemon
```
 * package.json > script > start > node -> nodemon 으로 변경해주면 소스 수정시 재시작 필요 없이 바로 적용


### 2. views 폴더에 header.ejs, footer.ejs, error.ejs 생성
 * views/index.ejs 파일에서 header와 footer를 include 해서 사용
 * 디자인은 bootstrap 사용

| 파일명 | 설명 |
| ------ | ------ |
| views/header.ejs | html, head, jquery, bootstrap, navigation 등의 사용을 위해 세팅 |
| views/footer.ejs | End Tag - body, html |
| views/index.ejs | 컨텐츠 영역 |
| views/error.ejs | 에러 표시 |


### 3. 기본적인 게시판을 만들기위해 필요한 routes 추가
 * 화면에 어떤 routes가 연결되었는지 간단하게 표시

| 라우터명 | 설명 |
| ------ | ------ |
| routes/accounts | 계정(로그인/회원가입) 관련 라우터 |
| routes/chat | 채팅 관련 라우터 |
| routes/posts | 게시글 관련 라우터 |

 * routes 작성 후 app.js -> Router 추가


### 4. 기본적인 게시판을 만들기위해 필요한 views 추가
 * 네비메뉴 선택시 화면 렌더링(데이터는 없고 기본 틀만 작성한 상태)

| 폴더명 | 설명 |
| ------ | ------ |
| views/account | 계정(로그인/회원가입) 관련 폴더 |
| views/chat | 채팅 관련 폴더 |
| views/post | 게시글 관련 폴더 |


 * routes/xxx.js에서 화면 렌더링시 첫번째 인자값으로 view path가 온다.
    render(view: string, options?: Object, callback?: (err: Error, html: string) => void): void; 


### 5. 몽고디비 설치 & 연결

> 설치

```sh
$ npm install --save mongodb mongoose mongoose-auto-increment
```

| 폴더명 | 설명 |
| ------ | ------ |
| mongodb | 몽고디비 |
| mongoose | 스키마 작성, 캐스팅, 유효성 검사, 쿼리 작성등을 도와주는 라이브러리 |
| mongoose-auto-increment | id값을 자동으로 생성해주는 라이브러리(이름, 증가치 등의 상세 설정 가능) |

**연결**
app.js 몽고디비 관련 세팅 및 연결 추가
선행작업 : 터미널에서 mongod 로 몽고디비 실행


### 6. MongoDB 사용하기 & 게시글 리스트/상세/작성/삭제 추가

**모델 생성(스키마)**

mongoose schema 를 사용해서 Model을 만든다.


* 생성된 모델을 사용해서 find, save, remove 사용
  - routes/posts에서 라우팅이 연결되면 MongoDB를 사용해서 데이터 관리
  - 데이터 관리 및 가공해서 /views/posts 로 이동 및 데이터 전달
