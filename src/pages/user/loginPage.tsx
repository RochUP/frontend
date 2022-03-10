import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Space, Modal, Spin } from 'antd';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
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
            <LoginForm
                logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                title="Plithos"
                subTitle="オンラインミーティングアシスタント"
                submitter={{
                    // ここのsearchConfigと下のrenderの方法どっちでも使える
                    // しかし、searchConfigの方法は、ボタンのスタイルをコントロール困難
                    // searchConfig: {
                    //     submitText: 'ログイン',
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
                                    handleLoginClick();
                                }}
                            >
                                ログイン
                            </Button>,
                        ];
                    },
                }}
                onFinish={handleLoginClick}
                isKeyPressSubmit={true}
            >
                {!inputOk && (
                    <Alert
                        message="ユーザIDとパスワードは半角英数字で入力してください"
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
            <Link to={'../register'}>
                <Button type="link" block style={{ marginTop: '-10%' }}>
                    新規登録
                </Button>
            </Link>
        </Spin>
    );
}
