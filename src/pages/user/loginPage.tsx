import { LoginForm, ProFormText, } from '@ant-design/pro-form';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import '@ant-design/pro-form/dist/form.css';

export default function LoginPage () {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <LoginForm
        title="○○システム"
        subTitle="ログイン"
      >
        <>
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
        </>
        
        <div
          style={{
            marginBottom: 24,
          }}
        >
          {/* <ProFormCheckbox noStyle name="autoLogin">
            自動ログイン
          </ProFormCheckbox> */}
          {/* <a
            style={{
              float: 'right',
            }}
          >
            新規登録
          </a> */}
        </div>
      </LoginForm>
    </div>
  );
};
