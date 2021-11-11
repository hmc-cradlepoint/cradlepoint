import useUser from '../util/useUser';
import PlainScreen from '../components/baseScreen/PlainScreen';

const SgProfile = () => {
  const { user } = useUser({ redirectTo: '/login' })

  if (!user || user.isLoggedIn === false) {
    return <PlainScreen>loading...</PlainScreen>
  }

  return (
    <PlainScreen>
      <h1>Welcome {user.firstName} {user.lastName}</h1>
      <p>You are
        {user.userType === 1 && " an Admin!"}
        {user.userType === 2 && " a POC Engineer!"}
        {user.userType === 3 && " a SE!"}
        {user.userType === 4 && " a customer!"} 
      </p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </PlainScreen>
  )
}

export default SgProfile;
