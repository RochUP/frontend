import { Footer } from 'antd/lib/layout/layout';
import { Typography } from 'antd';

const { Text } = Typography;

export default function UserFooter() {
    return (
        <Footer
            style={{
                position: 'relative',
                left: 0,
                bottom: 0,
                top: '19%',
                // 26%
                width: '100%',
                maxHeight: 60,
                textAlign: 'center',
            }}
        >
            <Text type="secondary">Made by RochUP Team</Text>
        </Footer>
    );
}
