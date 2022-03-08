import { Card, Col } from "antd";
import { Typography } from "antd";

const { Title } = Typography;


export default function ModeratorMsgComponent() {

    return (
        <Col span={24}>
            <Title level={4} style={{width:'100%', textAlign:'center'}}>"ここで司会メッセージを表示する"</Title>
        </Col>
    )
}