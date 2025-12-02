import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()

  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <div>
        <h1>Greetings to MyBlog</h1>
        Logged in as{' '}
        <strong>
          {' '}
          <User id={sub} />{' '}
        </strong>
        &nbsp;
        <br />
        <button onClick={() => setToken(null)}>Log out</button>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Greetings to MyBlog</h1>
        <Link to='/login'>Log In</Link> &nbsp; | &nbsp;{' '}
        <Link to='/signup'>Sign Up</Link>
      </div>
    )
  }
}
