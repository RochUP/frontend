import { Button } from 'antd';

import { signup, login, meetingCreate, meetingJoin } from '../../utils/api';

function TestButton() {
    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    signup('test', 'test', 'test');
                }}
            >
                SignUp
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    login('test', 'test');
                }}
            >
                LogIn
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    meetingCreate('meeting02', '2022/02/22 00:00:00', ['koki1998', 'test01']);
                }}
            >
                MeetingCreare
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    meetingJoin('koki1998', 294);
                }}
            >
                MeetingJoin
            </Button>
        </div>
    );
}

export default TestButton;
