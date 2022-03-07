import { Card, Space } from "antd";

import PdfViewerComponent from "../../components/meeting/PdfViewerComponent";


export default function DocumentComponent() {


    return (
        <Space direction="horizontal" style={{maxHeight: 500, width:'100%'}}>
            <Card type="inner" style={{maxHeight: 500, width: 600}}>
                <PdfViewerComponent />
            </Card>
            <Card type="inner" style={{maxHeight: 500}}>
                <p style={{width: 550, minHeight: 350, textAlign:'left'}}>This area for 原稿</p>
            </Card>
        </Space>
    )
}