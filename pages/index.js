import axios from 'axios'

export default function Home() {
  
  axios.get(`/api/hello`).then(console.log);

  return (
    <div className='login-container'>
      <h1>Hello World</h1>
    </div>
  )
}
