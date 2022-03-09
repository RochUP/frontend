import { Layout, Menu, Modal } from "antd";
import {
    UserOutlined
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Pages.css";
import { useSelector } from "react-redux";
import store from "../../store";
import { userLogout } from "../../actions/userActions";
import { meetingExitAction } from "../../actions/meetingActions";

const { Header } = Layout;
const { confirm } = Modal;

export default function MeetingHeader() {

    const navigate = useNavigate();

    const username = useSelector((state: any) => state.userReducer.username);
    const onClickLogout = () => {
        store.dispatch(meetingExitAction());
        store.dispatch(userLogout());
        navigate('../login');
    }

    const showConfirm = () => {
        confirm({
            title: 'ログアウトしますか？',
            content: 'ログアウトした後は、再度ログインする必要があります。',
            okText: 'ログアウト',
            okType: 'danger',
            cancelText: 'キャンセル',
            onOk() {
                onClickLogout();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <Header style={{maxHeight: 60}}>
            <Menu theme="dark" mode="horizontal" style={{maxHeight: 60}}>
                <SubMenu key="sub1" icon={<UserOutlined />} title={username} style={{marginLeft:'90%'}}>
                    <Menu.Item key="1">プロファイル</Menu.Item>
                    {/* <Link to={'../login'}> */}
                        <Menu.Item key="2" onClick={showConfirm}>ログアウト</Menu.Item>
                    {/* </Link> */}
                </SubMenu>
            </Menu>
        </Header>
    )
}