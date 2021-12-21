import {useRouter} from "next/router"

const Id = () => {
  const router = useRouter()
  return <h1>{router.query.id}</h1>
}

export default Id;