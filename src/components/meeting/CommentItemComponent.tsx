import { Comment, Tooltip } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { createElement, useState } from 'react';

import Socket from '../../utils/webSocket';
import { sendQuestionVote } from '../../utils/webSocketUtils';

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
    const [isLiked, setIsLiked] = useState(props.question.isLiked);

    const onClickLike = (questionId: number) => {
        const vote = !isLiked;
        setIsLiked(vote);
        sendQuestionVote(props.socket, questionId, vote);
    };

    return (
        <Comment
            actions={[
                <Tooltip key="comment-basic-like" title="いいね">
                    <span
                        onClick={() => {
                            onClickLike(props.question.id);
                        }}
                    >
                        {createElement(isLiked ? LikeFilled : LikeOutlined)}
                        <span className="comment-action">{props.question.like}</span>
                    </span>
                </Tooltip>,
            ]}
            content={props.question.content}
            datetime={props.question.datetime}
        />
    );
}
