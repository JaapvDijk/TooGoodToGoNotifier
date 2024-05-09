import { useQuery } from 'react-query';
import { ApiClient } from '../apiClient/ApiClient';

const TestComp = () => {
    const api = ApiClient.getInstance();

    const getHello = async () => {
        const res = await api.basketHelloworldList();
        return res.data;
    };

    const { refetch, data, error, isLoading } = useQuery('helloWorld', getHello);

    if (error)
    {
        return(
        <>
            Requests Failed
            <button onClick={() => refetch()}>Refetch</button>
        </>
        )
    }   
    if (isLoading) return(
        <div>Loading: {isLoading}</div>
    )

    return (
        <>
            {data}  
        </>
    );
}

export default TestComp;