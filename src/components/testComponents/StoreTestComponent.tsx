import { useSelector } from 'react-redux';
import { userLogin } from '../../actions/userActions';
import store from '../../store';

export default function StoreTestComponent() {
    // データの受け取り
    const userid = useSelector((state: any) => state.userReducer.userid);
    const username = useSelector((state: any) => state.userReducer.username);

    const handleClick = () => {
        const input_userid = document.getElementById('userid') as HTMLInputElement;
        const input_username = document.getElementById('username') as HTMLInputElement;
        console.log(input_userid.value);
        console.log(input_username.value);

        // データの登録
        store.dispatch(userLogin(input_userid.value, input_username.value));

    }

    return (
        <div>
            <input id="userid" type="text"/>
            <input id="username" type="text"/>
            <button onClick={() => {handleClick()} }>Store</button>

            <p>{userid}</p>
            <p>{username}</p>

        </div>
    );
}