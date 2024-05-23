
import { useState, useEffect } from 'react';
import axios from 'axios';

const useBooks = (page, pageSize, sortField, sortOrder) => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://openlibrary.org/people/mekBot/books/want-to-read.json');
        const readingLogEntries = response.data.reading_log_entries;

        // Extract works from reading_log_entries
        const works = readingLogEntries.map(entry => entry.work);

        // Fetch additional author details
        const worksWithDetails = await Promise.all(
          works.map(async (work) => {
            const authorName = work?.author_names[0]?.replace(/\s+/g, '%20'); // Replace spaces with '%20'
            const authorResponse = await axios.get(`https://openlibrary.org/search/authors.json?q=${authorName}`);
            const authorData = authorResponse.data.docs[0];

            return {
              ...work,
              subject: authorData ? authorData.top_subjects : 'N/A',
              author_top_work: authorData ? authorData.top_work : 'N/A',
              author_birth_date: authorData ? authorData.birth_date : 'N/A',
              ratings_average: authorData ? authorData.work_count : 'N/A'
            };
          })
        );

        // Sort the data
        const sortedData = [...worksWithDetails].sort((a, b) => {
          if (!a[sortField] || !b[sortField]) return 0; // Handle missing fields
          if (sortOrder === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        });

        const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

        setBooks(paginatedData);
        setTotalBooks(worksWithDetails.length);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize, sortField, sortOrder]);

  return { books, totalBooks, loading };
};

export default useBooks;
