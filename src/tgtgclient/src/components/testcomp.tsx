import { useQuery } from 'react-query';
import { Api } from '../apiClient/Api';


const api = new Api();


const TestComp = () => {
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