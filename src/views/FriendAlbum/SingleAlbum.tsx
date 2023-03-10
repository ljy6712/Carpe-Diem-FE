/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper';
import AlbumCarousel from './AlbumCarousel';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './StyleAlbum.css';
import axios from 'axios';
import { albumData } from '../../types/type';
import { MdClose } from 'react-icons/md';

const SingleComponent = styled.div`
    font-family: IBMPlexSansKR-Regular;
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #333;
`;

const dummy = { albumId: 0, cardId: [], createdAt: '', coverImgUrl: '', updatedAt: '', userId: '', title: '' };

const SingleAlbum = () => {
    const { userId, albumId } = useParams();
    //const { album } = useSelector((state: any) => state.album);
    const [album, setAlbum] = useState<albumData>(dummy);
    console.log('teststtt', albumId);
    React.useEffect(function () {
        axios({
            method: 'get',
            url: `/friendAlbum/${userId}/${albumId}`,
            withCredentials: true,
        })
            .then(function (result) {
                console.log(result.data);
                setAlbum(result.data);
            })
            .catch(function (error) {
                console.error('friend 에러발생: ', error);
            });
    }, []);

    return (
        <SingleComponent>
            <MdClose
                size="27"
                onClick={() => {
                    window.location.replace(`/friendAlbum/${userId}`);
                }}
                style={{ cursor: 'pointer', position: 'absolute', top: '4%', right: '2%' }}
            />
            <Swiper
                className="mySwiper"
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 20,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 500,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[EffectCoverflow, Pagination]}
            >
                <SwiperSlide>
                    <div>
                        <img
                            src={`https://${config.aws.cdn_name}/${album.coverImgUrl}`}
                            style={{
                                margin: '70px auto',
                                height: '15rem',
                                width: '15rem',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 0 0 1rem rgba(255,255,255,0.2)',
                            }}
                        />
                        <div style={{ textAlign: 'center', fontSize: '30px' }}>Title : {album.title}</div>
                    </div>
                </SwiperSlide>

                {album.cardId?.map((cardId: any) => {
                    return (
                        <SwiperSlide key={cardId}>
                            <AlbumCarousel key={cardId} cardInfo={cardId} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </SingleComponent>
    );
};

export default SingleAlbum;
