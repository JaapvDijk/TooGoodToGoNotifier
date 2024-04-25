import { useQuery } from 'react-query';
import { Api } from '../../apiClient/Api';



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
            Request Failed <br/>
            <button onClick={() => refetch()}>Refetch Data</button>
        </>
        )
    }
    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            {data}  
        </>
    );
}

export default TestComp;