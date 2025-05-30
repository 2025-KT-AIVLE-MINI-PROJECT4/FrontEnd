import './App.css'

export default function newUser() {

  return (
    <>
    <div>
      <div>
        <h1>회원가입</h1>
        <div>
          <div>
          <input
            type="text"
            placeholder="아이디"
            className="id"
            style = {{
              width: "300px",
              height: "30px",
              margin: "1px"
            }}/>
          </div>
          <div>
          <input
            type="text"
            placeholder="이름"
            className="name"
            style = {{
              width: "300px",
              height: "30px",
              margin: "1px"
            }}/>
          </div>
          <div>
          <input
            type="password"
            placeholder="비밀번호"
            className="pw"
            style = {{
              width: "300px",
              height: "30px",
              margin: "1px"
            }}/>
          </div>
          <div>
          <input
            type="email"
            placeholder="이메일"
            className="email"
            style = {{
              width: "300px",
              height: "30px",
              margin: "1px"
            }}/>
          </div>
        </div>
        <button className="newUser">
          회원 가입
        </button>
      </div>
    </div>
    </>
  )
}
