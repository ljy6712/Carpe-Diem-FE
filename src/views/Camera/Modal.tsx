import React from 'react';
import { useDispatch } from 'react-redux';
import { USIM_CREATE_REQUEST } from '../../redux/types';
import SwipeableViews from 'react-swipeable-views';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MobileStepper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import ImageUploader from 'react-images-upload';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
    {
        label: 'Upload Usim Modal 01',
        imgPath: `${process.env.PUBLIC_URL}/imgs/upload-usim-modal-01.svg`,
        text: `<Span style="font-size: 15pt; color: #6666CC;">찰나의 순간</Span>을 기록하지 못해서<br> <Span style="font-size: 15pt; color: #6666CC;">후회</span>하신 적 있지 않으신가요?`,
    },
    {
        label: 'Upload Usim Modal 02',
        imgPath: `${process.env.PUBLIC_URL}/imgs/upload-usim-modal-02.svg`,
        text: '사용자의 <Span style="font-size: 15pt; color: #6666CC;">얼굴과 표정</span>을 디텍팅하여<br> 의미있는 순간을 <Span style="font-size: 15pt; color: #6666CC;">짧은 비디오</span>로<br> 만들어드립니다.',
    },
    {
        label: 'Upload Usim Modal 03',
        imgPath: `${process.env.PUBLIC_URL}/imgs/upload-usim-modal-03.svg`,
        text: '원하는 영상을 골라 <br><Span style="font-size: 15pt; color: #6666CC;">여러분만의 앨범</span>을 만들고<br>친구들과 공유하세요.',
    },
    {
        label: 'Upload Usim Modal 04',
        imgPath: `${process.env.PUBLIC_URL}/imgs/upload-usim-modal-04.svg`,
        text: '정확한 디텍팅을 위해<br> <Span style="font-size: 15pt; color: #6666CC;">얼굴 사진 3장</span>을 업로드하고<br> 지금 바로 시작해보세요!',
    },
];

const Modal = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;
    const [pictures, setPictures] = React.useState<any[]>([]);

    const onDrop = (picture: any) => {
        let count = 0;

        const filteredPictures = picture.map((p: any) => {
            // 파일명에서 확장자 추출
            const extension = p.name.split('.').pop();
            const timestamp = Date.now();

            count += 1;

            // 새로운 파일 객체 생성
            return new File([p], `${count}_${timestamp}.${extension}`, { type: p.type });
        });
        setPictures(filteredPictures);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const submitImg = () => {
        const formData = new FormData();

        formData.append('imgs', pictures[0]);
        formData.append('imgs', pictures[1]);
        formData.append('imgs', pictures[2]);

        dispatch({
            type: USIM_CREATE_REQUEST,
            payload: formData,
        });

        setTimeout(() => {
            history.go(0);
        }, 800);
    };
    return (
        <React.Fragment>
            <Dialog fullWidth={true} maxWidth="sm" sx={{ height: 'auto' }} open={true}>
                <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#ddd6fe' }}>
                    Welcome to <span style={{ fontSize: '15pt', color: '#6666CC' }}>CarpeDiem</span>!
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ddd6fe', pt: '15px' }}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {images.map((step, index) => (
                            <div key={step.label}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 255,
                                                display: 'block',
                                                maxWidth: 400,
                                                overflow: 'hidden',
                                                width: '100%',
                                                backgroundColor: '#ddd6fe',
                                            }}
                                            src={step.imgPath}
                                            alt={step.label}
                                        />
                                    ) : null}
                                </Box>
                                <DialogContentText
                                    sx={{ textAlign: 'center', mt: '20px', mb: '10px' }}
                                    dangerouslySetInnerHTML={{ __html: step.text }}
                                ></DialogContentText>
                            </div>
                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        sx={{ backgroundColor: '#ddd6fe', mb: '10px' }}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                Next
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                            </Button>
                        }
                    />
                    <DialogContentText sx={{ mt: '25px', mb: '10px' }}>얼굴 이미지 3개를 업로드해주세요</DialogContentText>
                    <ImageUploader withPreview={true} withIcon={false} onChange={onDrop} imgExtension={['.jpg', '.png']} maxFileSize={5242880} />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#ddd6fe' }}>
                    {pictures.length === 3 ? (
                        <Button sx={{ backgroundColor: '#6666CC' }} variant="contained" onClick={submitImg}>
                            Start
                        </Button>
                    ) : (
                        <Button disabled>Start</Button>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default Modal;
