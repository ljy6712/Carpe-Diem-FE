import React, { useState } from 'react';
import { ALBUM_DELETE_REQUEST } from '../../redux/types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/system';
import { Typography, Button } from '@mui/material';
import { CiTrash } from 'react-icons/ci';

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

export default function AlbumDelete(props: any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onClickDelete = () => {
        dispatch({
            type: ALBUM_DELETE_REQUEST,
            payload: {
                album_id: props.albumId,
            },
        });
    };
    return (
        <>
            <CiTrash size="28" onClick={handleOpen} style={{ color: '#f4292c', cursor: 'pointer', marginTop: '3px' }} />

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography fontSize={13} color="#64748b" id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        앨범이 삭제됩니다.
                    </Typography>
                    <Typography align="right">
                        <Button
                            onClick={() => {
                                onClickDelete();
                                setTimeout(() => {
                                    window.location.replace('/album');
                                }, 800);
                            }}
                        >
                            확인
                        </Button>
                        <Button onClick={handleClose}>취소</Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}
