import { useSelector } from 'react-redux';
import { userLogin } from '../../actions/userActions';
import { meetingJoinAction } from '../../actions/meetingActions';
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

    // データの受け取り
    const meetingId = useSelector((state: any) => state.meetingReducer.meetingId);
    const meetingName = useSelector((state: any) => state.meetingReducer.meetingName);

    const handleClick2 = () => {
        const input_meetingId = document.getElementById('meetingId') as HTMLInputElement;
        const input_meetingName = document.getElementById('meetingName') as HTMLInputElement;
        console.log(input_meetingId.value);
        console.log(input_meetingName.value);

        // データの登録
        store.dispatch(meetingJoinAction(+input_meetingId.value, input_meetingName.value, "1990/01/01 00:00:00", [], []));

    }

    return (
        <div>
            <input id="userid" type="text"/>
            <input id="username" type="text"/>
            <button onClick={() => {handleClick()} }>Store</button>

            <p>{userid}</p>
            <p>{username}</p>

            <input id="meetingId" type="number"/>
            <input id="meetingName" type="text"/>
            <button onClick={() => {handleClick2()} }>Store</button>

            <p>{meetingId}</p>
            <p>{meetingName}</p>

        </div>
    );
}