// 홈 화면

import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';

import { useState } from 'react';
import '../../utils/homepage.css'

import BookCard from "../../components/Common/BookCard"


const testCardData = [];
[...Array(40)].forEach((_, i) => {
	testCardData[i]=i+1;
});

const ITEMS_PER_PAGE = 8;

function HomePage(props) {
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentItems = testCardData.slice(startIdx, endIdx);
    
    const totalPages = Math.ceil(testCardData.length / ITEMS_PER_PAGE);


    return (
        <div className="home-container">
            <Paper elevation={8} className="intro-box" style={{
                background:"hsl(144, 72%, 95%)"}}>
                    <h1>도서 관리 시스템</h1>
                    <Divider variant="middle" style={{width:"50%"}}/>
                    <h2>다양한 저자들의 책을 만나고 나만의 책을 공유해보세요!</h2>
            </Paper>
            <Paper elevation={3} className="card-box" style={{ padding: '20px', margin:"40px" }}>
                <div className="card-list">
                    {[0, 1].map((rowIndex) => {
                        const rowItems = currentItems.slice(rowIndex * 4, (rowIndex + 1) * 4);
                        return (
                            <div
                                key={rowIndex}
                                style={{
                                    display: 'flex',
                                    gap: '70px',
                                    justifyContent: 'center',
                                }}
                            >
                                {rowItems.map((val, idx) => (
                                    <BookCard key={rowIndex * 4 + idx} testIdx={val}/>
                                ))}
                            </div>
                        );
                    })}
                </div>
                <Stack spacing={2} mt={2} alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChange}
                        color="primary"
                    />
                </Stack>
            </Paper>

            
            

        </div>
    );
}

export default HomePage;