import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Box, cardMediaClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Container } from '@mui/system';
import { Modal } from '@mui/material';
import { CiEdit } from 'react-icons/ci';

import CloseIcon from '@mui/icons-material/Close';
import Share from '../Album/Share';
import VideoDelete from './VideoDelete';
import { CARD_LOADING_REQUEST, CARD_UPDATE_REQUEST } from '../../redux/types';
import config from '../../config';
import { faCircleDown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import OutletIcon from '@mui/icons-material/Outlet';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import SickIcon from '@mui/icons-material/Sick';

const VideoStyle = styled.video`
    /* @media (max-width: 768px) { */
    height: 80vh;
    /* } */
`;

const VideoDetail = () => {
    const dispatch = useDispatch();
    const { cardId } = useParams();
    console.log(cardId);
    const { card } = useSelector((state: any) => state.card);
    console.log(card);

    const [text, setText] = useState(card.comment);
    const [editable, setEditable] = useState(false);
    const editOn = () => {
        setEditable(true);
        setText(card.comment);
    };

    const handleChange = (e: any) => {
        setText(e.target.value);
    };
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setEditable(false);
            card.comment = text;

            dispatch({
                type: CARD_UPDATE_REQUEST,
                payload: {
                    card_id: card.cardId,
                    user_id: card.userId,
                    album_id: card.albumId,
                    expression_label: card.expressionLabel,
                    comment: text,
                    thumbnail_url: card.thumbnailUrl,
                    video_url: card.videoUrl,
                },
            });
            window.location.reload();
        }
    };

    useEffect(() => {
        dispatch({
            type: CARD_LOADING_REQUEST,
            payload: cardId,
        });
        console.log(card);
    }, []);
    console.log(card.comment);

    const emotionType: any = (): any => {
        if (card.expressionLabel == 'happy') {
            return <InsertEmoticonIcon fontSize="large" />;
        } else if (card.expressionLabel == 'angry') {
            return <LocalFireDepartmentIcon fontSize="large" />;
        } else if (card.expressionLabel == 'fearful') {
            return <SentimentVeryDissatisfiedRoundedIcon fontSize="large" />;
        } else if (card.expressionLabel == 'surprised') {
            return <OutletIcon fontSize="large" />;
        } else if (card.expressionLabel == 'sad') {
            return <SentimentDissatisfiedIcon fontSize="large" />;
        } else if (card.expressionLabel == 'disgusted') {
            return <SickIcon fontSize="large" />;
        }
    };
    return (
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Modal open={true}>
                <Box
                    sx={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        position: 'absolute',
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: 999999,
                                display: 'flex',
                                background: 'linear-gradient(#11140D, #575757)',
                                width: '100%',
                            }}
                        >
                            {/* <h5 style={{ color: '#fff' }}>
                                comment
                                <br />
                            </h5> */}
                            <span style={{ marginLeft: '10px', marginTop: '5px', color: '#fff' }}>{emotionType()}</span>

                            {editable ? (
                                <div>
                                    <form>
                                        <input
                                            type="text"
                                            maxLength={25}
                                            value={text}
                                            onChange={(e) => handleChange(e)}
                                            onKeyDown={handleKeyDown}
                                            style={{
                                                border: '1px solid #1d2b3a',
                                                // background: 'rgba(255, 255, 255, 0.25)',
                                                borderRadius: '5px',
                                                width: '350px',
                                                fontSize: '30px',
                                                color: '#3241c4',
                                                outline: 'none',
                                            }}
                                        />
                                    </form>{' '}
                                </div>
                            ) : (
                                <div
                                    style={{
                                        color: '#fff',
                                        fontSize: '30px',
                                        marginLeft: '10px',
                                    }}
                                >
                                    {card.comment}
                                </div>
                            )}
                        </div>

                        <VideoStyle
                            controls
                            // autoPlay
                            loop
                            poster={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${card.thumbnailUrl}`}
                            src={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${card.videoUrl}`}
                            style={{ zIndex: -1 }}
                        ></VideoStyle>
                    </div>
                    <Box>
                        <IconButton type="button" onClick={() => history.go(-1)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <a href={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${card.videoUrl}`} download>
                            <IconButton>
                                <FontAwesomeIcon
                                    icon={faCircleDown}
                                    style={{
                                        color: '#fff',
                                    }}
                                />
                                {/* <DownloadIcon /> */}
                            </IconButton>
                        </a>
                        <Share img={card.thumbnailUrl} comment={card.comment} videoUrl={card.videoUrl} />
                        <VideoDelete cardId={card.cardId} />
                        <div>
                            <CiEdit size="30" onClick={editOn} style={{ color: '#fff', cursor: 'pointer', marginTop: '3px', marginLeft: '5px' }} />
                        </div>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default VideoDetail;
