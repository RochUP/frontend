import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Modal, Spin, Typography } from 'antd';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';
import '../../assets/css/User.css';

import { userLogin } from '../../actions/userActions';
import store from '../../store';
import { signup } from '../../utils/api';
import UserFooter from './UserFooter';

const ERR_MSG_NOT_OK = '半角英数字で入力してください';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [spinning, setSpinning] = useState(false);
    const [inputOk, setInputOk] = useState(true);
    const [errorMessage, setErrorMessage] = useState('正しく入力してください');

    const checkInputOk = useCallback((str: string): boolean => /^[\w]+$/.test(str), []);
    const checkInputNotEmpty = useCallback(
        (str: string): boolean => str.length > 0 && /^[\S]+$/.test(str),
        []
    );

    const checkInput = useCallback(
        (userid: string, username: string, password: string): boolean => {
            console.log(
                `signup: (userid: ${userid}, username: ${username}, password: ${password})`
            );
            if (
                checkInputNotEmpty(userid) &&
                checkInputNotEmpty(username) &&
                checkInputNotEmpty(password)
            ) {
                if (checkInputOk(userid) && checkInputOk(password)) {
                    return true;
                } else {
                    setErrorMessage(ERR_MSG_NOT_OK);
                    return false;
                }
            } else {
                return false;
            }
        },
        []
    );

    const handleRegisterClick = async () => {
        const userid = (document?.getElementById('userid') as HTMLInputElement).value;
        const username = (document?.getElementById('username') as HTMLInputElement).value;
        const password = (document?.getElementById('password') as HTMLInputElement).value;
        const ok = checkInput(userid, username, password);
        setInputOk(ok);

        if (ok) {
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
            okText: 'ログイン',
        });
    }

    function error() {
        Modal.error({
            title: '新規登録失敗',
            content: '改めてお試しください',
            okText: '了解',
        });
    }

    return (
        <div className="login-page">
            <Spin size="large" spinning={spinning}>
                <div className="login-content">
                    <div className="login-form">
                        <div className="login-title">
                            <img
                                className="login-logo"
                                src={`${process.env.PUBLIC_URL}/logo_plithos.png`}
                                alt="logo"
                            />
                            <Typography.Text
                                className="login-title-text"
                                type="secondary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                オンライン会議アシスタント
                            </Typography.Text>
                        </div>
                        <LoginForm
                            // logo={`${process.env.PUBLIC_URL}/logo.png`}
                            // title="Plithos"
                            // subTitle="オンラインミーティングアシスタント"
                            submitter={{
                                // ここのsearchConfigと下のrenderの方法どっちでも使える
                                // しかし、searchConfigの方法は、ボタンのスタイルをコントロール困難
                                searchConfig: {
                                    submitText: '登録',
                                },
                                submitButtonProps: {
                                    type: 'primary',
                                    block: true,
                                    style: {
                                        display: 'none',
                                    },
                                },
                                resetButtonProps: {
                                    style: {
                                        // リセットボタンは要らない
                                        display: 'none',
                                    },
                                },
                                // 第二種の方法
                                // render: () => {
                                //     return [
                                //         <Button
                                //             type="primary"
                                //             key="submit"
                                //             block
                                //             onClick={() => {
                                //                 handleRegisterClick();
                                //             }}
                                //         >
                                //             登録
                                //         </Button>,
                                //     ];
                                // },
                            }}
                            onFinish={handleRegisterClick}
                            isKeyPressSubmit={true}
                        >
                            {!inputOk && (
                                <Alert
                                    message={errorMessage}
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
                                        message: 'ユーザIDを入力してください',
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
                                        message: 'ユーザネームを入力してください',
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
                                        message: 'パスワードを入力してください',
                                    },
                                ]}
                            />
                            <Button
                                type="primary"
                                key="submit"
                                block
                                onClick={() => {
                                    handleRegisterClick();
                                }}
                            >
                                登録
                            </Button>
                            <Link to={'../login'}>
                                <Button type="link" block style={{ marginTop: '10px' }}>
                                    ログイン
                                </Button>
                            </Link>
                        </LoginForm>
                    </div>
                    <UserFooter />
                </div>
            </Spin>
        </div>
    );
}
