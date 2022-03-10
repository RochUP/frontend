import { Comment, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { createElement } from 'react';

import Socket from '../../utils/webSocket';
import { sendQuestionVote } from '../../utils/webSocketUtils';
import store from '../../store';
import { changeQuestionIsVote } from '../../actions/meetingActions';

type Question = {
    id: number;
    content: any;
    datetime: any;
    like: number;
    isLiked: boolean;
};

type Props = {
    socket: Socket;
    question: Question;
};

export default function CommentItemComponent(props: Props) {
    const onClickLike = () => {
        sendQuestionVote(props.socket, props.question.id, !props.question.isLiked);
        store.dispatch(changeQuestionIsVote(props.question.id, !props.question.isLiked));
    };

    return (
        <Comment
            actions={[
                <Tooltip key="comment-basic-like" title="いいね">
                    <span onClick={onClickLike}>
                        {createElement(props.question.isLiked ? LikeFilled : LikeOutlined)}
                        <span className="comment-action">{props.question.like}</span>
                    </span>
                </Tooltip>,
            ]}
            content={props.question.content}
            datetime={props.question.datetime}
        />
    );
}
