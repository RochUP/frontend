import { useState, useEffect } from 'react';

type ChatItemProps = {
    questionlists: string[];
};

//質問のリストを表示する
const ChatItem = (props: ChatItemProps) => {
    return (
        <div>
            {props.questionlists.map((question, idx) => {
                return <p key={idx}>{question}</p>;
            })}
            {/* <p>Hello</p> */}
        </div>
    );
};

export default ChatItem;
