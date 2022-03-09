import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Space, Modal, Spin } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import { LockOutlined, IdcardOutlined } from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';

import { userLogin } from '../../actions/userActions';
import store from '../../store';
import { login } from '../../utils/api';

export default function LoginPage() {
    const [spinning, setSpinning] = useState(false);
    const [inputOk, setInputOk] = useState(true);

    const checkInputOk = useCallback((str: string): boolean => /^[\w]+$/.test(str), []);

    const navigate = useNavigate();

    const handleLoginClick = async () => {
        const userid = (document?.getElementById('userid') as HTMLInputElement).value;
        const password = (document?.getElementById('password') as HTMLInputElement).value;
        console.log(userid, password);

        if (checkInputOk(userid) && checkInputOk(password)) {
            setInputOk(true);
            setSpinning(true);

            await login(userid, password)
                .then((res) => {
                    if (!res.result) {
                        throw new Error('Login failed');
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

    function success() {
        // Modal.success({
        //     content: 'ログイン成功しました',
        //     okButtonProps: { onClick: () => navigate('/meeting/join') },
        // });
        navigate('/meeting/join');
    }

    function error() {
        Modal.error({
            content: 'ログイン失敗しました',
            okButtonProps: {},
        });
    }

    const storeUserData = (userId: string, userName: string) => {
        store.dispatch(userLogin(userId, userName));
    };

    return (
        <Spin size="large" spinning={spinning}>
            <div className="content___2zk1-">
                <div className="ant-pro-form-login-container">
                    <div className="ant-pro-form-login-container" style={{ marginTop: '10%' }}>
                        <div className="ant-pro-form-login-top">
                            <div className="ant-pro-form-login-header">
                                <span className="ant-pro-form-login-header-title">Plithos</span>
                            </div>
                            <div className="ant-pro-form-login-desc">ログイン</div>
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
                                        message="ユーザIDとパスワードは半角英数字で入力してください"
                                        type="error"
                                        showIcon
                                    />
                                )}
                                {/* TODO: 下コンポーネントとのスペースを調整 */}
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => {
                                        handleLoginClick();
                                    }}
                                >
                                    ログイン
                                </Button>
                                <Link to={'../register'}>
                                    <Button type="link" block>
                                        新規登録
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
