import React, { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { friendData } from '../../../types/type';
import { Button } from '@mui/material';
import config from '../../../config';
import styled from 'styled-components';
import { Modal } from '@mui/material';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const CardBox = styled.div`
    background-position: center;
    background-size: cover;
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
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

const buttonSx = {
    marginLeft: '10px',
    background: '#6666cc',
    color: 'white',
    width: '35%',
    '&:hover': {
        backgroundColor: '#333',
        color: 'white',
    },
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#6666cc',
        },
        '&:hover fieldset': {
            borderColor: '#6666cc',
        },
    },
};

const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
};

export function UserSearch() {
    // 모달 infromation
    const [inform, setInform] = useState('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => useState(true);
    const handleClose = () => useState(false);

    const text = useRef<HTMLInputElement>(null);
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState();
    const [friends, setFriends] = useState([]);
    const [reqFriends, setReqFriends] = useState([]);
    const [receiveFriends, setReceiveFriends] = useState([]);

    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/friend/receive`,
            withCredentials: true,
        })
            .then(function (result) {
                setReceiveFriends(result.data);
            })
            .catch(function (error) {
                console.error('friend 에러발생: ', error);
            });
    }, []);

    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/friend/request`,
            withCredentials: true,
        })
            .then(function (result: any) {
                setReqFriends(result.data);
            })
            .catch(function (error: any) {
                console.error('friend req send 에러발생: ', error);
            });
    }, []);

    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/friend`,
            withCredentials: true,
        })
            .then(function (result: any) {
                setFriends(result.data);
            })
            .catch(function (error: any) {
                console.error('friend 에러발생: ', error);
            });
    }, []);

    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/user`,
            withCredentials: true,
        })
            .then(function (result: any) {
                setEmail(result.data.email);
            })
            .catch(function (error: any) {
                console.error('user 에러발생: ', error);
            });
    }, []);

    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/user/all`,
            withCredentials: true,
        })
            .then(function (result: any) {
                setUsers(result.data);
            })
            .catch(function (error: any) {
                console.error('allUser 에러발생: ', error);
            });
    }, []);

    const onsend = () => {
        // 친구 요청 이메일이 유저인지 확인
        let checkUser = false;
        // 친구 요청 이메일이 본인인지 확인
        let checkMe = false;
        // 이미 친구인지 확인
        let checkFriend = false;
        // 이미 보낸 요청인 경우
        let checkReqFriend = false;
        // 이미 받은 요청인 경우
        let checkReceiveFriend = false;

        users.map((user) => {
            if (user['email'] === text.current?.value) {
                checkUser = true;
                return checkUser;
            }
        });

        if (checkUser && text.current?.value === email) {
            checkMe = true;
        }

        friends.map((friend) => {
            if (friend['email'] === text.current?.value) {
                checkFriend = true;
                return checkFriend;
            }
        });

        reqFriends.map((friend) => {
            if (friend['email'] === text.current?.value) {
                checkReqFriend = true;
                return checkReqFriend;
            }
        });

        receiveFriends.map((friend) => {
            if (friend['email'] === text.current?.value) {
                checkReceiveFriend = true;
                return checkReceiveFriend;
            }
        });

        if (checkUser && !checkMe && !checkFriend && !checkReqFriend && !checkReceiveFriend) {
            axios({
                method: 'post',
                url: `/friend/`,
                data: {
                    receive_email: text.current?.value,
                    check: 0,
                },
                withCredentials: true,
            })
                .then(function (result) {
                    console.log('요청 보내기 성공');
                    setInform('성공적으로 친구 요청을 보냈습니다.');
                })
                .catch(function (error) {
                    console.error('요청보내기 에러발생: ', error);
                    alert('요청을 보낼 수 없습니다. 정확한 이메일을 입력해주세요.');
                });
        } else {
            if (!checkUser) {
                setInform('서비스 사용자가 아닌 경우 친구 요청을 보낼 수 없습니다. 정확한 이메일을 입력해주세요.');
            } else if (checkMe) {
                setInform('본인에게는 친구 요청을 보낼 수 없습니다.');
            } else if (checkFriend) {
                setInform('이미 친구인 사용자에게는 친구 요청을 보낼 수 없습니다.');
            } else if (checkReqFriend) {
                setInform('이미 요청을 보낸 사용자입니다.');
            } else if (checkReceiveFriend) {
                setInform('이미 요청을 받은 사용자입니다.');
            }
        }
    };

    return (
        <>
            <CardBox>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ width: '65%' }}
                    options={users?.map((option: friendData) => option.email)}
                    renderInput={(params: any) => (
                        <InputTextField
                            inputRef={text}
                            {...params}
                            label="search user"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            sx={inputSx}
                        />
                    )}
                />
                <Button
                    sx={buttonSx}
                    onClick={() => {
                        onsend();
                        setOpen(true);
                    }}
                    variant="contained"
                >
                    친구 요청 보내기
                </Button>
            </CardBox>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={ModalStyle}>
                    <Typography fontSize={15} color="#596678" id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        {inform}
                    </Typography>

                    <Typography align="right">
                        <Button
                            onClick={() => {
                                setOpen(false);
                                history.go(0);
                            }}
                        >
                            확인
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}
