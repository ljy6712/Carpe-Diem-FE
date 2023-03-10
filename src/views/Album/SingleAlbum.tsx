/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ALBUM_LOADING_REQUEST } from '../../redux/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper';
import SingleAlbumCarousel from './SingleAlbumCarousel';
import SingleAlbumDelete from './SingleAlbumDelete';
import SingleAlbumEdit from './SingleAlbumEdit';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './StyleAlbum.css';

const SingleComponent = styled.div`
    font-family: IBMPlexSansKR-Regular;
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #333;
    margin-top: '20px';
`;

const SingleAlbum = () => {
    const dispatch = useDispatch();
    const { albumId } = useParams();
    const { album } = useSelector((state: any) => state.album);
    useEffect(() => {
        dispatch({
            type: ALBUM_LOADING_REQUEST,
            payload: albumId,
        });
    }, [dispatch]);
    return (
        <>
            <SingleComponent>
                <MdClose
                    size="27"
                    onClick={() => {
                        window.location.replace('/album');
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
                        rotate: 10,
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
                        </div>
                        <div
                            style={{
                                cursor: 'pointer',
                                bottom: '4%',
                                textAlign: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                            }}
                        >
                            <SingleAlbumEdit albumContent={album} />
                            <SingleAlbumDelete albumId={album.albumId} />
                        </div>
                    </SwiperSlide>

                    {album.cardId?.map((cardId: any) => {
                        return (
                            <SwiperSlide key={cardId}>
                                <SingleAlbumCarousel key={cardId} cardInfo={cardId} />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </SingleComponent>
        </>
    );
};

export default SingleAlbum;
