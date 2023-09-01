import React, { useState } from 'react'
import { styled } from 'styled-components'
import { auth } from '../../firebase.js'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import logoImg from '../../img/logo.png'
import google from '../../img/google.png'
import { setMissionCard } from '../../api/MissionCardsApi.jsx'
import { current } from '@reduxjs/toolkit'
function Signup() {
  const navigate = useNavigate()

  // 회원가입시 필요한 정보
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'password') {
      setPassword(value)
    }
    if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }
  }

  const Signup = async (e) => {
    e.preventDefault()
    if (email.length === 0) {
      alert('이메일을 입력해주세요')
    } else if (password.length === 0 || confirmPassword.length === 0) {
      alert('비밀번호를 입력해주세요')
    } else if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다')
    }

    if (password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // The provider which was used to authenticate the user.
        await setMissionCard(userCredential.user.uid)

        alert('회원가입에 성공했습니다.')

        // 로그인이 완료되었을 때 사용자 정보 확인

        const user = userCredential.user
        console.log('로그인된 사용자 이메일:', user.email)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        navigate('/')
        console.log(userCredential)
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('이미 사용된 이메일입니다.')
        } else if (error.code === 'auth/weak-password') {
          alert('비밀번호가 6자리 이하입니다.')
        } else if (error.code === 'auth/invalid-email') {
          alert('이메일 형식을 확인 해주세요.')
        } else {
          console.log(error)
          alert('회원가입에 실패 했습니다.')
        }
      }
    }
  }

  const [googleUserData, setGoogleUserData] = useState(null)

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((data) => {
        setGoogleUserData(data.user)
      })
      .catch((err) => {
        alert(err)
      })
  }

  return (
    <>
      <SignupBox>
        <div>
          <SignupH1>회원가입 </SignupH1>
          <SignupText>칭구의 일원이 되어 긍정적인 에너지를 나눠보세요!</SignupText>
        </div>
        <SignupAreaBox>
          <SignupImg src={logoImg} />
          <button>프로필이미지등록</button>
          <div>
            <div>
              <SignForm>
                <SignInputArea>
                  <SignupInputLabel>아이디</SignupInputLabel>
                  <SignupInput placeholder="아이디를 입력해주세요" type="email" name="email" value={email} onChange={onChange} />
                </SignInputArea>
                <SignInputArea>
                  <SignupInputLabel>비밀번호</SignupInputLabel>
                  <SignupInput placeholder="비밀번호를 입력해주세요" type="password" name="password" value={password} onChange={onChange} />
                </SignInputArea>
                <SignInputArea>
                  <SignupInputLabel>비밀번호 확인</SignupInputLabel>
                  <SignupInput placeholder="비밀번호를 입력해주세요" type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} />
                </SignInputArea>
                <SignInputArea>
                  <SignupInputLabel>닉네임</SignupInputLabel>
                  <SignupInput placeholder="닉네임을 입력해주세요 " type="text" name="nickname" />
                </SignInputArea>
                <SignInputArea>
                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <SignupBtn onClick={Signup}>가입하기</SignupBtn>
                </SignInputArea>
              </SignForm>
            </div>
            <SignWithGoogleArea>
              <SignLine> ㅡ OR ㅡ </SignLine>
              <SignWithGoogleBtn onClick={handleGoogleLogin}>
                <GoogleLogoImg src={google}></GoogleLogoImg>Google로 시작하기
              </SignWithGoogleBtn>
            </SignWithGoogleArea>
          </div>
        </SignupAreaBox>
      </SignupBox>
    </>
  )
}

export default Signup

const SignupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const SignupText = styled.div`
  color: #404040;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`

const SignupH1 = styled.div`
  color: #404040;
  text-align: center;
  font-family: LINE Seed Sans KR;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 15px;
  margin-bottom: 15px;
`

const SignupAreaBox = styled.div`
  display: flex;
  height: 975 px;
  width: 736px;
  flex: 100;
  flex-direction: column;
  align-items: center; /* 변경된 부분: 가운데 정렬 */
  gap: 48 px;
  flex-shrink: 0;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
`

const SignupImg = styled.div`
  margin-left: 308px;
  margin-right: 308px;
  width: 36px;
  height: 26;
  display: flex;
  width: 120px;
  height: 75px;
  padding: 24px 43px 25px 41px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-bottom: 10px;
`

const SignForm = styled.form`
  text-align: left;
`

const SignInputArea = styled.div`
  margin-left: 128px;
  margin-right: 128px;
  width: 480px;
`

const SignupInputLabel = styled.div`
  display: flex;
  width: 480px;
  height: 20px;
  padding: 0px 8px;
  margin-top: 32px;
  align-items: center;
  flex-shrink: 0;
  color: #404040;
`
const SignupInput = styled.input`
  display: flex;
  width: 480px;
  height: 42px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 1px solid #d9d9d9;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 1;
  color: #d9d9d9;
`
const SignupBtn = styled.button`
  display: flex;
  width: 480px;
  height: 56px;
  padding: 13px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  border: none;
  background: #69535f;
  margin-top: 48px;
  margin-bottom: 48px;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.64px;
  cursor: pointer;
`
const SignWithGoogleArea = styled.div`
  margin-left: 128px;
  margin-right: 128px;
`
const SignLine = styled.div`
  display: flex;
  width: 480px;
  height: 19px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  justify-content: center;
  color: #666666;
  margin-top: -17px;
`

const SignWithGoogleBtn = styled.button`
  display: flex;
  margin-top: 16px;
  width: 480px;
  height: 56px;
  padding: 8px 0px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #404040;
  background: var(--white, #fff);
  color: #404040;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 110%; /* 17.6px */
  cursor: pointer;
`
const GoogleLogoImg = styled.img`
  width: 25px;
  height: 25px;
`
