import { navBarItems } from 'components/appbar/Navbar.component';
import { CreatePost } from 'pages/blog/post/CreatePost.page';
import { Post } from 'pages/blog/post/Post.page';
import { Route, Routes } from 'react-router-dom';
import './App.css';

export function AppRoutes() {
    return (
        <Routes>
            {navBarItems.map((navBarItem, index) => (
                <Route
                    key={index}
                    path={navBarItem.href}
                    element={navBarItem.component}
                />
            ))}
            <Route path="/blog/:postId" element={<Post />} />
            {/* <Route Component={AuthGuard}> */}
            <Route path="/blog/create" element={<CreatePost />} />
            {/* </Route> */}
        </Routes>
    );
}
