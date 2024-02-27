import { useState, useEffect } from 'react';
import axios from 'axios';

function useAxiosFetch(dataUrl) {
	const [data, setData] = useState([]);
	const [fetchError, setFetchError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;
		// The AbortController objects allows you to abort web requests
		const controller = new AbortController();

		async function fetchData(url) {
			setIsLoading(true);
			try {
				const response = await axios.get(url, {
					// Associates the signal and controller with the request, allowing
					// you to abort it.
					signal: controller.signal,
				});
				if (isMounted) {
					setData(response.data);
					setFetchError(null);
				}
			} catch (error) {
				if (isMounted) {
					setFetchError(error.message);
					setData([]);
				}
			} finally {
				isMounted && setIsLoading(false);
			}
		}

		fetchData(dataUrl);

		// cleanup
		return () => {
			isMounted = false;
			// Abort the request
			controller.abort();
		};
	}, [dataUrl]);

	return { data, fetchError, isLoading };
}

export default useAxiosFetch;
