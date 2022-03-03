import { ProFormText, } from '@ant-design/pro-form';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';
import { Button, Space,} from 'antd';
import { Link } from 'react-router-dom';

export default function LoginPage () {
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
                                name="username"
                                fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'ユーザネーム: admin or user'}
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
                                placeholder={'パスワード: ant.design'}
                                rules={[
                                {
                                    required: true,
                                    message: 'パスワードを入力してください!',
                                },
                                ]}
                            />
                            <Space direction='vertical' style={{ width: 330 }}>
                                <Button type='primary' block>ログイン</Button>
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
