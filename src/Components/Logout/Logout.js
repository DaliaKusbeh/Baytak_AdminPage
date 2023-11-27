import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Login from '../Login/Login'
const Logout = () => {
  return (
    <div>
      <script type="text/javascript">
        function fun() {
          prompt("This is a prompt box", "Hello world")
        }
      </script>



      <p> Click the following button to see the effect </p>
      <form>
        <input type="button" value="Click me" onclick="fun();" />
      </form>

    </div>
  )
}

export default Logout