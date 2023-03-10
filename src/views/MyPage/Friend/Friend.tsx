import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendItem from './FriendItem';
import List from '@mui/material/List';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { friendData } from '../../../types/type';
import config from '../../../config';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import styled from 'styled-components';
import { BiLibrary } from 'react-icons/bi';

const TodoItemBlock = styled.div`
    &:hover {
        ${'#button'} {
            display: initial;
        }
    }
`;

const CardBox = styled.div`
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 1rem;
    padding: 1rem;
`;

const InputTextField = styled(TextField)({
    '& label': {
        color: '#fff',
    },
    '& label.Mui-focused': {
        color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': {
            borderColor: '#fff',
        },
    },
});

const inputSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#6666cc',
        },
        '&:hover fieldset': {
            borderColor: '#6666cc',
        },
    },
};

const Friend = () => {
    const navigate = useNavigate();
    const [friendList, setFriendList] = useState([]);
    const [allFriendList, setAllFriendList] = useState([]);
    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/friend/`,
            withCredentials: true,
        })
            .then(function (result) {
                setFriendList(result.data);
                setAllFriendList(result.data);
            })
            .catch(function (error) {
                console.error('friend 에러발생: ', error);
            });
    }, []);

    const onLibrary = (friendEmail: string) => {
        axios({
            method: 'get',
            url: `/friend/${friendEmail}`,
            withCredentials: true,
        })
            .then(function (response: any) {
                const friendUserId = response.data[0].userId;
                navigate(`/friendAlbum/${friendUserId}`);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    const onDel = (friendEmail: string) => {
        axios({
            method: 'delete',
            url: `/friend/${friendEmail}`,
            withCredentials: true,
        })
            .then(function (response: any) {
                history.go(0);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    const searchSpace = (event: any) => {
        const keyword = event.target.value;
        setFriendList(
            allFriendList?.filter((data: friendData) => {
                if (data.nickname.toLowerCase().includes(keyword.toLowerCase()) || data.email.toLowerCase().includes(keyword.toLowerCase())) {
                    return data;
                }
            }),
        );
    };

    return (
        <React.Fragment>
            <Container maxWidth="sm" component="main" sx={{ mb: 4, pt: 5 }}>
                <CardBox>
                    <h4 style={{ color: '#fff' }}>친구 목록</h4>

                    <div>
                        <CardBox>
                            <InputTextField id="outlined-search" label="Search friend" type="search" sx={inputSx} onChange={(e) => searchSpace(e)} />
                        </CardBox>
                    </div>
                    {friendList.length !== 0 ? (
                        <div style={{ paddingTop: '2em' }}>
                            <CardBox>
                                <List sx={{ overflow: 'auto', height: '400px' }}>
                                    {friendList.map((item: friendData) => (
                                        <TodoItemBlock key={item.user_id}>
                                            <ListItem alignItems="flex-start" sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                                                <FriendItem nickname={item.nickname} email={item.email} img={item.profile_img} />
                                                <IconButton
                                                    id="button"
                                                    onClick={(e) => onLibrary(item.email)}
                                                    sx={{ color: '#fff', display: 'none' }}
                                                    component="label"
                                                >
                                                    <BiLibrary />
                                                </IconButton>
                                                <IconButton
                                                    id="button"
                                                    onClick={(e) => onDel(item.email)}
                                                    sx={{ color: '#b91c1c', display: 'none' }}
                                                    component="label"
                                                >
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </ListItem>
                                            <hr></hr>
                                        </TodoItemBlock>
                                    ))}
                                </List>
                            </CardBox>
                        </div>
                    ) : (
                        <div style={{ paddingTop: '2em' }}>
                            <CardBox>
                                <div style={{ color: '#fff' }}>친구 목록이 비었습니다.</div>
                            </CardBox>
                        </div>
                    )}
                </CardBox>
            </Container>
        </React.Fragment>
    );
};

export default Friend;
