import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import config from '../../config';
import dayjs from 'dayjs';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import OutletIcon from '@mui/icons-material/Outlet';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import SickIcon from '@mui/icons-material/Sick';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/system';
import { Typography, Button } from '@mui/material';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { CARD_UPDATE_REQUEST, CARD_DELETE_REQUEST } from '../../redux/types';
import styled from 'styled-components';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
};

export default function AlbumCarousel(props: any) {
    console.log('Carousel', props.cardInfo);
    const emotionType: any = (): any => {
        if (props.cardInfo.expressionLabel == 'happy') {
            return <InsertEmoticonIcon />;
        } else if (props.cardInfo.expressionLabel == 'angry') {
            return <LocalFireDepartmentIcon />;
        } else if (props.cardInfo.expressionLabel == 'fearful') {
            return <SentimentVeryDissatisfiedRoundedIcon />;
        } else if (props.cardInfo.expressionLabel == 'surprised') {
            return <OutletIcon />;
        } else if (props.cardInfo.expressionLabel == 'sad') {
            return <SentimentDissatisfiedIcon />;
        } else if (props.cardInfo.expressionLabel == 'disgusted') {
            return <SickIcon />;
        }
    };

    const dispatch = useDispatch();
    const { card } = useSelector((state: any) => state.card);
    useEffect(() => {
        dispatch({
            type: CARD_UPDATE_REQUEST,
            CARD_DELETE_REQUEST,
        });
    }, [dispatch]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const ref: any = useRef(null);
    const [text, setText] = useState(props.cardInfo.comment);
    const [editable, setEditable] = useState(false);
    const editOn = () => {
        setEditable(true);
        setText(props.cardInfo.comment);
    };

    const handleChange = (e: any) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setEditable(false);
            props.cardInfo.comment = text;

            dispatch({
                type: CARD_UPDATE_REQUEST,
                payload: {
                    card_id: props.cardInfo.cardId,
                    user_id: props.cardInfo.userId,
                    album_id: props.cardInfo.albumId,
                    expression_label: props.cardInfo.expressionLabel,
                    comment: text,
                    thumbnail_url: props.cardInfo.thumbnailUrl,
                    video_url: props.cardInfo.videoUrl,
                },
            });
        }
    };

    const handleClickOutside = (e: any) => {
        if (editable === true && !ref.current.contains(e.target)) setEditable(false);
    };
    useEffect(() => {
        window.addEventListener('click', handleClickOutside, true);
    });

    const onClickDelete = () => {
        dispatch({
            type: CARD_DELETE_REQUEST,
            payload: {
                card_id: props.cardInfo.cardId,
            },
        });
        window.location.reload();
    };

    return (
        <div>
            <h3 style={{ fontSize: '20px', textAlign: 'center', paddingTop: '5px' }}>
                {' '}
                {dayjs(props.cardInfo.createdAt).tz('utc').format('YYYY년 MM월 DD일')}
            </h3>
            <div>
                <video controls loop src={`https://${config.aws.cdn_name}/${props.cardInfo.videoUrl}`} width="500px" height="380px"></video>
            </div>
            <div style={{ fontSize: '20px', textAlign: 'center', marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
                <span style={{ marginRight: '10px' }}>
                    {emotionType()}
                    {props.cardInfo.expressionLabel}
                </span>

                <span>
                    {editable ? (
                        <span>
                            <form>
                                <input
                                    type="text"
                                    maxLength={25}
                                    value={text}
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKeyDown}
                                    style={{
                                        border: '1px solid #1d2b3a',
                                        background: 'rgba(255, 255, 255, 0.25)',
                                        borderRadius: '5px',
                                        color: '#00dfc4',
                                        outline: 'none',
                                    }}
                                />
                            </form>
                        </span>
                    ) : (
                        <span style={{ display: 'flex' }}>{props.cardInfo.comment}</span>
                    )}
                </span>

                <CiEdit size="21" onClick={editOn} style={{ cursor: 'pointer', color: '#00cceb', marginLeft: '10px', marginRight: '3px' }} />
                <CiTrash size="20" onClick={handleOpen} style={{ cursor: 'pointer', color: '#f4292c', marginLeft: '5px' }} />

                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            정말 삭제하시겠습니까?
                        </Typography>
                        <Typography fontSize={13} color="#64748b" id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                            삭제된 앨범의 영상은 더 이상 확인할 수 없습니다.
                        </Typography>
                        <Typography align="right">
                            <Button onClick={onClickDelete}>확인</Button>
                            <Button onClick={handleClose}>취소</Button>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}
