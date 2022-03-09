import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Space, Modal, Spin } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';

import { userLogin } from '../../actions/userActions';
import store from '../../store';
import { signup } from '../../utils/api';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [spinning, setSpinning] = useState(false);
    const [inputOk, setInputOk] = useState(true);

    const checkInputOk = useCallback((str: string): boolean => /^[\w]+$/.test(str), []);

    const handleRegisterClick = async () => {
        const userid = (document?.getElementById('userid') as HTMLInputElement).value;
        const username = (document?.getElementById('username') as HTMLInputElement).value;
        const password = (document?.getElementById('password') as HTMLInputElement).value;
        console.log(userid, username, password);

        if (checkInputOk(userid) && checkInputOk(username) && checkInputOk(password)) {
            setInputOk(true);
            setSpinning(true);

            await signup(userid, username, password)
                .then((res) => {
                    if (!res.result) {
                        throw new Error('Signup failed');
                    }
                    storeUserData(res.userId, res.userName);
                    return success();
                })
                .catch((err) => {
                    console.log(err);
                    return error();
                });
            setSpinning(false);
        } else {
            setInputOk(false);
            return;
        }
    };

    const storeUserData = (userId: string, userName: string) => {
        store.dispatch(userLogin(userId, userName));
    };

    function destoryAll() {
        Modal.destroyAll();
    }

    function success() {
        Modal.success({
            content: '新規登録成功しました',
            okButtonProps: {
                onClick: () => {
                    navigate('/login');
                    destoryAll();
                },
            },
        });
    }

    function error() {
        Modal.error({
            content: '新規登録失敗しました',
            okButtonProps: {},
        });
    }

    return (
        <Spin size="large" spinning={spinning}>
            <div className="content___2zk1-">
                <div className="ant-pro-form-login-container">
                    <div className="ant-pro-form-login-container" style={{ marginTop: '10%' }}>
                        <div className="ant-pro-form-login-top">
                            <div className="ant-pro-form-login-header">
                                <span className="ant-pro-form-login-header-title">Plithos</span>
                            </div>
                            <div className="ant-pro-form-login-desc">新規登録</div>
                        </div>
                        <div className="ant-pro-form-login-main">
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
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'ユーザネーム'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'ユーザネームを入力してください!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'パスワード'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'パスワードを入力してください!',
                                    },
                                ]}
                            />
                            <Space direction="vertical" style={{ width: 330 }}>
                                {!inputOk && (
                                    <Alert
                                        message="ユーザID・ユーザーネーム・パスワードは半角英数字で入力してください"
                                        type="error"
                                        showIcon
                                    />
                                )}
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => {
                                        handleRegisterClick();
                                    }}
                                >
                                    登録
                                </Button>
                                <Link to={'../login'}>
                                    <Button type="link" block>
                                        ログイン
                                    </Button>
                                </Link>
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    );
}
