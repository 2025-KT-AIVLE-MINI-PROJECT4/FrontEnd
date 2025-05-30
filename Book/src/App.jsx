import { useState } from 'react'
import './App.css'
import {useNavigate} from "react-router-dom"

export default function App() {

  const navigate = useNavigate();

  return (
    <>
    <div>
      <div>
        <h1>도서 관리 시스템</h1>
        <div>
          <input
            type="text"
            placeholder="아이디"
            className="id"/>
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            className="pw"/>
        </div>
        <div>
          <button>
            로그인
          </button>
          <button onClick={() => navigate("/newUser")}>
            회원가입
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
