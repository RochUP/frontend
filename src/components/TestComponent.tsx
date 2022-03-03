import { Button } from 'antd';

import { signup, login } from '../utils/api';

function TestButton() {
  return (
    <div>
        <Button type="primary"
          onClick={() => {signup("test", "test", "test");}}
        >SignUp</Button>
        <Button type="primary"
          onClick={() => {login("test", "test");}}
        >LogIn</Button>
    </div>
  );
}

export default TestButton;