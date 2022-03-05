import { Comment, Tooltip } from "antd";
import {
    LikeOutlined,
    LikeFilled
} from '@ant-design/icons';
import { createElement, useEffect, useState } from "react";


type questionType = {
    id: number;
    author: string;
    content: any;
    datetime: any;
    like: number;
    isLiked: boolean;
}

type Props = {
    question: questionType;
}

export default function CommentListComponent(props: Props) {
    const [isLiked, setIsLiked] = useState(props.question.isLiked)
    const [like, setLike] = useState(props.question.like)

    const onClickLike = (questionId: number, isLiked: boolean) => {
        if(isLiked) {
            // クリックを外す
            // sendQuestionVote(questionId, false);
            setIsLiked(false);
            setLike(like - 1);
        }else{
            // クリック
            // sendQuestionVote(questionId, true);
            setIsLiked(true);
            setLike(like + 1);
        }
    }

    return (
        <Comment
            actions={
                [
                    <Tooltip key="comment-basic-like" title="いいね！">
                        <span onClick={() => { onClickLike(props.question.id, isLiked) }}>
                            {createElement(isLiked? LikeFilled : LikeOutlined)}
                            <span className="comment-action">{like}</span>
                        </span>
                    </Tooltip>
                ]
            }
            author={props.question.author}
            content={props.question.content}
            datetime={props.question.datetime}
        />
    )
}