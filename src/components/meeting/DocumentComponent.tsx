import { Card, Space } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import PdfViewerComponent from "../../components/meeting/PdfViewerComponent";


type Props = {
    presenterId: string;
}

export default function DocumentComponent(props: Props) {

    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const documentUrls = useSelector((state: any) => state.meetingReducer.documentUrls);
    const scripts = useSelector((state: any) => state.meetingReducer.scripts);
    
    const script = scripts[presenterIds.indexOf(props.presenterId)];

    return (
        <Card style={{width: '100%', minHeight: 500, maxHeight: 500,}}>
            <Space direction="horizontal" style={{maxHeight: 480}}>
                {/* <Card type="inner" style={{height: 450, width: '100%'}}> */}
                    <PdfViewerComponent documentUrl={documentUrls[presenterIds.indexOf(props.presenterId)]}/>
                {/* </Card> */}
                {/* <Card type="inner" style={{height: 450, width:'100%'}}> */}
                    <p style={{width: '100%', minHeight: 350, textAlign:'left', marginLeft:'10%'}}>{script}</p>
                {/* </Card> */}
            </Space>
        </Card>
    )
}