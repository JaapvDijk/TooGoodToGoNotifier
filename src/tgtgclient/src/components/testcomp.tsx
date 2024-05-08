import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { apiSelectors } from '../redux/api';

const TestComp = () => {
    const api = useSelector(apiSelectors.selectApi);

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