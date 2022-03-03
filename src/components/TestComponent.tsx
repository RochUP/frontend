import { Button } from 'antd';

import { signup, login } from '../utils/api';

function TestButton() {
  return (
    <div>
        <Button type="primary"
          onClick={() => {signup("testId", "testName", "testPassword");}}
        >SignUp</Button>
        <Button type="primary">LogIn</Button>
    </div>
  );
}

export default TestButton;