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
- 브라우저에서 http://localhost:3000 접속 확인

```sh
$ npm install -g nodemon
```
- package.json > script > start > node -> nodemon 으로 변경해주면 소스 수정시 재시작 필요 없이 바로 적용


### 2. views 폴더에 header.ejs, footer.ejs, error.ejs 생성
- views/index.ejs 파일에서 header와 footer를 include 해서 사용

| 파일명 | 설명 |
| ------ | ------ |
| views/header.ejs | html, head, jquery, bootstrap, navigation 등의 사용을 위해 세팅 |
| views/footer.ejs | End Tag - body, html |
| views/index.ejs | 컨텐츠 영역 |
| views/error.ejs | 에러 표시 |

### 3. 기본적인 게시판을 만들기위해 필요한 뷰연결
- 화면에 어떤 뷰인지만 간단하게 표시
| 폴더명 | 설명 |
| ------ | ------ |
| account | 계정(로그인/회원가입) 관련 폴더 |
| chat | 채팅 관련 폴더 |
| post | 게시글 관련 폴더 |