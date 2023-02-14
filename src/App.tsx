import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import LibraryContent from './views/Contents/LibraryContent/LibraryContent';
import VideoContent from './views/Contents/VideoContent/VideoContent';
import CamContent from './views/Contents/CamContent/CamContent';
import PageContent from './views/Contents/PageContent/PageContent';
import './styles/App.css';
import { createGlobalStyle } from 'styled-components';
import AlbumSinglePage from './views/Album/AlbumSinglePage';
function App() {
    // const history = useHistory();
    // useEffect(() => {
    //   history.push('/'); // 마운트 될 때 /webcam 에 해당하는 페이지로 이동
    // }, [])

    return (
        <Router>
            <Routes>
                <Route>
                    <Route path="/" element={<CamContent />} />
                    <Route path="/video" element={<VideoContent />} />
                    <Route path="/page" element={<PageContent />} />
                    <Route path="/video/:cardId" element={<AlbumSinglePage />} />
                    <Route path="/album" element={<LibraryContent />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
