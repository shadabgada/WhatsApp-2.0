import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components'
import { auth, db } from '../../firebase';
import {useRouter} from 'next/router'
import { Avatar, Button, IconButton } from '@material-ui/core';
import MoreVerticalIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import {useCollection } from 'react-firebase-hooks/firestore'
import InsertEmoticonIcon  from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic'
import { useState } from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';
import Message from './Message'
import TimeAgo from 'timeago-react'
import { useRef } from 'react';

function ChatScreen({chat, messages}) {

    console.log(messages);
    console.log(chat);

    const [user] = useAuthState(auth);

    const [input, setInput] = useState("");

    const endOfMessagesRef = useRef(null);

    
    const router = useRouter();

    const [messagesSnapshot] = useCollection(db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp',"asc")
    );

    const [recipientSnapshot] = useCollection(db
        .collection('users')
        .where('email','==', getRecipientEmail(chat.users, user ))
    );


    
 
    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message =>(
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}

                />
            ))
        } else{
            return JSON.parse(messages).map((message)=>(
                <Message key={message.id} user={message.user} message/>
            ));
        }
    };

    const scrollToBottom  = () => {
        endOfMessagesRef.current.scrollIntoView({
            behaviour: 'smooth',
            block:'start',
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(`Input: ${input} `)

        db.collection("users").doc(user.uid).set(
        {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true}
        );
        
        db.collection("chats").doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL, 
        });
        setInput("");
        scrollToBottom();
    };


    const recipient =  recipientSnapshot?.docs?.[0]?.data();
    console.log(recipient);

    const recipientEmail = getRecipientEmail(chat.users,user);

    return (
        <Container>
            <Header>

                {recipient ? (
                    <Avatar src={recipient?.photoURL}/>
                ): (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                        Last active : {' '}
                        {recipient?.email ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                        ) : (
                            "Unavailable"
                        )}
                        </p>
                    ):(
                        <p>Loading Last Active...</p>
                    )}

                </HeaderInformation>

                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon/>
                    </IconButton>
                    
                </HeaderIcons>
            </Header>


            <MessageContainer>
                {/* SHOW MESSAGE */}
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>

            </MessageContainer>


            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={e => setInput(e.target.value)}/>
                    <Button hidden disabled={!input} type="submit" onClick={sendMessage}>
                        Send Message                        
                    </Button>
                <MicIcon/>
            </InputContainer>

        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
    
    //fixed
    position: sticky;
    background-color:white;
    z-index:100;
    top:0;
    display: flex;
    padding: 11px;
    height: 80px;

    //Center the alignments for all the items of the flexible <div> element
    align-items: center;

    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;

    //occupies only particular grid
    flex:1;

    h3 {
        margin-bottom: 3px;
    }

    p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
        padding:30px;
        background-color: #e5ded8;

        //so that it can expand as per chats
        min-height:90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom:0;
    background-color:white;
    z-index: 100;
`;   

const Input = styled.input`
    flex:1;
    outline:0;
    border: none;
    border-radius:10px;
    background-color:whitesmoke;
    padding: 10px;
    margin-left: 15px;
    margin-right: 15px;
`;