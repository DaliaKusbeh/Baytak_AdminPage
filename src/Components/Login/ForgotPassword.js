import React from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
const ForgotPassword = () => {
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Reset Password</h2>
          <Form>
            <Form.Group>
              <Form.Label htmlFor='email'>Email</Form.Label>
              <Form.Control type="email" id="email" />
            </Form.Group>
            
            <Button variant="primary" type="submit" className='w-100 mt-3'>
              submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-3'>
        <Link to="/Login">Go to Log in</Link>
      </div>
    </>
  )
}

export default ForgotPassword