import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import About from './pages/About';
import Missing from './pages/Missing';

function App() {
	return (
		<div className="App">
			<Header title="React JS Blog" />
			<DataProvider>
				<Nav />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/post" element={<NewPost />} />
					<Route path="/post/:id" element={<PostPage />} />
					<Route path="/edit/:id" element={<EditPost />} />
					<Route path="/about" element={<About />} />
					<Route path="*" element={<Missing />} />
				</Routes>
			</DataProvider>
			<Footer />
		</div>
	);
}

export default App;
