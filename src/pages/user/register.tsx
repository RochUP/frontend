import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Space, Modal, Spin } from 'antd';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
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
            <LoginForm
                logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                title="Plithos"
                subTitle="オンラインミーティングアシスタント"
                submitter={{
                    // ここのsearchConfigと下のrenderの方法どっちでも使える
                    // しかし、searchConfigの方法は、ボタンのスタイルをコントロール困難
                    // searchConfig: {
                    //     submitText: '登録',
                    // },
                    // submitButtonProps: {
                    //     type: 'primary',
                    //     block: true,
                    // },
                    // resetButtonProps: {
                    //     style: {
                    //         // リセットボタンは要らない
                    //         display: 'none',
                    //     },
                    // },
                    render: () => {
                        return [
                            <Button
                                type="primary"
                                key="submit"
                                block
                                onClick={() => {
                                    handleRegisterClick();
                                }}
                            >
                                登録
                            </Button>,
                        ];
                    },
                }}
                onFinish={handleRegisterClick}
                isKeyPressSubmit={true}
            >
                {!inputOk && (
                    <Alert
                        message="ユーザID・ユーザーネーム・パスワードは半角英数字で入力してください"
                        type="error"
                        showIcon
                        style={{ marginBottom: '10px' }}
                    />
                )}
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
            </LoginForm>
            <Link to={'../login'}>
                <Button type="link" block style={{ marginTop: '-10%' }}>
                    ログイン
                </Button>
            </Link>
        </Spin>
    );
}
