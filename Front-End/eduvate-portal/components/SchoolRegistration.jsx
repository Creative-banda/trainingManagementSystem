import { useQuery } from "@tanstack/react-query"
import api from "../interceptor/axios_interceptor"
import { useToken } from "../hooks/token_hooks"

const SchoolRegistration = () => {

  const { access_token } = useToken()
  const fetchUser = async () => {
    const response = await api.get("/school/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token
      }
    })
    
    return response?.data
  }

  const { refetch, data, isLoading, error } = useQuery({
    queryKey: ['fetchUser'],
    queryFn: () => fetchUser(),
  }
  )

  if(isLoading) return <h1>Loading</h1>

  if (error) return <h1>Error {error.message}</h1>

  console.log(data)

  return (
    <div>
      Hi
    </div>
  )
}

export default SchoolRegistration