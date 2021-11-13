import useUser from '../util/useUser';
import fetcher from '../util/fetchJson';
import useSWR from "swr"
import PlainScreen from '../components/baseScreen/PlainScreen';

const myTest = () => {
  const url = ""
  const { data, error } = useSWR(url, fetcher);

  if (!user) {
    return <PlainScreen>loading...</PlainScreen>
  }

  return (
    <PlainScreen>
      <h1>Welcome</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </PlainScreen>
  )
}

export default myTest;
