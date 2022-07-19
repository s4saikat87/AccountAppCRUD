import React from 'react'
import logo from '../Images/accountingLogo.png';
const LogoPage = () => {
const styleLogo ={
width: '200px',
height: '70px'

}


  return (
    <div >
      <img style={styleLogo} src={logo}></img>
    </div>
  )
}

export default LogoPage
