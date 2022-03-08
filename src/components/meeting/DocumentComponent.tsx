import { Card, Space } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDocumentAction } from "../../actions/meetingActions";

import PdfViewerComponent from "../../components/meeting/PdfViewerComponent";
import store from "../../store";
import { getDocument } from "../../utils/api";


type Props = {
    socket: any;
    presenterId: string;
}

export default function DocumentComponent(props: Props) {
    
    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);

    useEffect(() => {
        const documentId = documentIds[presenterIds.indexOf(props.presenterId)];
        (async () => {
            await getDocument(documentId)
                .then((res: any) => {
                    console.log(res);
                    if (!res.result){
                        throw new Error("Document not found");
                    }
                    store.dispatch(getDocumentAction(documentId, res.documentUrl, res.script));
                })
                .catch((err: any) => {
                    console.log(err);
                });
        })();
    }, [props.socket]);
    
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