# nodejs-react-tutorial

---

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

* 연결
    - app.js 몽고디비 관련 세팅 및 연결 추가
    - 선행작업 : 터미널에서 mongod 로 몽고디비 실행


### 6. MongoDB 사용하기 & 게시글 리스트/상세/작성/삭제 추가

* 모델 생성(스키마)
  - mongoose schema 를 사용해서 Model을 만든다.


* 생성된 모델을 사용해서 find, save, remove 사용
  - routes/posts에서 라우팅이 연결되면 MongoDB를 사용해서 데이터 관리
  - 데이터 관리 및 가공해서 /views/posts 로 이동 및 데이터 전달


---

## Step 2

### 7. 게시글 수정
* 수정시 글쓰기 화면에 다시 내용을 복구(이렇게 내용을 복구하게 하면 그냥 작성시에 post가 없어서 에러가 나기때문에 `{ post:"" }` 로 빈값을 세팅해준다.)
* 수정된 내용을 MongoDB에 update


### 8. 게시글 상세에서 댓글 구현 (ajax 통신구현)
views
└─ header.ejs

* 위 경로에 jQuery를 불러오는 스크립트가 선언되어 있다.

* 왜 comment는 ajax로 구현하는가?
 - 댓글을 작성헤도 페이지에 변동이 없도록 하기위해

* CommentModel을 생성해서 Schema를 구현
* 댓글 추가/삭제 route 만들어서 json으로 리턴 후 view단에서 jQuery, ajax form 전송을 통해서 뷰 갱신
* detail:id/ 부분에서 게시글 상세와 댓글을 같이 넘여야 하므로 MongoDB 쿼리 중첩으로 한번에 전달한다. `{ post, comments }`

### 9. 유효성 확인(Validation Check)
* Mongoose에서 Schema를 만들때 validation 생성

```javascript
// 구현
var PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "제목을 입력해주세요"] // validation 처리
  }
});

// 사용
var post = new PostModel({
    title: req.body.title
  });

  // validation 확인
  var validationError = post.validateSync();
  if (validationError) {
    
  } else {
    
  }
```

### 10. CSRF(Cross-Site Request forgery) 적용

> 설치

```sh
$ npm install --save csurf
```

* 어떤 문제를 발생할수 있는가?
    - 사용자가 자신의 의지와는 무관하게 글을 등록, 수정, 삭제를 요청(2008년 옥션 해킹에도 사용된 기법)
    - action을 보고 어떤 URL로 폼을 전송하는지 보고 action의 위치로 필드명만 일치한 폼을 전송(hidden으로 감싸서 안보이게 처리)

* CSRF 방어법 (토큰 발행)
    - 클라이언트, 서버 토큰 발행 -> 글 작성전 서버에서 생성한 토큰과 일치확인 (hidden 타입으로 서버에서 발행한 토큰을 넘겨주고 router에서 일치하는지 확인)
    - form 전송이 있는곳에 전부 적용

* 테스트
    - form.ejs, detail.ejs에서 <form> 아래 hidden type으로 숨어있는 csrf token을 주석처리하고 테스트 해보면 에러가 발생


### 11. Multer - 이미지 업로드

> 설치

```sh
$ npm install --save multer
```

* Multer란?
    - 웹 파일 전송 방식중에서 multipart/form-data 방식을 지원해주는 모듈

* 적용순서
  1. npm으로 multer 설치
  2. DB에 저장될 필드 수정(PostModel)
  3. 파일을 업로드할 uploads 폴더 생성
  4. app.js에 static path 추가
  5. router 처리(게시글 쓰기, 수정) / 수정, 쓰기 파일에서 <form>안에 enctype="multipart/form-data" 속성 추가
  6. detail 이미지 보여주기

* 파일삭제
  - 내장모듈 fs(파일시스템) 사용

  ```javascript
  // 비동기식 삭제
  fs.unlink(PATH, function(error){});
  

  // 동기식 삭제
  fs.unlinkSync(PATH);
  ```


### 12. Passport 회원가입 / 로그인

* 회원가입 구현순서
 1. UserModel 작성
 2. accounts router 작성
 3. 회원가입 폼 작성
 4. 로그인 폼 작성
 5. 비밀번호 암호화 내부모듈 작성
    libs
    └─ passwordHash.js

* 로그인 구현순서
 1. passport 모듈 설치
  > 설치

  ```sh
  $ npm install –-save express-session
  $ npm install --save passport
  $ npm install –-save passport-local
  $ npm install –-save connect-flash
  ```

 2. app.js 설정
  - 설치한 모듈 설정

 3. accounts router - passport 적용
 4. flash 메시지 적용


* 페이스북 로그인 구현순서
  1. 페이스북 개발자 등록
  2. Facebook 앱 ID 발급 (https://developers.facebook.com에서 appId 및 scretID 발급)
  3. 소스코드 작성
    routes
    └─ auth.js

  * 소스코드 작성 순서
    1. npm 설치(passport-facebook)
      > 설치
      
      ```sh
      $ npm install –-save passport-facebook
      ```
      
    2. FacebookStrategy 작성
    3. 인증링크 생성
    4. callback 페이지 작성
    5. 리다이렉트 페이지 작성
    6. app.js router 연결
