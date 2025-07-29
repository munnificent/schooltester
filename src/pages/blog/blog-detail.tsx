import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Tag, ChevronRight, AlertCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../../api/apiClient';
import { BlogPost, PaginatedResponse } from '../../types';

// --- Компоненты-секции ---

const PostSidebar: React.FC<{ post: BlogPost; relatedPosts: BlogPost[] }> = ({ post, relatedPosts }) => (
    <aside className="space-y-8">
        {/* Author Card */}
        <div className="bg-card border rounded-lg p-5 text-center">
            <img 
                src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.firstName}+${post.author.lastName}`}
                alt={post.author.firstName}
                className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold">{post.author.firstName} {post.author.lastName}</h3>
            <p className="text-sm text-primary">{post.author.role === 'teacher' ? 'Преподаватель' : 'Автор'}</p>
        </div>

        {/* Related Posts */}
        <div>
            <h3 className="font-semibold mb-4">Похожие статьи</h3>
            <div className="space-y-4">
                {relatedPosts.length > 0 ? relatedPosts.map(p => (
                    <Link key={p.id} to={`/blog/${p.slug}`} className="flex items-center gap-3 group">
                        <img src={p.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=256'} alt={p.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                        <div>
                            <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(p.createdAt).toLocaleDateString('ru-RU')}</p>
                        </div>
                    </Link>
                )) : <p className="text-sm text-muted-foreground">Похожих статей нет.</p>}
            </div>
        </div>

        {/* CTA Card */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6">
            <h3 className="font-bold">Нужна помощь с учебой?</h3>
            <p className="text-sm opacity-90 mt-2 mb-4">Наши преподаватели помогут разобраться в сложных темах.</p>
            <Link to="/courses" className="inline-flex items-center justify-center w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition-transform hover:scale-105">
                Подобрать курс
            </Link>
        </div>
    </aside>
);

// --- Компоненты состояний ---
const LoadingState: React.FC = () => (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-pulse">
        <div className="h-5 w-2/5 bg-muted rounded-md mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                <div className="h-10 w-3/4 bg-muted rounded-md"></div>
                <div className="h-6 w-1/4 bg-muted rounded-md"></div>
                <div className="w-full h-80 bg-muted rounded-lg"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
            </div>
        </div>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Не удалось загрузить статью</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <ArrowLeft size={16}/> Вернуться в блог
        </Link>
    </div>
);


// --- Основной компонент страницы ---
const BlogDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPost = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get<BlogPost>(`/blog/posts/${slug}/`);
                setPost(response.data);

                if (response.data.category.id) {
                    const relatedResponse = await apiClient.get<PaginatedResponse<BlogPost>>(`/blog/posts/`, {
                        params: { category: response.data.category.id, exclude_post: response.data.id, limit: 3 }
                    });
                    setRelatedPosts(relatedResponse.data.results);
                }
            } catch (err) {
                setError("Статья не найдена или произошла ошибка.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (isLoading) {
        return <LoadingState />;
    }
    
    if (error || !post) {
        return <ErrorState message={error || "Статья не найдена."} />;
    }

    return (
        <main>
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Основной контент статьи */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8"
                    >
                        {/* Хлебные крошки */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                            <Link to="/blog" className="hover:text-primary">Блог</Link>
                            <ChevronRight size={14} />
                            <span>{post.title}</span>
                        </div>
                        
                        {/* Заголовок */}
                        <header className="mb-8">
                            <Link to={`/blog?category=${post.category.slug}`} className="text-sm font-semibold text-primary mb-2 inline-block">{post.category.name}</Link>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{post.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                                <div className="flex items-center gap-2"><User size={14}/> {post.author.firstName} {post.author.lastName}</div>
                                <div className="flex items-center gap-2"><Calendar size={14}/> {new Date(post.createdAt).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                            </div>
                        </header>
                        
                        {/* Изображение */}
                        <img src={post.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1920'} alt={post.title} className="w-full h-auto object-cover rounded-xl mb-8" />
                        
                        {/* Содержимое статьи */}
                        <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                        
                    </motion.div>
                    
                    {/* Сайдбар */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4"
                    >
                        <PostSidebar post={post} relatedPosts={relatedPosts} />
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default BlogDetailPage;