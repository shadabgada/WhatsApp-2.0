import styled from 'styled-components'
import Head from 'next/head'
import Sidebar from '../components/Sidebar';
import ChatScreen from '../components/ChatScreen';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';

//These props i.e. chat and messages are sent from below function: getServerSideProps
function Chat({chat, messages}) {

    const [user] = useAuthState(auth);

    return <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <Sidebar/>

            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>

    </Container>;
}

export default Chat;


//This function is server side rendering
export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id)

    //PREP messages on server
    const messageRes = await ref
    .collection("messages")
    .orderBy("timestamp","asc")
    .get()

    const messages = messageRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));


    //PREP THE CHATS
    const  chatRes = await ref.get();

    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    //This will log on terminal(in case of local) as it is server side
    console.log(chat, messages);

    return {
        props:{
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}


const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex:1;
    overflow:scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none   /*IE and edge*/
    scrollbar-width: none;  /*Firefox*/
`;