import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const CardBox = styled.div`
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    text-align: center;
    border-radius: 1rem;
    margin-bottom: 2em;
`;

const EmotionLineChart = (props: any) => {
    return (
        <CardBox style={{ width: '70%', height: '500px', background: '#333', marginLeft: '15%' }}>
            <CardBox>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={700}
                        data={props.data}
                        margin={{
                            top: 20,
                            right: 50,
                            bottom: 50,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: 'white' }} tickMargin={10} />
                        <YAxis tick={{ fill: 'white' }} tickCount={4} allowDecimals={false} />
                        <Tooltip />
                        <Legend wrapperStyle={{ margin: '-2rem 1rem' }} />
                        <Line type="monotone" dataKey="행복해요" stroke="#fdba74" activeDot={{ r: 8 }} strokeWidth={5} />
                        <Line type="monotone" dataKey="슬퍼요" stroke="#67e8f9" activeDot={{ r: 8 }} strokeWidth={5} />
                        <Line type="monotone" dataKey="놀라워요" stroke="#fde047" activeDot={{ r: 8 }} strokeWidth={5} />
                        <Line type="monotone" dataKey="힘들어요" stroke="#86efac" activeDot={{ r: 8 }} strokeWidth={5} />
                        <Line type="monotone" dataKey="화나요" stroke="#fda4af" activeDot={{ r: 8 }} strokeWidth={5} />
                        <Line type="monotone" dataKey="무서워요" stroke="#d8b4fe" activeDot={{ r: 8 }} strokeWidth={5} />
                    </LineChart>
                </ResponsiveContainer>
            </CardBox>
        </CardBox>
    );
};

export default EmotionLineChart;
