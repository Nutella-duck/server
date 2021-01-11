![좌표](./logo.png)

# Introduction

- 머신러닝 개발자를 위한 모델 성능 시각화 서비스 및 성능향상을 위한 HPO 서비스를 제공하는 웹 사이트.

- 개발기간 : 2020.06 ~ 2020.11 (약 6개월)

# API

아래 내용은 [Swagger](http://ec2-3-34-251-160.ap-northeast-2.compute.amazonaws.com:7000/docs/)를 통해 확인 가능.       
         
■ Project 관련 API

1. /admin/project

- GET : 프로젝트 6개씩 한 페이지로 읽어오기.

- POST : 프로젝트 생성.

2. /admin/project/:id

- GET : work space에서 프로젝트 정보 받아올 때, 기본 프로젝트 한 개 정보를 받아옴.

- DELETE : id에 해당하는 프로젝트 삭제.

- PUT : id에 해당하는 프로젝트 수정.

■ RUN 관련 API

1. /admin/run  
   GET : 모델 정보 10개씩 불러오기.

2. /admin/run/:id  
   GET : id에 해당하는 모델 정보 불러오기.

   DELETE : id에 해당하는 모델 삭제.

   PUT : id에 해당하는 모델 정보 수정.

■ GRAPH 관련 API

1. /admin/graph/{id}
   GET : 그래프 관련 좌표 정보 불러오기.

■ HPO 관련 API

1. /admin/hpo/key
   GET : hpo 프로젝트 api key 값 정보 불러오기.

2. /admin/hpo/config/{id}
   GET : hpo 환경설정 값들에 대한 정보 받아오기.

3. /admin/hpo/config
   POST : hpo 환경설정 값들에 대한 정보 데이터베이스에 저장.

4. /admin/hpo/hpoProject
   GET : hpo 프로젝트 관련된 정보들 불러오기.

   POST : hpo 프로젝트 생성.

5. /admin/hpo/result/{id}
   GET : 모델 성능향상에 필요한 하이퍼파라미터 정보 값들 불러오기.

6. /admin/hpo/bestResult/{id}
   GET : 모델 성능향상에 필요한 하이퍼라미터 값 중 가장 중요한 값의 정보 받아오기.

7. /admin/hpo/importances/{id}
   GET : 모델 성능향상에 필요한 하이퍼파라미터 중요도 정보를 불러오기.

■ 계정 관련 API

1. /auth/register
   POST : 회원가입.

2. /auth/login
   POST: 로그인.

3. /auth/logout
   GET : 로그아웃.
