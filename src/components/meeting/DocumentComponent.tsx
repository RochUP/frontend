import { Card, Space } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PdfViewerComponent from "../../components/meeting/PdfViewerComponent";


export default function DocumentComponent() {

    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentIdNow = useSelector((state: any) => state.meetingReducer.documentIdNow);
    const scripts = useSelector((state: any) => state.meetingReducer.scripts);
    
    const [script, setScript] = useState("");

    useEffect(()=>{
        setScript(scripts[documentIds.indexOf(documentIdNow)]);
    },[documentIdNow]);

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