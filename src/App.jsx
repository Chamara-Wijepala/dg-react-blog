import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from './api/posts';
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
	const [posts, setPosts] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [postTitle, setPostTitle] = useState('');
	const [postBody, setPostBody] = useState('');
	const [editTitle, setEditTitle] = useState('');
	const [editBody, setEditBody] = useState('');
	const navigate = useNavigate();

	async function handleDelete(id) {
		try {
			await api.delete(`/posts/${id}`);

			const postsList = posts.filter((post) => post.id !== id);
			setPosts(postsList);
			navigate('/');
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
		const datetime = format(new Date(), 'MMMM dd, yyyy pp');
		const newPost = { id, title: postTitle, datetime, body: postBody };

		try {
			const response = await api.post('/posts', newPost);
			const allPosts = [...posts, response.data];

			setPosts(allPosts);
			setPostTitle('');
			setPostBody('');
			navigate('/');
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}
	}

	async function handleEdit(id) {
		const datetime = format(new Date(), 'MMMM dd, yyyy pp');
		const updatedPost = { id, title: editTitle, datetime, body: editBody };

		try {
			const response = await api.put(`/posts/${id}`, updatedPost);
			setPosts(
				posts.map((post) => (post.id === id ? { ...response.data } : post))
			);
			setEditTitle('');
			setEditBody('');
			navigate('/');
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}
	}

	useEffect(() => {
		const filteredResults = posts.filter(
			(post) =>
				post.body.toLowerCase().includes(search.toLowerCase()) ||
				post.title.toLowerCase().includes(search.toLowerCase())
		);

		setSearchResults(filteredResults.reverse());
	}, [posts, search]);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await api.get('/posts');
				setPosts(response.data);
			} catch (error) {
				if (error.response) {
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				} else {
					console.log(`Error: ${error.message}`);
				}
			}
		}

		fetchPosts();
	}, []);

	return (
		<div className="App">
			<Header title="React JS Blog" />
			<Nav search={search} setSearch={setSearch} />

			<Routes>
				<Route path="/" element={<Home posts={searchResults} />} />
				<Route
					path="/post"
					element={
						<NewPost
							postTitle={postTitle}
							setPostTitle={setPostTitle}
							postBody={postBody}
							setPostBody={setPostBody}
							handleSubmit={handleSubmit}
						/>
					}
				/>
				<Route
					path="/edit/:id"
					element={
						<EditPost
							posts={posts}
							editTitle={editTitle}
							setEditTitle={setEditTitle}
							editBody={editBody}
							setEditBody={setEditBody}
							handleEdit={handleEdit}
						/>
					}
				/>
				<Route
					path="/post/:id"
					element={<PostPage posts={posts} handleDelete={handleDelete} />}
				/>
				<Route path="/about" element={<About />} />
				<Route path="*" element={<Missing />} />
			</Routes>

			<Footer />
		</div>
	);
}

export default App;
