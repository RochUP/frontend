import { Layout, Menu } from "antd";
import {
    UserOutlined
} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import "../../assets/css/Pages.css";
import { useSelector } from "react-redux";
import store from "../../store";
import { userLogout } from "../../actions/userActions";
import { meetingExitAction } from "../../actions/meetingActions";

const { Header } = Layout;

export default function MeetingHeader() {

    const username = useSelector((state: any) => state.userReducer.username);
    const onClickLogout = () => {
        store.dispatch(meetingExitAction());
        store.dispatch(userLogout());
    }

    return (
        <Header style={{maxHeight: 60}}>
            <Menu theme="dark" mode="horizontal" style={{maxHeight: 60}}>
                <SubMenu key="sub1" icon={<UserOutlined />} title={username} style={{paddingLeft:'90%'}}>
                    <Menu.Item key="1">プロファイル</Menu.Item>
                    <Link to={'../login'}>
                        <Menu.Item key="2" onClick={onClickLogout}>ログアウト</Menu.Item>
                    </Link>
                </SubMenu>
            </Menu>
        </Header>
    )
}