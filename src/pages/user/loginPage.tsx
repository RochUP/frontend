import { ProFormText, } from '@ant-design/pro-form';
import {
    LockOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';
import { Button, Space, Modal } from 'antd';
import { Link } from 'react-router-dom';

import { login } from '../../utils/api';
import store from '../../store';
import { userLogin } from '../../actions/userActions';

export default function LoginPage () {

    const handleLoginClick = async () => {
        const userid = (document?.getElementById("userid") as HTMLInputElement).value;
        const password = (document?.getElementById("password") as HTMLInputElement).value;
        console.log(userid, password);

        await login(userid, password)
            .then(res => {
                if (!res.result) {
                    // throw new Error("Login failed");
                    return(
                        error()
                    )
                }
                // alert("Login success");
                storeUserData(res.userId, res.userName);
                // TODO:
                // - ローディング表示
                // - 画面遷移
                return(
                    success()
                )
            })
            .catch(err => {
                console.log(err);
                alert(err.message);
            });
    }

    function success() {
        Modal.success({
            content: 'ログイン成功しました',
            okButtonProps: {},
        });
    }

    function error() {
        Modal.error({
            content: 'ログイン失敗しました',
            okButtonProps: {},
        });
    }

    const storeUserData = (userId: string, userName: string) => {
        store.dispatch(userLogin(userId, userName));
    }

    return (
        <div className='content___2zk1-'>
            <div className='ant-pro-form-login-container'>
                <div className='ant-pro-form-login-container'>
                    <div className='ant-pro-form-login-top'>
                        <div className='ant-pro-form-login-header'>
                            <span className='ant-pro-form-login-header-title'>
                                ○○システム
                            </span>
                        </div>
                        <div className='ant-pro-form-login-desc'>ログイン</div>
                    </div>
                        <div className='ant-pro-form-login-main'>
                            <ProFormText
                                name="userid"
                                fieldProps={{
                                size: 'large',
                                prefix: <IdcardOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'ユーザID'}
                                rules={[
                                {
                                    required: true,
                                    message: 'ユーザIDを入力してください!',
                                },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'パスワード: ant.design'}
                                rules={[
                                {
                                    required: true,
                                    message: 'パスワードを入力してください!',
                                },
                                ]}
                            />
                            <Space direction='vertical' style={{ width: 330 }}>
                                <Button type='primary' block 
                                    onClick={()=>{handleLoginClick()}}
                                >
                                    ログイン
                                </Button>
                                <Link to={'../register'}>
                                    <Button type='link' block>新規登録</Button>
                                </Link>
                            </Space>
                        </div>
                </div>
            </div>
        </div>
    );
};
