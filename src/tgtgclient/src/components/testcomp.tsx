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
        <div style={{ padding: '150px 0 150px 0' }}>
            Requests Failed
            <button onClick={() => refetch()}>Refetch</button>
        </div>
        )
    }   
    if (isLoading) return(
        <div style={{ padding: '150px 0 150px 0' }}>
            Loading: {isLoading}
        </div>
    )

    return (
        <div style={{ padding: '150px 0 150px 0'}}>
            {data}  
        </div>
    );
}

export default TestComp;