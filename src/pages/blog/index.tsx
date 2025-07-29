import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Rss, BookText, AlertCircle } from 'lucide-react';

import apiClient from '../../api/apiClient';
import { useDebounce } from '../../hooks/useDebounce';
import { BlogPost, BlogCategory, PaginatedResponse } from '../../types';

// --- Компоненты-секции ---

const BlogHeader: React.FC = () => (
  <div className="bg-muted">
    <div className="container mx-auto px-4 py-16 md:py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Наш Блог</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Полезные материалы, советы экспертов и новости из мира образования для учеников и родителей.
        </p>
      </motion.div>
    </div>
  </div>
);

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="bg-card border rounded-lg overflow-hidden flex flex-col h-full group">
    <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
      <img 
        src={post.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1920'} 
        alt={post.title} 
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </Link>
    <div className="p-5 flex flex-col flex-grow">
      <p className="text-sm font-medium text-primary mb-2">{post.category.name}</p>
      <h3 className="text-lg font-semibold text-foreground flex-grow">
        <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
      </h3>
      <div className="mt-4 text-xs text-muted-foreground">
        <span>{new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span className="mx-1.5">•</span>
        <span>{post.author.firstName} {post.author.lastName}</span>
      </div>
    </div>
  </div>
);

// --- Компоненты состояний ---
const LoadingState: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg">
                <div className="h-48 bg-muted"></div>
                <div className="p-5 space-y-3">
                    <div className="h-4 w-1/4 bg-muted rounded"></div>
                    <div className="h-6 w-full bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-20 bg-muted rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">Статьи не найдены</h3>
        <p className="mt-2 text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос.</p>
        <button onClick={onReset} className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Сбросить фильтры
        </button>
    </div>
);


// --- Основной компонент страницы ---
const BlogIndexPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchBlogData = useCallback(async () => {
        setIsLoading(true);
        try {
            const categoriesPromise = apiClient.get<BlogCategory[]>('/blog/categories/');
            
            const postsParams = {
                search: debouncedSearch,
                category: selectedCategory === 'all' ? '' : selectedCategory
            };
            const postsPromise = apiClient.get<PaginatedResponse<BlogPost>>('/blog/posts/', { params: postsParams });

            const [categoriesResponse, postsResponse] = await Promise.all([categoriesPromise, postsPromise]);

            setCategories([{ id: 0, name: "Все категории", slug: "all" }, ...categoriesResponse.data]);
            setPosts(postsResponse.data.results);

        } catch (error) {
            console.error("Failed to fetch blog data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedCategory]);

    useEffect(() => {
        fetchBlogData();
    }, [fetchBlogData]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };

    return (
        <main>
            <BlogHeader />
            <div className="container mx-auto px-4 py-16">
                {/* Фильтры */}
                <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 md:max-w-xs">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Поиск статей..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Сетка постов */}
                {isLoading ? <LoadingState /> : posts.length > 0 ? (
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                           <motion.div layout key={post.id}>
                             <PostCard post={post} />
                           </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <EmptyState onReset={handleResetFilters} />
                )}
            </div>
        </main>
    );
};

export default BlogIndexPage;