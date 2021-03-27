import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import React from 'react'
import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat';
import Loading from './Loading';

function Sidebar() {


    const [user] = useAuthState(auth);

    const userChatRef = db.collection('chats').where('users','array-contains', user.email)

    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt('Please enter an email address you want to chat with');

        if(!input) return null;

        if(EmailValidator.validate(input) && 
        !chatAlreadyExists(input) && 
        input!== user.email) {
            //we need to add chats in db
            db.collection('chats').add({
                //1st param: you email address
                //2nd: receiver
                users: [user.email,input]
            });
        }
    };


    const chatAlreadyExists =  (recipientEmail) => {
        //Double exclamatory returns true or false
        !!chatsSnapshot?.docs.find(
            (chat) => 
            chat.data().users.find((user) => user === recipientEmail)?.length > 0
            );
        };

        return (
        
            <Container>
                <Header>
                    <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}></UserAvatar>
                    <IconsContainer>
                        <IconButton>
                            <ChatIcon/>
                        </IconButton>

                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </IconsContainer>
                </Header>


                <Search>
                    <SearchIcon/>
                    <SearchInput placeholder="Search In Chat"/>
                </Search>

                <SidebarButton onClick={createChat}>
                    START A NEW CHAT
                </SidebarButton>

                {/* list of chats */}
                {chatsSnapshot?.docs.map((chat) => {
                    return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                })}


            </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex:0.45;
    border-right:1px solid whitesmoke;

    //defines heigh
    height: 100vh;

    //make it scrollable
    overflow-y:scroll;

    //hides scrollbar
    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style:none;    //IE and Edge
    scrollbar-width:none;       //Firefox
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius:2px;
`;


const SidebarButton =styled(Button)`
        width:100%;

        //This increases the priority of rule
        &&&{
            border-top: 1px solid whitesmoke;
            border-bottom: 1px solid whitesmoke;
        }
`;

const SearchInput = styled.input`
        outline-width:0;
        border: none;
        flex:1;
    `;



const Header = styled.div`
    display: flex;

    // makes header postion fixed
    position: sticky;
    top:0;
    background-color:white;
    z-index:1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div`

`;

